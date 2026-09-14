import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const websiteDir = path.join(rootDir, "website");
const deployDir = path.join(rootDir, "to_deploy");

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.name.endsWith(".bak") || entry.name.endsWith(".map") || entry.name === "offline") continue;
        if (entry.isDirectory()) copyDirRecursive(srcPath, destPath);
        else fs.copyFileSync(srcPath, destPath);
    }
}

console.log("Preparing to_deploy...");
if (fs.existsSync(deployDir)) fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });
copyDirRecursive(websiteDir, deployDir);
fs.writeFileSync(path.join(deployDir, ".nojekyll"), "");

console.log("Deploying to gh-pages...");
execSync("git init", { cwd: deployDir, stdio: "inherit" });
execSync("git checkout -b gh-pages", { cwd: deployDir, stdio: "inherit" });
execSync("git add -A", { cwd: deployDir, stdio: "inherit" });
execSync('git commit -m "Deploy MegaBox to GitHub Pages with all bundles"', { cwd: deployDir, stdio: "inherit" });
const remoteUrl = execSync("git config --get remote.origin.url", { cwd: rootDir }).toString().trim();
execSync(`git push -f "${remoteUrl}" gh-pages`, { cwd: deployDir, stdio: "inherit" });
console.log("✓ Done!");
