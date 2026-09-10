// Copyright (c) 2012-2026 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export interface ZipFileEntry {
    name: string;
    data: Uint8Array | ArrayBuffer | string;
    lastModified?: Date;
}

export class ZipArchive {
    private static _crcTable: Uint32Array | null = null;

    private static getCrcTable(): Uint32Array {
        if (this._crcTable != null) return this._crcTable;
        const table = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let k = 0; k < 8; k++) {
                c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[i] = c >>> 0;
        }
        this._crcTable = table;
        return table;
    }

    public static crc32(data: Uint8Array): number {
        const table = this.getCrcTable();
        let crc = 0 ^ (-1);
        for (let i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
        }
        return (crc ^ (-1)) >>> 0;
    }

    private static dateToDos(d: Date): { date: number, time: number } {
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const seconds = Math.floor(d.getSeconds() / 2);

        const dosDate = ((year - 1980) << 9) | (month << 5) | day;
        const dosTime = (hours << 11) | (minutes << 5) | seconds;
        return { date: dosDate, time: dosTime };
    }

    public static async createZip(entries: ZipFileEntry[]): Promise<Blob> {
        const encoder = new TextEncoder();
        const localHeaders: Uint8Array[] = [];
        const centralEntries: Uint8Array[] = [];
        let offset = 0;

        for (const entry of entries) {
            let fileBytes: Uint8Array;
            if (typeof entry.data === "string") {
                fileBytes = encoder.encode(entry.data);
            } else if (entry.data instanceof ArrayBuffer) {
                fileBytes = new Uint8Array(entry.data);
            } else {
                fileBytes = entry.data;
            }

            const nameBytes = encoder.encode(entry.name);
            const crc = this.crc32(fileBytes);
            const size = fileBytes.length;
            const { date, time } = this.dateToDos(entry.lastModified || new Date());

            // Local file header (30 bytes + name length + data length)
            const localHeader = new Uint8Array(30 + nameBytes.length + size);
            const localView = new DataView(localHeader.buffer);

            localView.setUint32(0, 0x04034b50, true); // Local header signature
            localView.setUint16(4, 20, true);         // Version needed (2.0)
            localView.setUint16(6, 0x0800, true);     // General purpose flag (UTF-8)
            localView.setUint16(8, 0, true);          // Compression: Store (0)
            localView.setUint16(10, time, true);      // Mod time
            localView.setUint16(12, date, true);      // Mod date
            localView.setUint32(14, crc, true);       // CRC-32
            localView.setUint32(18, size, true);      // Compressed size
            localView.setUint32(22, size, true);      // Uncompressed size
            localView.setUint16(26, nameBytes.length, true); // Name length
            localView.setUint16(28, 0, true);         // Extra field length

            localHeader.set(nameBytes, 30);
            localHeader.set(fileBytes, 30 + nameBytes.length);
            localHeaders.push(localHeader);

            // Central directory header (46 bytes + name length)
            const centralHeader = new Uint8Array(46 + nameBytes.length);
            const centralView = new DataView(centralHeader.buffer);

            centralView.setUint32(0, 0x02014b50, true); // Central header signature
            centralView.setUint16(4, 20, true);         // Version made by
            centralView.setUint16(6, 20, true);         // Version needed
            centralView.setUint16(8, 0x0800, true);     // UTF-8
            centralView.setUint16(10, 0, true);         // Compression: Store
            centralView.setUint16(12, time, true);
            centralView.setUint16(14, date, true);
            centralView.setUint32(16, crc, true);
            centralView.setUint32(20, size, true);
            centralView.setUint32(24, size, true);
            centralView.setUint16(28, nameBytes.length, true);
            centralView.setUint16(30, 0, true);         // Extra length
            centralView.setUint16(32, 0, true);         // Comment length
            centralView.setUint16(34, 0, true);         // Disk start
            centralView.setUint16(36, 0, true);         // Internal attr
            centralView.setUint32(38, 0, true);         // External attr
            centralView.setUint32(42, offset, true);    // Local header offset

            centralHeader.set(nameBytes, 46);
            centralEntries.push(centralHeader);

            offset += localHeader.length;
        }

        const centralDirOffset = offset;
        let centralDirSize = 0;
        for (const cd of centralEntries) {
            centralDirSize += cd.length;
        }

        // End of central directory record (22 bytes)
        const eocd = new Uint8Array(22);
        const eocdView = new DataView(eocd.buffer);
        eocdView.setUint32(0, 0x06054b50, true);       // EOCD signature
        eocdView.setUint16(4, 0, true);                // Disk number
        eocdView.setUint16(6, 0, true);                // Central dir disk
        eocdView.setUint16(8, entries.length, true);   // Entries on this disk
        eocdView.setUint16(10, entries.length, true);  // Total entries
        eocdView.setUint32(12, centralDirSize, true);  // Central dir size
        eocdView.setUint32(16, centralDirOffset, true);// Central dir offset
        eocdView.setUint16(20, 0, true);               // Comment length

        const allChunks: any[] = [...localHeaders, ...centralEntries, eocd];
        return new Blob(allChunks, { type: "application/zip" });
    }

    public static async readZip(buffer: ArrayBuffer): Promise<Map<string, Uint8Array>> {
        const result = new Map<string, Uint8Array>();
        const view = new DataView(buffer);
        const decoder = new TextDecoder();

        // Search for End of Central Directory signature (0x06054b50) from end
        let eocdOffset = -1;
        for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
            if (view.getUint32(i, true) === 0x06054b50) {
                eocdOffset = i;
                break;
            }
        }

        if (eocdOffset === -1) {
            throw new Error("Invalid ZIP file: End of central directory record not found");
        }

        const totalEntries = view.getUint16(eocdOffset + 10, true);
        const centralDirOffset = view.getUint32(eocdOffset + 16, true);

        let curOffset = centralDirOffset;
        for (let entryIdx = 0; entryIdx < totalEntries; entryIdx++) {
            if (view.getUint32(curOffset, true) !== 0x02014b50) {
                break;
            }

            const compression = view.getUint16(curOffset + 10, true);
            const compSize = view.getUint32(curOffset + 20, true);
            const uncompSize = view.getUint32(curOffset + 24, true);
            const nameLen = view.getUint16(curOffset + 28, true);
            const extraLen = view.getUint16(curOffset + 30, true);
            const commentLen = view.getUint16(curOffset + 32, true);
            const localOffset = view.getUint32(curOffset + 42, true);

            const nameBytes = new Uint8Array(buffer, curOffset + 46, nameLen);
            const fileName = decoder.decode(nameBytes);

            // Read from local header
            if (view.getUint32(localOffset, true) === 0x04034b50) {
                const localNameLen = view.getUint16(localOffset + 26, true);
                const localExtraLen = view.getUint16(localOffset + 28, true);
                const dataStart = localOffset + 30 + localNameLen + localExtraLen;

                const rawData = new Uint8Array(buffer, dataStart, compSize);

                if (compression === 0) {
                    // Stored (no compression)
                    const fileCopy = new Uint8Array(uncompSize);
                    fileCopy.set(rawData);
                    result.set(fileName, fileCopy);
                } else if (compression === 8) {
                    // Deflate compression: decompress using DecompressionStream if available
                    if (typeof DecompressionStream !== "undefined") {
                        try {
                            const ds = new DecompressionStream("deflate-raw");
                            const writer = ds.writable.getWriter();
                            writer.write(rawData);
                            writer.close();
                            const response = new Response(ds.readable);
                            const decompressed = await response.arrayBuffer();
                            result.set(fileName, new Uint8Array(decompressed));
                        } catch (e) {
                            console.warn(`Failed to decompress ${fileName}:`, e);
                        }
                    }
                }
            }

            curOffset += 46 + nameLen + extraLen + commentLen;
        }

        return result;
    }
}
