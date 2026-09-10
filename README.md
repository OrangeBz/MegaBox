# MegaBox Beta

**MegaBox** is an advanced, modernized online digital audio workstation (DAW) and tracker for sketching, composing, and sharing instrumental chiptune and sampled music.

🌐 **Live Application:** [https://orangebz.github.io/MegaBox/](https://orangebz.github.io/MegaBox/)

MegaBox is a major expansion and modernization built upon the foundations of [UltraBox](https://ultraabox.github.io), [JummBox](https://github.com/jummbus/jummbox), and the original [BeepBox](https://beepbox.co) by [John Nesky](http://www.johnnesky.com/).

---

## ✨ Features

- **Cross-Compatibility**: Full backwards compatibility to import and export songs across MegaBox, UltraBox, JummBox, AbyssBox, BeepBox, and other community forks.
- **Custom Samples & Native Storage**: Persistent in-browser sample management powered by IndexedDB.
- **Modern Responsive UI**: Dedicated mobile and tablet workflows, collapsible menus, floating transport controls, and customizable themes.
- **Full Synth Engine**: FM synthesis (up to 6 operators), supersaw, harmonics, PWM, bitcrushing, distortion, custom waveforms, envelopes, and microtonal scales.
- **PWA & Offline Ready**: Installable Progressive Web App with full offline capabilities.
- **Project Bundles (.mgb / .zip)**: Export and import complete song projects with all embedded custom samples.

All song data is encoded directly into the URL hash or can be exported to `.mgb`, `.json`, `.mid`, `.wav`, and `.mp3`.

---

## 🛠️ Compiling & Development

MegaBox is written in [TypeScript](https://www.typescriptlang.org/) and built with [Node.js](https://nodejs.org/).

### Prerequisites
- Node.js (v18 or newer)
- npm

### Setup
```bash
git clone https://github.com/OrangeBz/MegaBox.git
cd MegaBox
npm install
```

### Build Scripts
```bash
# Build everything (Synth, Player, and Editor)
npm run build

# Build individual modules
npm run build-synth
npm run build-player
npm run build-editor

# Watch mode during development
npm run watch
```

---

## 📂 Project Structure

- `synth/`: The core audio synthesis engine and sound generator.
- `editor/`: The interactive tracker interface, layout management, and UI controls.
- `player/`: Lightweight standalone player widget for embedding songs.
- `website/`: Production web assets, templates, soundbanks, and HTML shells.
- `build/`: Build pipelines, bundling scripts, and minification configs.

---

## 📜 License & Credits

- **MegaBox** developed and maintained by **OrangeBz**.
- Distributed under the [MIT License](LICENSE.md).
- Special thanks to [John Nesky](http://www.johnnesky.com/) (creator of BeepBox) and the entire BeepBox / JummBox / UltraBox modding community!