import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { minify } from 'terser';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function runTsc(configFile, noEmit = false) {
    console.log(`Running tsc with ${configFile || 'default tsconfig'}...`);
    const tscPath = path.join(rootDir, 'node_modules', 'typescript', 'lib', 'tsc.js');
    let args = configFile ? ` -p ${configFile}` : '';
    if (noEmit) args += ' --noEmit';
    execSync(`node "${tscPath}"${args}`, { stdio: 'inherit', cwd: rootDir });
}

async function bundleAndMinify({ entryFile, outputFile, outputMinFile, outputMapFile, minMapUrl, isOffline = false, globalName = 'beepbox' }) {
    console.log(`Bundling ${entryFile} -> ${outputFile}...`);
    
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    const bundle = await rollup({
        input: entryFile,
        context: 'exports',
        plugins: [
            sourcemaps(),
            resolve()
        ]
    });

    await bundle.write({
        file: outputFile,
        format: 'iife',
        name: globalName,
        sourcemap: true
    });

    await bundle.close();

    console.log(`Minifying ${outputFile} -> ${outputMinFile}...`);
    const code = fs.readFileSync(outputFile, 'utf8');
    const inputMap = fs.existsSync(outputFile + '.map') ? fs.readFileSync(outputFile + '.map', 'utf8') : undefined;

    const minified = await minify(code, {
        compress: {
            global_defs: {
                OFFLINE: isOffline
            }
        },
        mangle: {
            properties: {
                regex: /^_.+/
            }
        },
        sourceMap: outputMapFile ? {
            content: inputMap,
            url: minMapUrl
        } : false
    });

    fs.writeFileSync(outputMinFile, minified.code, 'utf8');
    if (outputMapFile && minified.map) {
        fs.writeFileSync(outputMapFile, minified.map.toString(), 'utf8');
    }
    console.log(`✓ Generated ${outputMinFile} (${(minified.code.length / 1024).toFixed(1)} KB)`);
}

async function buildOfflineHtml() {
    console.log('Building standalone offline HTML file...');
    const templatePath = path.join(rootDir, 'website', 'ultrabox_offline_template.html');
    if (!fs.existsSync(templatePath)) {
        console.warn('Offline template not found, skipping offline HTML.');
        return;
    }

    let html = fs.readFileSync(templatePath, 'utf8');
    const replacements = [
        { placeholder: 'INSERT_BEEPBOX_SOURCE_HERE', file: 'website/beepbox_editor.min.js' },
        { placeholder: 'INSERT_JQUERY_MIN_JS_HERE', file: 'website/offline/jquery-3.4.1.min.js' },
        { placeholder: 'INSERT_SELECT2_MIN_JS_HERE', file: 'website/offline/select2.min.js' },
        { placeholder: 'INSERT_SELECT2_CSS_HERE', file: 'website/offline/select2.min.css' },
        { placeholder: 'INSERT_DRUMSAMPLES_SCRIPT_HERE', file: 'website/drumsamples.js' },
        { placeholder: 'INSERT_KIRBYSAMPLES_SCRIPT_HERE', file: 'website/kirby_samples.js' },
        { placeholder: 'INSERT_SAMPLES_SCRIPT_HERE', file: 'website/samples.js' },
        { placeholder: 'INSERT_SAMPLES2_SCRIPT_HERE', file: 'website/samples2.js' },
        { placeholder: 'INSERT_SAMPLES3_SCRIPT_HERE', file: 'website/samples3.js' },
        { placeholder: 'INSERT_WARIOSAMPLES_SCRIPT_HERE', file: 'website/wario_samples.js' },
        { placeholder: 'INSERT_MARIOPAINTBOXSAMPLES_SCRIPT_HERE', file: 'website/mario_paintbox_samples.js' },
        { placeholder: 'INSERT_NINTARIBOXSAMPLES_SCRIPT_HERE', file: 'website/nintaribox_samples.js' }
    ];

    for (const r of replacements) {
        const filePath = path.join(rootDir, r.file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            html = html.replace(r.placeholder, () => content);
        }
    }

    const outDir = path.join(rootDir, 'to_deploy');
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'ultrabox-HTML.html');
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`✓ Standalone HTML generated at ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

function watchMode() {
    console.log('Starting watch mode for development...');
    const watchDirs = ['editor', 'synth', 'player', 'global'];
    let timeout = null;

    const triggerBuild = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            console.log('\n[Watch] Changes detected, rebuilding...');
            try {
                runTsc();
                await bundleAndMinify({
                    entryFile: path.join(rootDir, 'build', 'editor', 'main.js'),
                    outputFile: path.join(rootDir, 'website', 'beepbox_editor.js'),
                    outputMinFile: path.join(rootDir, 'website', 'beepbox_editor.min.js'),
                    outputMapFile: path.join(rootDir, 'website', 'beepbox_editor.min.js.map'),
                    minMapUrl: 'beepbox_editor.min.js.map'
                });
                console.log('[Watch] Rebuild complete. Ready.');
            } catch (e) {
                console.error('[Watch] Build error:', e.message);
            }
        }, 200);
    };

    for (const dir of watchDirs) {
        const fullPath = path.join(rootDir, dir);
        if (fs.existsSync(fullPath)) {
            fs.watch(fullPath, { recursive: true }, (event, filename) => {
                if (filename && (filename.endsWith('.ts') || filename.endsWith('.js'))) {
                    triggerBuild();
                }
            });
        }
    }
    console.log(`Watching [${watchDirs.join(', ')}] for changes. Press Ctrl+C to exit.`);
}

async function main() {
    const target = process.argv[2] || 'all';

    if (target === 'watch' || target === 'dev') {
        watchMode();
        return;
    }

    if (target === 'typecheck' || target === 'check') {
        runTsc('tsconfig_synth_only.json', true);
        runTsc('tsconfig_player.json', true);
        runTsc(null, true);
        console.log('✓ Typecheck passed with 0 errors.');
        return;
    }

    if (target === 'all' || target === 'synth') {
        runTsc('tsconfig_synth_only.json');
        await bundleAndMinify({
            entryFile: path.join(rootDir, 'build', 'synth', 'synth.js'),
            outputFile: path.join(rootDir, 'website', 'beepbox_synth.js'),
            outputMinFile: path.join(rootDir, 'website', 'beepbox_synth.min.js'),
            outputMapFile: path.join(rootDir, 'website', 'beepbox_synth.min.js.map'),
            minMapUrl: 'beepbox_synth.min.js.map'
        });
    }

    if (target === 'all' || target === 'player') {
        runTsc('tsconfig_player.json');
        await bundleAndMinify({
            entryFile: path.join(rootDir, 'build', 'player', 'main.js'),
            outputFile: path.join(rootDir, 'website', 'player', 'beepbox_player.js'),
            outputMinFile: path.join(rootDir, 'website', 'player', 'beepbox_player.min.js'),
            outputMapFile: path.join(rootDir, 'website', 'player', 'beepbox_player.min.js.map'),
            minMapUrl: 'beepbox_player.min.js.map'
        });
    }

    if (target === 'all' || target === 'editor') {
        runTsc();
        await bundleAndMinify({
            entryFile: path.join(rootDir, 'build', 'editor', 'main.js'),
            outputFile: path.join(rootDir, 'website', 'beepbox_editor.js'),
            outputMinFile: path.join(rootDir, 'website', 'beepbox_editor.min.js'),
            outputMapFile: path.join(rootDir, 'website', 'beepbox_editor.min.js.map'),
            minMapUrl: 'beepbox_editor.min.js.map'
        });
    }

    if (target === 'offline-html' || target === 'build-offline-html') {
        await buildOfflineHtml();
    }

    console.log('Build finished successfully!');
}

main().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
