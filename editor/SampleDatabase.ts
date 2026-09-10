// Copyright (c) 2012-2026 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export interface SampleRecord {
    name: string;
    fileName: string;
    data: ArrayBuffer;
    type?: string;
    sampleRate?: number;
    rootKey?: number;
    size?: number;
    updatedAt?: number;
}

export class SampleDatabase {
    private static readonly DB_NAME = "MegaBox_Samples_DB";
    private static readonly DB_VERSION = 1;
    private static readonly STORE_NAME = "samples";

    private static _dbPromise: Promise<IDBDatabase> | null = null;
    private static readonly _blobUrlCache: Map<string, string> = new Map<string, string>();

    public static async open(): Promise<IDBDatabase> {
        if (this._dbPromise != null) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            if (typeof indexedDB === "undefined") {
                reject(new Error("IndexedDB is not supported in this environment"));
                return;
            }

            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: "name" });
                }
            };

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                resolve(db);
            };

            request.onerror = (event) => {
                this._dbPromise = null;
                reject((event.target as IDBOpenDBRequest).error);
            };
        });

        return this._dbPromise;
    }

    public static async saveSample(record: SampleRecord): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, "readwrite");
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.put({
                ...record,
                updatedAt: record.updatedAt || Date.now()
            });

            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    public static async getSample(name: string): Promise<SampleRecord | null> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, "readonly");
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.get(name);

            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    }

    public static async getAllSamples(): Promise<SampleRecord[]> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, "readonly");
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.getAll();

            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    public static async deleteSample(name: string): Promise<void> {
        const db = await this.open();
        if (this._blobUrlCache.has(name)) {
            const oldUrl = this._blobUrlCache.get(name)!;
            try { URL.revokeObjectURL(oldUrl); } catch (_) {}
            this._blobUrlCache.delete(name);
        }
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, "readwrite");
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.delete(name);

            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    public static async clearAll(): Promise<void> {
        const db = await this.open();
        for (const url of this._blobUrlCache.values()) {
            try { URL.revokeObjectURL(url); } catch (_) {}
        }
        this._blobUrlCache.clear();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.STORE_NAME, "readwrite");
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.clear();

            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    public static getOrCreateBlobUrl(record: SampleRecord): string {
        if (this._blobUrlCache.has(record.name)) {
            return this._blobUrlCache.get(record.name)!;
        }

        const mime = record.type || (record.name.endsWith(".mp3") ? "audio/mp3" : record.name.endsWith(".ogg") ? "audio/ogg" : "audio/wav");
        const blob = new Blob([record.data], { type: mime });
        const url = URL.createObjectURL(blob);
        this._blobUrlCache.set(record.name, url);
        return url;
    }

    public static getBlobUrl(name: string): string | undefined {
        return this._blobUrlCache.get(name);
    }

    public static registerBlobUrl(name: string, url: string): void {
        this._blobUrlCache.set(name, url);
    }
}
