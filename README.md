# MegaBox Beta

MegaBox is an online tool for sketching, composing, and sharing instrumental music and custom audio tracks.

Live Application: [https://orangebz.github.io/MegaBox/](https://orangebz.github.io/MegaBox/)

MegaBox is built upon the foundations of [UltraBox](https://ultraabox.github.io), [JummBox](https://github.com/jummbus/jummbox), and original [BeepBox](https://beepbox.co) by [John Nesky](http://www.johnnesky.com/).

---

## Features

- **Cross-Compatibility**: Import and export songs across MegaBox, UltraBox, JummBox, AbyssBox, and BeepBox.
- **Custom Audio & Samples**: Load and store your own audio files directly in your browser.
- **Flexible Interface**: Rearrange, dock, or lock workspace panels to fit your workflow on desktop and mobile.
- **Sound Engine**: 6-operator FM synthesis, custom wave shapes, distortion, filters, and multi-voice unison.
- **Offline Mode**: Works offline as a Progressive Web App once loaded.
- **Project Export**: Save and share songs as URL links or package files (`.mgb`, `.mid`, `.wav`, `.mp3`).

---

## Compiling & Development

MegaBox is written in [TypeScript](https://www.typescriptlang.org/) and built with [Node.js](https://nodejs.org/).

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

## Project Structure

- `synth/`: Core audio synthesis engine.
- `editor/`: User interface and tracker controls.
- `player/`: Standalone player widget for embedding songs.
- `website/`: Production web templates and asset shells.
- `build/`: Build scripts and compilation utilities.

---

## License & Credits

- Created and maintained by **OrangeBz**.
- Distributed under the [MIT License](LICENSE.md).
- Special thanks to John Nesky and the BeepBox / JummBox / UltraBox modding community!