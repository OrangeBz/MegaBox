import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleFiles = [
    'samples.js',
    'samples2.js',
    'samples3.js',
    'drumsamples.js',
    'wario_samples.js',
    'kirby_samples.js',
    'nintaribox_samples.js',
    'mario_paintbox_samples.js'
];

function convertFile(filename) {
    const filePath = path.join(__dirname, '..', 'website', filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }

    console.log(`Processing ${filename}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const originalSize = fs.statSync(filePath).size;

    // Match variable definitions: let/var/const name = [ numbers ];
    const re = /(?:let|var|const)\s+([a-zA-Z0-9_]+)\s*=\s*\[([\s\S]*?)\];/g;
    let match;
    let out = 'function _b64ToF32(b64){var bin=atob(b64),len=bin.length,bytes=new Uint8Array(len);for(var i=0;i<len;i++)bytes[i]=bin.charCodeAt(i);return new Float32Array(bytes.buffer);}\n';
    let varCount = 0;

    while ((match = re.exec(content)) !== null) {
        const varName = match[1];
        const numMatches = match[2].match(/-?[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/g) || [];
        const f32 = new Float32Array(numMatches.map(Number));
        const buf = Buffer.from(f32.buffer);
        const b64 = buf.toString('base64');
        out += `var ${varName} = _b64ToF32("${b64}");\n`;
        varCount++;
    }

    if (varCount > 0) {
        // Backup original if not already backed up
        const backupPath = filePath + '.bak';
        if (!fs.existsSync(backupPath)) {
            fs.writeFileSync(backupPath, content, 'utf8');
        }

        fs.writeFileSync(filePath, out, 'utf8');
        const newSize = fs.statSync(filePath).size;
        console.log(`✓ ${filename}: ${varCount} samples converted. ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - newSize / originalSize) * 100)}% reduction)`);
    } else {
        console.warn(`No sample arrays found in ${filename}`);
    }
}

for (const f of sampleFiles) {
    convertFile(f);
}
console.log('Sample optimization complete!');
