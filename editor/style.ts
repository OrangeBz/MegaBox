// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { getLocalStorageItem } from "../synth/SynthConfig";
import {ColorConfig} from "./ColorConfig";
import {HTML} from "imperative-html/dist/esm/elements-strict";


// Determine if the user's browser/OS adds scrollbars that occupy space.
// See: https://www.filamentgroup.com/lab/scrollbars/
const scrollBarTest: HTMLDivElement = document.body.appendChild(HTML.div({ style: "width:30px; height:30px; overflow: auto;" },
	HTML.div({ style: "width:100%;height:40px" }),
));
if ((<any>scrollBarTest).firstChild.clientWidth < 30) {
	document.documentElement.classList.add("obtrusive-scrollbars");
}
document.body.removeChild(scrollBarTest);


document.head.appendChild(HTML.style({ type: "text/css" }, `

/* Note: "#" symbols need to be encoded as "%23" in SVG data urls, otherwise they are interpreted as fragment identifiers! */
:root {
	--pattern-area-height: 481px;
	--primary-left-width: 1fr;
	--settings-area-width: 192px;
	--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
	--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
	--border-subtle: #2e2e33;
	--border-default: #3f3f46;
	--border-focus: #71717a;
	--shadow-inset-slot: inset 0 1px 3px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(0, 0, 0, 0.4);
	--shadow-pressed-btn: inset 0 2px 4px rgba(0, 0, 0, 0.6);
	--glow-green: 0 0 8px rgba(34, 197, 94, 0.4);
	--glow-orange: 0 0 8px rgba(249, 115, 22, 0.4);
	--glow-red: 0 0 8px rgba(239, 68, 68, 0.4);
	--glow-amber: 0 0 8px rgba(234, 179, 8, 0.4);
	--glow-cyan: 0 0 8px rgba(56, 189, 248, 0.4);
	--accent-signal-green: #22c55e;
	--accent-signal-amber: #eab308;
	--accent-signal-red: #ef4444;
	--accent-rec-orange: #f97316;
	--accent-mod-cyan: #38bdf8;
	--button-size: 26px;
	--settings-area-width: 192px;
	--internal-play-symbol: var(--play-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path d="M -5 -8 L -5 8 L 8 0 z" fill="gray"/></svg>'));
	--internal-pause-symbol: var(--pause-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><rect x="-5" y="-7" width="4" height="14" fill="gray"/><rect x="3" y="-7" width="4" height="14" fill="gray"/></svg>'));
	--internal-record-symbol: var(--record-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><circle cx="0" cy="0" r="6" fill="gray"/></svg>'));
	--internal-stop-symbol: var(--stop-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><rect x="-6" y="-6" width="12" height="12" fill="gray"/></svg>'));
	--internal-prev-bar-symbol: var(--prev-bar-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><rect x="-6" y="-6" width="2" height="12" fill="gray"/><path d="M 6 -6 L 6 6 L -3 0 z" fill="gray"/></svg>'));
	--internal-next-bar-symbol: var(--next-bar-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><rect x="4" y="-6" width="2" height="12" fill="gray"/><path d="M -6 -6 L -6 6 L 3 0 z" fill="gray"/></svg>'));
	--internal-volume-symbol: var(--volume-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path d="M 4 16 L 4 10 L 8 10 L 13 5 L 13 21 L 8 16 z M 15 11 L 16 10 A 7.2 7.2 0 0 1 16 16 L 15 15 A 5.8 5.8 0 0 0 15 12 z M 18 8 L 19 7 A 11.5 11.5 0 0 1 19 19 L 18 18 A 10.1 10.1 0 0 0 18 8 z" fill="gray"/></svg>'));
	--internal-unmuted-symbol: var(--unmuted-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="3 3 20 20"><path d="M 4 16 L 4 10 L 8 10 L 13 5 L 13 21 L 8 16 z M 15 11 L 16 10 A 7.2 7.2 0 0 1 16 16 L 15 15 A 5.8 5.8 0 0 0 15 12 z M 18 8 L 19 7 A 11.5 11.5 0 0 1 19 19 L 18 18 A 10.1 10.1 0 0 0 18 8 z" fill="gray"/></svg>'));
	--internal-muted-symbol: var(--muted-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="3 3 20 20"><path d="M 4 16 L 4 10 L 8 10 L 13 5 L 13 21 L 8 16 z" fill="gray"/></svg>'));
	--internal-menu-down-symbol: var(--menu-down-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path d="M -4 -2 L 4 -2 L 0 3 z" fill="gray"/></svg>'));
	--internal-select-arrows-symbol: var(--select-arrows-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path d="M -4 -3 L 4 -3 L 0 -8 z M -4 3 L 4 3 L 0 8 z" fill="gray"/></svg>'));
	--internal-file-page-symbol: var(--file-page-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-5 -21 26 26"><path d="M 2 0 L 2 -16 L 10 -16 L 14 -12 L 14 0 z M 3 -1 L 13 -1 L 13 -11 L 9 -11 L 9 -15 L 3 -15 z" fill="gray"/></svg>'));
	--internal-edit-pencil-symbol: var(--edit-pencil-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-5 -21 26 26"><path d="M 0 0 L 1 -4 L 4 -1 z M 2 -5 L 10 -13 L 13 -10 L 5 -2 zM 11 -14 L 13 -16 L 14 -16 L 16 -14 L 16 -13 L 14 -11 z" fill="gray"/></svg>'));
	--internal-preferences-gear-symbol: var(--preferences-gear-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path d="M 5.78 -1.6 L 7.93 -0.94 L 7.93 0.94 L 5.78 1.6 L 4.85 3.53 L 5.68 5.61 L 4.21 6.78 L 2.36 5.52 L 0.27 5.99 L -0.85 7.94 L -2.68 7.52 L -2.84 5.28 L -4.52 3.95 L -6.73 4.28 L -7.55 2.59 L -5.9 1.07 L -5.9 -1.07 L -7.55 -2.59 L -6.73 -4.28 L -4.52 -3.95 L -2.84 -5.28 L -2.68 -7.52 L -0.85 -7.94 L 0.27 -5.99 L 2.36 -5.52 L 4.21 -6.78 L 5.68 -5.61 L 4.85 -3.53 M 2.92 0.67 L 2.92 -0.67 L 2.35 -1.87 L 1.3 -2.7 L 0 -3 L -1.3 -2.7 L -2.35 -1.87 L -2.92 -0.67 L -2.92 0.67 L -2.35 1.87 L -1.3 2.7 L -0 3 L 1.3 2.7 L 2.35 1.87 z" fill="gray"/></svg>'));
	--internal-help-symbol: var(--help-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-16 -16 32 32"><circle cx="0" cy="0" r="10" stroke="gray" stroke-width="2" fill="none"/><path d="M -3.5 -3.5 C -3.5 -7.5 3.5 -7.5 3.5 -3.5 C 3.5 -1 0 0 0 2.5" stroke="gray" stroke-width="2" fill="none"/><circle cx="0" cy="6" r="1.3" fill="gray"/></svg>'));
	--internal-about-symbol: var(--about-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-16 -16 32 32"><circle cx="0" cy="0" r="10" stroke="gray" stroke-width="2" fill="none"/><circle cx="0" cy="-4.5" r="1.4" fill="gray"/><rect x="-1" y="-1.5" width="2" height="7" rx="0.5" fill="gray"/></svg>'));
	--internal-customize-dial-symbol: var(--customize-dial-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"> \
			<g transform="translate(0,1)" fill="gray"> \
				<circle cx="0" cy="0" r="6.5" stroke="gray" stroke-width="1" fill="none"/> \
				<rect x="-1" y="-5" width="2" height="4" transform="rotate(30)"/> \
				<circle cx="-7.79" cy="4.5" r="0.75"/> \
				<circle cx="-9" cy="0" r="0.75"/> \
				<circle cx="-7.79" cy="-4.5" r="0.75"/> \
				<circle cx="-4.5" cy="-7.79" r="0.75"/> \
				<circle cx="0" cy="-9" r="0.75"/> \
				<circle cx="4.5" cy="-7.79" r="0.75"/> \
				<circle cx="7.79" cy="-4.5" r="0.75"/> \
				<circle cx="9" cy="0" r="0.75"/> \
				<circle cx="7.79" cy="4.5" r="0.75"/> \
			</g> \
		</svg>'));
	--internal-instrument-copy-symbol: var(--instrument-copy-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-5 -21 26 26"><path d="M 0 -15 L 1 -15 L 1 0 L 13 0 L 13 1 L 0 1 L 0 -15 z M 2 -1 L 2 -17 L 10 -17 L 14 -13 L 14 -1 z M 3 -2 L 13 -2 L 13 -12 L 9 -12 L 9 -16 L 3 -16 z" fill="currentColor"></path></svg>'));
	--internal-instrument-paste-symbol: var(--instrument-paste-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path d="M 8 18 L 6 18 L 6 5 L 17 5 L 17 7 M 9 8 L 16 8 L 20 12 L 20 22 L 9 22 z" stroke="currentColor" fill="none"></path><path d="M 9 3 L 14 3 L 14 6 L 9 6 L 9 3 z M 16 8 L 20 12 L 16 12 L 16 8 z" fill="currentColor"></path></svg>'));
	--internal-export-symbol: var(--export-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path fill="gray" d="M -8 3 L -8 8 L 8 8 L 8 3 L 6 3 L 6 6 L -6 6 L -6 3 z M 0 2 L -4 -2 L -1 -2 L -1 -8 L 1 -8 L 1 -2 L 4 -2 z"/></svg>'));
	--internal-close-symbol: var(--close-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path fill="gray" d="M -7.07 -5.66 L -5.66 -7.07 L 0 -1.4 L 5.66 -7.07 L 7.07 -5.66 L 1.4 0 L 7.07 5.66 L 5.66 7.07 L 0 1.4 L -5.66 7.07 L -7.07 5.66 L -1.4 0 z"/></svg>'));
	--internal-add-symbol: var(--add-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path fill="gray" d="M -8 -1 L -1 -1 L -1 -8  L 1 -8 L 1 -1 L 8 -1 L 8 1 L 1 1 L 1 8 L -1 8 L -1 1 L -8 1 z"/></svg>'));
	--internal-zoom-in-symbol: var(--zoom-in-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-10 -10 20 20"><circle cx="-1" cy="-1" r="6" stroke-width="2" stroke="gray" fill="none"></circle><path stroke="gray" stroke-width="2" d="M 3 3 L 7 7 M -1 -4 L -1 2 M -4 -1 L 2 -1" fill="none"></path></svg>'));
	--internal-zoom-out-symbol: var(--zoom-out-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-10 -10 20 20"><circle cx="-1" cy="-1" r="6" stroke-width="2" stroke="gray" fill="none"></circle><path stroke="gray" stroke-width="2" d="M 3 3 L 7 7 M -4 -1 L 2 -1" fill="none"></path></svg>'));
	--internal-checkmark-symbol: var(--checkmark-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-13 -13 26 26"><path fill="gray" d="M -9 -2 L -8 -3 L -3 2 L 9 -8 L 10 -7 L -3 8 z"/></svg>'));
	--internal-drum-symbol: var(--drum-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"> \
			<defs> \
				<linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="0%"> \
					<stop offset="0%" stop-color="%237e3302"/> \
					<stop offset="40%" stop-color="%23ffec6b"/> \
					<stop offset="100%" stop-color="%237e3302"/> \
				</linearGradient> \
				<linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="0%"> \
					<stop offset="0%" stop-color="%23faaf7d"/> \
					<stop offset="15%" stop-color="%23fffba9"/> \
					<stop offset="40%" stop-color="%23ffffe3"/> \
					<stop offset="65%" stop-color="%23fffba9"/> \
					<stop offset="100%" stop-color="%23faaf7d"/> \
				</linearGradient> \
				<radialGradient id="gold3" cx="0%" cy="0%" r="100%"> \
					<stop offset="0%" stop-color="%23ffffe3"/> \
					<stop offset="50%" stop-color="%23ffec6b"/> \
					<stop offset="100%" stop-color="%237e3302"/> \
				</radialGradient> \
				<linearGradient id="red" x1="0%" y1="0%" x2="100%" y2="0%"> \
					<stop offset="0%" stop-color="%23641919"/> \
					<stop offset="40%" stop-color="%23cd2c2c"/> \
					<stop offset="100%" stop-color="%23641919"/> \
				</linearGradient> \
				<radialGradient id="membrane"> \
					<stop offset="10%" stop-color="%23cccccc" /> \
					<stop offset="90%" stop-color="%23f6f6f7" /> \
					<stop offset="100%" stop-color="%23999" /> \
				</radialGradient> \
			</defs> \
			<ellipse cx="16" cy="26" rx="16" ry="14" fill="rgba(0,0,0,0.5)"/> \
			<ellipse cx="16" cy="25" rx="16" ry="14" fill="url(%23gold1)"/> \
			<rect x="0" y="23" width="32" height="2" fill="url(%23gold1)"/> \
			<ellipse cx="16" cy="23" rx="16" ry="14" fill="url(%23gold2)"/> \
			<ellipse cx="16" cy="23" rx="15" ry="13" fill="url(%23red)"/> \
			<rect x="1" y="17" width="30" height="6" fill="url(%23red)"/> \
			<rect x="5" y="27" width="1" height="5" rx="0.5" fill="rgba(0,0,0,0.5)"/> \
			<rect x="15" y="31" width="2" height="5" rx="1" fill="rgba(0,0,0,0.5)"/> \
			<rect x="26" y="27" width="1" height="5" rx="0.5" fill="rgba(0,0,0,0.5)"/> \
			<rect x="5" y="26" width="1" height="5" rx="0.5" fill="url(%23gold3)"/> \
			<rect x="15" y="30" width="2" height="5" rx="1" fill="url(%23gold3)"/> \
			<rect x="26" y="26" width="1" height="5" rx="0.5" fill="url(%23gold3)"/> \
			<ellipse cx="16" cy="18" rx="15" ry="13" fill="rgba(0,0,0,0.5)"/> \
			<ellipse cx="16" cy="16" rx="16" ry="14" fill="url(%23gold1)"/> \
			<rect x="0" y="14" width="32" height="2" fill="url(%23gold1)"/> \
			<ellipse cx="16" cy="14" rx="16" ry="14" fill="url(%23gold2)"/> \
			<ellipse cx="16" cy="14" rx="15" ry="13" fill="url(%23membrane)"/> \
		</svg>'));
	--internal-piano-key-symbol: var(--piano-key-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="15" preserveAspectRatio="none" viewBox="0 -1 32 15"> \
			<defs> \
				<linearGradient id="shadow" x1="0%" y1="0%" x2="100%" y2="0%"> \
					<stop offset="0%" stop-color="rgba(0,0,0,0.5)"/> \
					<stop offset="100%" stop-color="transparent"/> \
				</linearGradient> \
			</defs> \
			<rect x="-1" y="1" width="31" height="1" rx="0.6" fill="rgba(255,255,255,0.4)"/> \
			<path d="M -1 11 L 30 11 L 30 2 L 33 -1 L 33 14 L -1 14 z" fill="rgba(0,0,0,0.7)"/> \
			<rect x="-1" y="-1" width="19" height="15" fill="url(%23shadow)"/> \
		</svg>'));
  --internal-mod-key-symbol: var(--mod-key-symbol, url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="80" preserveAspectRatio="none" viewBox="0 -1 32 80"> \
			<defs> \
				<linearGradient id="shadow" x1="0%" y1="0%" x2="100%" y2="0%"> \
					<stop offset="0%" stop-color="rgba(0,0,0,0.4)"/> \
					<stop offset="100%" stop-color="transparent"/> \
				</linearGradient> \
			</defs> \
			<rect x="-1" y="1" width="31" height="1" rx="0.6" fill="rgba(255,255,255,0.2)"/> \
			<path d="M -1 76 L 30 76 L 30 1 L 33 -1 L 33 80 L -1 80 z" fill="rgba(0,0,0,0.7)"/> \
			<rect x="-1" y="-1" width="19" height="80" fill="url(%23shadow)"/> \
		</svg>'));
}


html {
	scrollbar-color: var(--scrollbar-color, ${ColorConfig.uiWidgetBackground}) var(--scrollbar-background, ${ColorConfig.editorBackground});
	scrollbar-width: thin;
}

*::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}
*::-webkit-scrollbar-track {
	background: transparent;
}
*::-webkit-scrollbar-thumb {
	background-color: ${ColorConfig.uiWidgetBackground};
	border-radius: 4px;
	border: 2px solid transparent;
	background-clip: padding-box;
}
*::-webkit-scrollbar-thumb:hover {
	background-color: ${ColorConfig.uiWidgetFocus};
}

.obtrusive-scrollbars, .obtrusive-scrollbars * {
	scrollbar-width: thin;
}
.obtrusive-scrollbars::-webkit-scrollbar, .obtrusive-scrollbars *::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}
.obtrusive-scrollbars::-webkit-scrollbar-track, .obtrusive-scrollbars *::-webkit-scrollbar-track {
	background: transparent;
}
.obtrusive-scrollbars::-webkit-scrollbar-thumb, .obtrusive-scrollbars *::-webkit-scrollbar-thumb {
	background-color: ${ColorConfig.uiWidgetBackground};
	border-radius: 4px;
	border: 2px solid transparent;
	background-clip: padding-box;
}

.beepboxEditor {
	font-family: var(--font-sans);
	font-feature-settings: "cv02", "cv03", "cv04", "cv11", "tnum";
	font-size: 12px;
	letter-spacing: -0.1px;
	display: grid;
    grid-template-columns: minmax(0, 1fr) 6px var(--settings-area-width, 192px);
    grid-template-rows: max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr);
    grid-template-areas: 
        "menu-area menu-area menu-area" 
        "pattern-area v-splitter settings-area" 
        "h-splitter v-splitter settings-area" 
        "track-area v-splitter settings-area";
	grid-column-gap: 0;
	grid-row-gap: 0;
	padding: 6px;
	gap: 6px;
	box-sizing: border-box;
	width: 100%;
	height: 100vh;
	position: relative;
	touch-action: manipulation;
	cursor: default;
	overflow: hidden;
	color: ${ColorConfig.primaryText};
	background: ${ColorConfig.editorBackground};
	opacity: 1;
}

.beepboxEditor .operatorRow {
	margin: 3px 0;
	height: 28px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
}

.beepboxEditor .operatorRow > * {
	flex-grow: 1;
	flex-shrink: 1;
}

.beepboxEditor,
.pattern-area,
.song-settings-area,
.editor-song-settings,
.instrument-settings-area,
.trackAndMuteContainer,
.barScrollBar,
.load {
    opacity: 1;
}

.beepboxEditor .noSelection {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.beepboxEditor div {
	margin: 0;
	padding: 0;
}

.beepboxEditor .pattern-area {
	grid-area: pattern-area;
	height: 100%;
	min-height: 160px;
	display: flex;
	flex-direction: row;
	position: relative;
	contain: layout paint;
	background: ${ColorConfig.editorBackground};
	border: 1px solid var(--border-subtle, #2e2e33);
	border-radius: 6px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.beepboxEditor .track-area {
	grid-area: track-area;
	min-height: 100px;
	background-image: url(${getLocalStorageItem("customTheme2", "")});
	contain: layout paint;
	background-color: ${ColorConfig.editorBackground};
	border: 1px solid var(--border-subtle, #2e2e33);
	border-radius: 6px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.beepboxEditor .loopEditor {
	height: 20px;
	position: sticky;
	bottom: 0;
	padding: 5px 0;
	background-color: ${ColorConfig.editorBackground};
}

.beepboxEditor .settings-area {
	grid-area: settings-area;
	width: var(--settings-area-width, 192px);
	min-width: 36px;
	contain: layout style paint;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 0 2px 8px 2px;
	box-sizing: border-box;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 100%;
	scrollbar-width: thin;
	scrollbar-color: #3f3f46 transparent;
}
.beepboxEditor .settings-area::-webkit-scrollbar {
	width: 5px;
}
.beepboxEditor .settings-area::-webkit-scrollbar-track {
	background: transparent;
}
.beepboxEditor .settings-area::-webkit-scrollbar-thumb {
	background-color: #3f3f46;
	border-radius: 3px;
}
.beepboxEditor .settings-area::-webkit-scrollbar-thumb:hover {
	background-color: #71717a;
}

.beepboxEditor .settings-area.collapsed-sidebar > * {
	display: none !important;
}
.beepboxEditor .settings-area.collapsed-sidebar {
	overflow: hidden;
}



body.resizing-h {
	cursor: row-resize !important;
	user-select: none !important;
}
body.resizing-v {
	cursor: col-resize !important;
	user-select: none !important;
}

.editor-splitter-horizontal,
.editor-splitter-mid-h,
.editor-splitter-bottom {
	grid-area: h-splitter;
	height: 6px;
	cursor: row-resize;
	background: ${ColorConfig.editorBackground};
	border-top: 1px solid var(--border-subtle, #2e2e33);
	border-bottom: 1px solid var(--border-subtle, #2e2e33);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 10;
	user-select: none;
	touch-action: none;
	transition: background-color 0.15s ease, border-color 0.15s ease;
}
.editor-splitter-horizontal .splitter-handle-h,
.editor-splitter-mid-h .splitter-handle-h,
.editor-splitter-bottom .splitter-handle-h {
	width: 42px;
	height: 3px;
	border-radius: 1.5px;
	background: #71717a;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
	transition: width 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.editor-splitter-horizontal:hover,
.editor-splitter-horizontal.active,
.editor-splitter-mid-h:hover,
.editor-splitter-mid-h.active,
.editor-splitter-bottom:hover,
.editor-splitter-bottom.active {
	background: ${ColorConfig.uiWidgetBackground};
	border-color: var(--accent-mod-cyan, #38bdf8);
}
.editor-splitter-horizontal:hover .splitter-handle-h,
.editor-splitter-horizontal.active .splitter-handle-h,
.editor-splitter-mid-h:hover .splitter-handle-h,
.editor-splitter-mid-h.active .splitter-handle-h,
.editor-splitter-bottom:hover .splitter-handle-h,
.editor-splitter-bottom.active .splitter-handle-h {
	width: 60px;
	background: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
}

.editor-splitter-vertical,
.editor-splitter-left,
.editor-splitter-right,
.editor-splitter-mid {
	grid-area: v-splitter;
	width: 6px;
	cursor: col-resize;
	background: ${ColorConfig.editorBackground};
	border-left: 1px solid var(--border-subtle, #2e2e33);
	border-right: 1px solid var(--border-subtle, #2e2e33);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 10;
	user-select: none;
	touch-action: none;
	transition: background-color 0.15s ease, border-color 0.15s ease;
}
.editor-splitter-vertical .splitter-handle-v,
.editor-splitter-left .splitter-handle-v,
.editor-splitter-right .splitter-handle-v,
.editor-splitter-mid .splitter-handle-v {
	height: 42px;
	width: 3px;
	border-radius: 1.5px;
	background: #71717a;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
	transition: height 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}
.editor-splitter-vertical:hover,
.editor-splitter-vertical.active,
.editor-splitter-left:hover,
.editor-splitter-left.active,
.editor-splitter-right:hover,
.editor-splitter-right.active,
.editor-splitter-mid:hover,
.editor-splitter-mid.active {
	background: ${ColorConfig.uiWidgetBackground};
	border-color: var(--accent-mod-cyan, #38bdf8);
}
.editor-splitter-vertical:hover .splitter-handle-v,
.editor-splitter-vertical.active .splitter-handle-v,
.editor-splitter-left:hover .splitter-handle-v,
.editor-splitter-left.active .splitter-handle-v,
.editor-splitter-right:hover .splitter-handle-v,
.editor-splitter-right.active .splitter-handle-v,
.editor-splitter-mid:hover .splitter-handle-v,
.editor-splitter-mid.active .splitter-handle-v {
	height: 60px;
	background: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
}

.collapsible-header {
	cursor: pointer;
	user-select: none;
	transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
	background: linear-gradient(180deg, #27272a 0%, #1f1f23 100%);
	border: 1px solid var(--border-subtle, #2e2e33);
	border-radius: 4px;
	padding: 5px 8px;
	margin-bottom: 6px;
	font-weight: 700;
	color: #e4e4e7;
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.collapsible-header:hover {
	background: linear-gradient(180deg, #323238 0%, #25252a 100%);
	border-color: var(--accent-mod-cyan, #38bdf8);
	color: #ffffff;
	box-shadow: 0 0 6px rgba(56, 189, 248, 0.25);
}
.collapsible-header .fold-icon {
	display: inline-block;
	color: var(--accent-mod-cyan, #38bdf8);
	font-size: 12px;
}

.panel-lock-button {
	cursor: pointer;
	user-select: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	padding: 2px;
	margin-left: 6px;
	border-radius: 4px;
	background: var(--ui-widget-background, ${ColorConfig.uiWidgetBackground});
	border: 1px solid var(--secondary-text, ${ColorConfig.secondaryText});
	color: var(--secondary-text, ${ColorConfig.secondaryText});
	box-sizing: border-box;
	transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
	pointer-events: auto;
	z-index: 10;
}
.panel-lock-button:hover {
	background: var(--ui-widget-focus, ${ColorConfig.uiWidgetFocus});
	border-color: var(--indicator-primary, ${ColorConfig.indicatorPrimary});
	color: var(--primary-text, ${ColorConfig.primaryText});
}
.panel-lock-button.unlocked {
	background: var(--ui-widget-focus, ${ColorConfig.uiWidgetFocus});
	border-color: var(--indicator-primary, ${ColorConfig.indicatorPrimary});
	color: var(--indicator-primary, ${ColorConfig.indicatorPrimary});
	cursor: grab;
}
.panel-lock-button.unlocked:active {
	cursor: grabbing;
}
.panel-floating-lock {
	position: absolute;
	bottom: 6px;
	right: 6px;
	z-index: 20;
	background: var(--editor-background, ${ColorConfig.editorBackground});
	backdrop-filter: blur(4px);
	pointer-events: auto;
}
.beepboxEditor .song-settings-area .panel-floating-lock,
.beepboxEditor .instrument-settings-area .panel-floating-lock {
	position: sticky;
	bottom: 6px;
	right: 6px;
	margin-left: auto;
	margin-top: auto;
	align-self: flex-end;
	flex-shrink: 0;
}
.beepboxEditor .pattern-area .panel-floating-lock {
	right: 26px;
	bottom: 6px;
}
.beepboxEditor .track-area .panel-floating-lock {
	right: 6px;
	bottom: 22px;
}
.panel-lock-button.unlocked,
.collapsible-header.panel-unlocked {
	cursor: grab;
}
.panel-lock-button.unlocked:active,
.collapsible-header.panel-unlocked:active {
	cursor: grabbing;
}
.panel-dragging {
	opacity: 0.6 !important;
	outline: 2px dashed var(--accent-mod-cyan, #38bdf8) !important;
	box-shadow: 0 0 16px rgba(56, 189, 248, 0.5) !important;
}
.panel-drop-indicator {
	position: fixed;
	background: rgba(56, 189, 248, 0.18);
	border: 2px dashed var(--accent-mod-cyan, #38bdf8);
	border-radius: 6px;
	z-index: 9999;
	pointer-events: none;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #38bdf8;
	font-weight: bold;
	font-size: 13px;
	text-shadow: 0 1px 3px rgba(0,0,0,0.9);
	box-shadow: inset 0 0 12px rgba(56, 189, 248, 0.3);
	transition: left 0.08s ease-out, top 0.08s ease-out, width 0.08s ease-out, height 0.08s ease-out;
	animation: pulse-drop-hint 1s infinite alternate ease-in-out;
}
@keyframes pulse-drop-hint {
	from { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.6); }
	to { background: rgba(56, 189, 248, 0.25); border-color: rgba(56, 189, 248, 1); }
}
.song-controls-group.collapsed,
.instrument-settings-area.collapsed .editor-controls > :not(#instrumentSettingsText):not(.collapsible-header),
.instrument-settings-area.collapsed > :not(.editor-controls) {
	display: none !important;
}
.beepboxEditor .song-settings-area.collapsed,
.beepboxEditor .instrument-settings-area.collapsed {
	padding: 4px 6px;
}
.beepboxEditor .song-settings-area.collapsed .collapsible-header,
.beepboxEditor .instrument-settings-area.collapsed .collapsible-header {
	margin-bottom: 0;
}

.beepboxEditor .version-area{ flex-shrink: 0; }
.beepboxEditor .play-pause-area{ flex-shrink: 0; }
.beepboxEditor .menu-area{ grid-area: menu-area; flex-shrink: 0; }
.beepboxEditor .song-settings-area{ flex-shrink: 0; }
.beepboxEditor .instrument-settings-area{ flex-shrink: 0; }

.beepboxEditor .tip {
	cursor: help;
	color: ${ColorConfig.secondaryText};
	text-decoration: none;
}

.beepboxEditor .tip:hover {
	color: ${ColorConfig.linkAccent};
	text-decoration: underline;
}
.beepboxEditor .tip:active {
	color: ${ColorConfig.primaryText};
}

.beepboxEditor .volume-speaker {
	flex-shrink: 0;
	width: var(--button-size);
	height: var(--button-size);
	background: ${ColorConfig.secondaryText};
	-webkit-mask-image: var(--internal-volume-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-volume-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .drum-button {
	flex: 1;
	background-color: transparent;
	background-image: var(--internal-drum-symbol);
	background-repeat: no-repeat;
	background-position: center;
}

.beepboxEditor .modulator-button {
	flex: 1;
	position: relative;
	display: flex;
	align-items: center;
}
.beepboxEditor .modulator-button::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	background-image: var(--internal-mod-key-symbol);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 102%;
}

.beepboxEditor .piano-button {
	flex: 1;
	position: relative;
	display: flex;
	align-items: center;
}
.beepboxEditor .piano-button::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	background-image: var(--internal-piano-key-symbol);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 115.38%;
}
.beepboxEditor .piano-button.disabled::after {
	content: "";
	position: absolute;
	right: 0;
	top: 0;
	width: 70%;
	height: 100%;
	pointer-events: none;
	background: ${ColorConfig.editorBackground};
	-webkit-mask-image: linear-gradient(90deg, transparent 0%, gray 70%, gray 100%);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: linear-gradient(90deg, transparent 0%, gray 70%, gray 100%);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .piano-button.pressed, .beepboxEditor .drum-button.pressed {
	filter: brightness(0.5);
}

.beepboxEditor .customize-instrument {
	margin: 2px 0;
}
.beepboxEditor .customize-instrument::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-customize-dial-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-customize-dial-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .instrumentCopyPasteRow {
	gap: 2px;
}

.beepboxEditor .copy-instrument {
	margin: 2px 0;
	flex-grow: 1;
}
.beepboxEditor .copy-instrument::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-instrument-copy-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-instrument-copy-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .paste-instrument {
	margin: 2px 0;
	flex-grow: 1;
}
.beepboxEditor .paste-instrument::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-instrument-paste-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-instrument-paste-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .envelopeEditor {
	display: flex;
	flex-direction: column;
}

.beepboxEditor .envelope-row {
	display: flex;
	margin: 4px 0;
	gap: 4px;
}

.beepboxEditor .add-envelope {
	width: var(--button-size);
}
.beepboxEditor .add-envelope::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-add-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-add-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}
.beepboxEditor .add-envelope:disabled {
	visibility: hidden;
}

.beepboxEditor .effects-menu {
	width: var(--button-size);
	position: relative;
}
.beepboxEditor .effects-menu::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-menu-down-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-menu-down-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}

.beepboxEditor .zoomInButton, .beepboxEditor .zoomOutButton {
	width: var(--button-size);
	position: absolute;
	right: 10px;
}
.beepboxEditor .zoomInButton {
	top: 10px;
}
.beepboxEditor .zoomOutButton {
	top: 50px;
}
.beepboxEditor .zoomInButton::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-zoom-in-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-zoom-in-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}
.beepboxEditor .zoomOutButton::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-zoom-out-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-zoom-out-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}

.beepboxEditor .delete-envelope {
	width: var(--button-size);
	flex-shrink: 0;
	flex-grow: 0;
}
.beepboxEditor .delete-envelope::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-close-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-close-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}
.beepboxEditor .delete-envelope:disabled {
	visibility: hidden;
}

.beepboxEditor .menu.file::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-file-page-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-file-page-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .menu.edit::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-edit-pencil-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-edit-pencil-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .menu.preferences::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-preferences-gear-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-preferences-gear-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .menu.help::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-help-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-help-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .menu.about::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-about-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-about-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor .mute-button {
	background: transparent;
	border: none;
  padding-right: 0px;
  padding-left: 0px;
  box-shadow: none;
}

.beepboxEditor .mute-button:focus {
  background: transparent;
	border: none;
}

.beepboxEditor .mute-button::before {
	content: "";
	pointer-events: none;
	width: 100%;
	height: 100%;
	display: inline-block;
	background: var(--mute-button-normal, #f4f4f5);
	-webkit-mask-image: var(--internal-unmuted-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	-webkit-mask-size: cover;
	mask-repeat: no-repeat;
	mask-position: center;
	mask-size: cover;
	mask-image: var(--internal-unmuted-symbol);
	transition: filter 0.1s ease;
}

.beepboxEditor .mute-button:hover::before {
	filter: drop-shadow(0 0 3px var(--accent-mod-cyan, #38bdf8));
}

.beepboxEditor .mute-button.muted::before {
	background: var(--accent-signal-red, #ef4444);
	-webkit-mask-image: var(--internal-muted-symbol);
	mask-image: var(--internal-muted-symbol);
	filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
}

.beepboxEditor .mute-button.modMute.muted::before {
	background: var(--accent-signal-red, #ef4444);
	-webkit-mask-image: var(--internal-muted-symbol);
	mask-image: var(--internal-muted-symbol);
	filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
}

.beepboxEditor .mute-button.modMute::before {
	background: var(--mute-button-mod, #38bdf8);
}


.beepboxEditor .promptContainer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 100;
}

.beepboxEditor .prompt {
	margin: auto;
	text-align: center;
	background: ${ColorConfig.editorBackground};
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.15);
	color: ${ColorConfig.primaryText};
	padding: 24px;
	display: flex;
	flex-direction: column;
	position: relative;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.25);
	max-height: 90vh;
}

.beepboxEditor .prompt > *:not(:first-child):not(.cancelButton) {
	margin-top: 1.5em;
}

.beepboxEditor .prompt h2 {
	font-size: 2em;
	margin: 0 16px;
	font-weight: normal;
}

.beepboxEditor .prompt p {
	text-align: left;
	margin: 1em 0;
}

.beepboxEditor .prompt label {
	cursor: pointer;
}

.beepboxEditor .prompt.recordingSetupPrompt p {
	margin-top: 0.75em;
	margin-bottom: 0;
}

.beepboxEditor .prompt.recordingSetupPrompt > label:not(:first-child):not(.cancelButton) {
	margin: 2px 0;
}

.beepboxEditor .layout-option {
	display: flex;
	flex-direction: column;
	cursor: pointer;
	color: ${ColorConfig.secondaryText};
	width: 25%;
}

.beepboxEditor .layout-option input {
	display: none;
}

.beepboxEditor .layout-option input:checked ~ * {
	color: ${ColorConfig.primaryText};
}
.beepboxEditor select.invalidSetting {
	border: solid 1px red;
}
.beepboxEditor .selectContainer {
	position: relative;
}
.beepboxEditor .selectContainer:not(.menu)::after {
	content: "";
	flex-shrink: 0;
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: 14px;
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-select-arrows-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-select-arrows-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}
.beepboxEditor .selectContainer.menu::after {
	content: "";
	flex-shrink: 0;
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: var(--button-size);
	height: var(--button-size);
	background: currentColor;
	-webkit-mask-image: var(--internal-menu-down-symbol);
	margin: 0.5em 0;
	font-size: 11px;
	line-height: 1.4;
	color: var(--secondary-text, #a1a1aa);
}

.beepboxEditor .prompt .layout-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 11px;
	margin: 4px;
	cursor: pointer;
}

.beepboxEditor .prompt .layout-option input[type=radio] {
	margin-bottom: 4px;
}

.beepboxEditor select,
.beepboxEditor select option {
	font-size: 12px;
	font-family: var(--font-sans);
}
.beepboxEditor select {
	margin: 0;
	padding: 0 6px;
	display: block;
	height: var(--button-size);
	border: 1px solid var(--border-default, #3f3f46);
	border-radius: 5px;
	background: ${ColorConfig.uiWidgetBackground};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.12) 100%);
	color: ${ColorConfig.primaryText};
	font-size: 12px;
	font-family: var(--font-sans);
	font-weight: 500;
	cursor: pointer;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
	transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}
.beepboxEditor select option {
	background: ${ColorConfig.editorBackground};
	color: ${ColorConfig.primaryText};
}
.beepboxEditor select:hover {
	border-color: var(--accent-mod-cyan, #38bdf8);
	background: ${ColorConfig.uiWidgetFocus};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.08) 100%);
	color: #ffffff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.beepboxEditor select:focus,
.beepboxEditor select:active {
	border-color: var(--accent-mod-cyan, #38bdf8);
	background: #1f1f23;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 6px rgba(56, 189, 248, 0.3);
	outline: none;
}
.beepboxEditor select option:disabled {
	color: ${ColorConfig.linkAccent};
	font-weight: bold;
}

.select2-container .select2-selection--single {
  height: auto;
}

.select2-container {
  width: -moz-available !important;
  width: -webkit-fill-available !important;
}
@media (min-width: 711px) {
	.select2 {
	  width: calc(var(--settings-area-width) * 0.625) !important;
	}
}

.select2-container--default .select2-selection--single{
  border-radius: 0px;
  border: 0px;
  background-color: transparent;
  outline: none;
}

.select2-selection__rendered:not(.menu)::before {
	content: "";
	position: absolute;
	right: 0.3em;
	top: 0.4em;
	border-bottom: 0.4em solid currentColor;
	border-left: 0.3em solid transparent;
	border-right: 0.3em solid transparent;
	pointer-events: none;
}
.select2-selection__rendered:not(.menu)::after {
	content: "";
	position: absolute;
	right: 0.3em;
	bottom: 0.4em;
	border-top: 0.4em solid currentColor;
	border-left: 0.3em solid transparent;
	border-right: 0.3em solid transparent;
	pointer-events: none;
}
.select2-selection__rendered {
	margin: 0;
	padding: 0 0.4em;
	display: flex;
	align-items: center;
	height: var(--button-size, 26px);
	border: 1px solid var(--border-default, #3f3f46);
	border-radius: 5px;
	background: ${ColorConfig.uiWidgetBackground};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.12) 100%);
	color: inherit !important;
	font-size: 12px;
	font-family: var(--font-sans);
	font-weight: 500;
	cursor: pointer;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
	transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}
.select2-selection__rendered:hover {
	border-color: var(--accent-mod-cyan, #38bdf8);
	color: #ffffff !important;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.select2-selection__rendered--focus {
	background: #1f1f23;
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 6px rgba(56, 189, 248, 0.3);
	outline: none;
}
.select2-selection__arrow b{
    display:none !important;
}

.select2-search__field {
    background: #141416;
    color: inherit !important;
    font-size: 12px;
    font-family: var(--font-sans);
    border: 1px solid var(--border-default, #3f3f46) !important;
    padding: 2px 4px !important;
}
.select2-dropdown {
    box-sizing: border-box;
    display: inline-block;
    margin: 0;
    font-size: 12px;
    font-family: var(--font-sans);
    position: relative;
    vertical-align: middle;
    background-color: #1f1f23;
    border: 1px solid var(--border-default, #3f3f46);
    box-shadow: 0 8px 24px rgba(0,0,0,0.8);
}

.select2-container--default .select2-results>.select2-results__options {
    max-height: 430px;
    overflow-x: hidden;
}
.select2-container--default .select2-results__group {
    cursor: default;
    display: block;
    padding: 3px 6px;
    background: #27272a;
    font-weight: 700;
    color: var(--accent-mod-cyan, #38bdf8);
}
.select2-results__option {
    padding: 3px 6px;
    user-select: none;
    -webkit-user-select: none;
}
.select2-container--default .select2-results__option .select2-results__option {
    padding-left: 0.5em;
}
.select2-container--default .select2-results__option[aria-selected=true] {
  background-color: #27272a !important;
  color: #f4f4f5 !important;
}

.select2-results__option--highlighted[aria-selected] {
	background-color: #3f3f46 !important;
	color: #fff !important;
}

.beepboxEditor .menu select {
	padding: 0 16px 0 24px;
}
.beepboxEditor select:focus {
	background: ${ColorConfig.uiWidgetFocus};
	outline: none;
}
.beepboxEditor .menu select {
	text-align: left;
	text-align-last: left;
}
.beepboxEditor .settings-area select {
       width: 100%;
}

.beepboxEditor button {
	margin: 0;
	position: relative;
	height: var(--button-size);
	border: 1px solid var(--border-default, #3f3f46);
	border-radius: 5px;
	background: ${ColorConfig.uiWidgetBackground};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.12) 100%);
	color: ${ColorConfig.primaryText};
	font-size: 12px;
	font-family: var(--font-sans);
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
	transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.beepboxEditor button:hover {
	background: ${ColorConfig.uiWidgetFocus};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.08) 100%);
	border-color: var(--accent-mod-cyan, #38bdf8);
	color: #ffffff;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.14);
}
.beepboxEditor button:active {
	transform: translateY(0.5px);
	background: #1f1f23;
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 6px rgba(56, 189, 248, 0.3);
}
.beepboxEditor button:focus {
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 6px rgba(56, 189, 248, 0.35);
	outline: none;
}

.beepboxEditor button.cancelButton {
	float: right;
	width: var(--button-size);
	position: absolute;
	top: 8px;
	right: 8px;
}

.beepboxEditor .playback-bar-controls {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
	flex-shrink: 0;
}

.beepboxEditor .playback-bar-controls button {
	height: 28px;
	min-width: 28px;
	padding: 0 8px;
	font-size: 11px;
	font-family: var(--font-mono, monospace);
	font-weight: 600;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	position: relative;
	box-sizing: border-box;
}

.beepboxEditor button.playButton:hover,
.beepboxEditor button.playButton:focus {
	border-color: var(--accent-signal-green, #22c55e);
	box-shadow: var(--glow-green, 0 0 8px rgba(34, 197, 94, 0.4));
	color: #22c55e;
}
.beepboxEditor button.pauseButton:hover,
.beepboxEditor button.pauseButton:focus {
	border-color: var(--accent-signal-amber, #eab308);
	box-shadow: var(--glow-amber, 0 0 8px rgba(234, 179, 8, 0.4));
	color: #eab308;
}
.beepboxEditor button.recordButton:hover,
.beepboxEditor button.recordButton:focus {
	border-color: var(--accent-rec-orange, #f97316);
	box-shadow: var(--glow-orange, 0 0 8px rgba(249, 115, 22, 0.4));
	color: #f97316;
}
.beepboxEditor button.stopButton:hover,
.beepboxEditor button.stopButton:focus {
	border-color: var(--accent-signal-red, #ef4444);
	box-shadow: var(--glow-red, 0 0 8px rgba(239, 68, 68, 0.4));
	color: #ef4444;
}
.beepboxEditor button.playButton::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 8px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: 16px;
	height: 16px;
	background: currentColor;
	-webkit-mask-image: var(--internal-play-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-play-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}
.beepboxEditor button.pauseButton::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 8px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: 16px;
	height: 16px;
	background: currentColor;
	-webkit-mask-image: var(--internal-pause-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-pause-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}
.beepboxEditor button.recordButton::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 8px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: 16px;
	height: 16px;
	background: currentColor;
	-webkit-mask-image: var(--internal-record-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-record-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}
.beepboxEditor button.stopButton::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 8px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	width: 16px;
	height: 16px;
	background: currentColor;
	-webkit-mask-image: var(--internal-stop-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-stop-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor button.prevBarButton::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	width: 18px;
	height: 18px;
	background: currentColor;
	-webkit-mask-image: var(--internal-prev-bar-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-prev-bar-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor button.nextBarButton::before {
	content: "";
	flex-shrink: 0;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	width: 18px;
	height: 18px;
	background: currentColor;
	-webkit-mask-image: var(--internal-next-bar-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-next-bar-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor button.playButton, .beepboxEditor button.pauseButton, .beepboxEditor button.recordButton, .beepboxEditor button.stopButton {
	min-width: 76px;
	padding-left: 28px;
	padding-right: 12px;
}
.beepboxEditor button.okayButton, .beepboxEditor button.exportButton {
	padding-left: var(--button-size);
}
.beepboxEditor button.prevBarButton,
.beepboxEditor button.nextBarButton {
	width: 28px;
	padding: 0;
}

.beepboxEditor button.playButton.shrunk, .beepboxEditor button.recordButton.shrunk {
	padding: 0;
	width: 28px;
}
.beepboxEditor button.playButton.shrunk::before, .beepboxEditor button.recordButton.shrunk::before {
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.beepboxEditor button.playButton.shrunk span, .beepboxEditor button.recordButton.shrunk span {
	display: none;
}

.beepboxEditor button.cancelButton::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-close-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-close-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}

.beepboxEditor button.okayButton::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	-webkit-mask-image: var(--internal-checkmark-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-image: var(--internal-checkmark-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
}

.beepboxEditor button.exportButton::before {
	content: "";
	position: absolute;
	width: var(--button-size);
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-export-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-export-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}

.beepboxEditor .instrument-bar {
	display: flex;
	gap: 3px;
	margin: 4px 0 8px 0;
	height: 28px;
}

.beepboxEditor .instrument-bar button {
	flex-grow: 1;
	min-width: 0;
	padding: 0;
	flex-basis: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-color-lit);
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.15) 100%);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
	transition: all 0.15s ease;
}
.beepboxEditor .instrument-bar button:hover {
	filter: brightness(1.15);
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(56, 189, 248, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.beepboxEditor .instrument-bar .remove-instrument, .beepboxEditor .instrument-bar .add-instrument {
	max-width: var(--button-size);
}

.beepboxEditor .instrument-bar > :not(:first-child) {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.beepboxEditor .instrument-bar > :not(.last-button) {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-bottom: inset;
	border-color: var(--background-color-dim);
}

.beepboxEditor .instrument-bar .selected-instrument {
	background: var(--background-color-lit);
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.2) 100%);
	color: ${ColorConfig.invertedText};
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 10px rgba(56, 189, 248, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.beepboxEditor .instrument-bar .deactivated {
	background: ${ColorConfig.editorBackground};
	color: var(--text-color-dim);
	border-bottom: unset;
}

.beepboxEditor .instrument-bar .deactivated.selected-instrument {
	background: var(--background-color-dim);
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.2) 100%);
	color: ${ColorConfig.invertedText};
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(56, 189, 248, 0.3);
}

.beepboxEditor .instrument-bar .remove-instrument {
	border-bottom: unset;
}

.beepboxEditor .instrument-bar .remove-instrument::before {
	content: "";
	position: absolute;
	width: 100%;
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-close-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-close-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}

.beepboxEditor .instrument-bar .add-instrument {
	border-bottom: unset;
}

.beepboxEditor .instrument-bar .no-underline {
	border-bottom: unset;
}

.beepboxEditor .instrument-bar .add-instrument::before {
	content: "";
	position: absolute;
	width: 100%;
	height: var(--button-size);
	left: 0;
	top: 0;
	pointer-events: none;
	background: currentColor;
	mask-image: var(--internal-add-symbol);
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-image: var(--internal-add-symbol);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
}

.beepboxEditor canvas {
	overflow: hidden;
	position: absolute;
	display: block;
  cursor: crosshair;
}

@keyframes dash-animation {
  to {
    stroke-dashoffset: -100;
  }
}

.beepboxEditor .dash-move {
  animation: dash-animation 20s infinite linear;
}

.beepboxEditor .trackContainer {
	flex-grow: 1;
}

.beepboxEditor .trackAndMuteContainer {
	display: flex;
	align-items: flex-start;
	width: 100%;
	min-height: 0;
	flex: 1;
	overflow-x: hidden;
	position: relative;
}

.beepboxEditor .channelRow {
	display: flex;
}
.beepboxEditor .channelBox {
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding-top: 1px;
}
.beepboxEditor .channelBoxLabel {
	font-size: 20px;
	font-family: sans-serif;
	font-weight: bold;
}
.beepboxEditor .dropFader {
	opacity: 0;
	-webkit-transition:opacity 0.17s linear;
    -moz-transition:opacity 0.17s linear;
    -o-transition:opacity 0.17s linear;
    -ms-transition:opacity 0.17s linear; 
    transition:opacity 0.17s linear;
}

.beepboxEditor .muteEditor {
	width: 32px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	position: sticky;
	left: 0;
	z-index: 1;
	background: ${ColorConfig.editorBackground};
}

.beepboxEditor .selectRow, .beepboxEditor .instrumentCopyPasteRow {
	margin: 4px 0;
	height: 28px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 6px;
	width: 100%;
	box-sizing: border-box;
}

.beepboxEditor .selectRow > :last-child {
	flex: 1;
	min-width: 0;
}
.beepboxEditor .selectRow .selectContainer {
	width: 100%;
}
.beepboxEditor .selectRow .selectContainer select {
	width: 100%;
	box-sizing: border-box;
}

.beepboxEditor .selectRow.key-octave-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 6px;
	justify-content: space-between;
	width: 100%;
}
.beepboxEditor .selectRow.key-octave-row > :last-child {
	width: auto !important;
	flex-shrink: 0;
}
.beepboxEditor .selectRow.key-octave-row .key-group {
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	gap: 4px;
}
.beepboxEditor .selectRow.key-octave-row .key-group .selectContainer {
	flex: 1;
	min-width: 0;
	max-width: 95px;
}
.beepboxEditor .selectRow.key-octave-row .octave-group input[type="number"] {
	width: 44px;
	height: 24px;
	text-align: center;
	box-sizing: border-box;
}

.beepboxEditor .menu-area {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 4px 16px;
	background-color: ${ColorConfig.uiWidgetBackground};
	background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.5) 100%);
	border-radius: 6px;
	border: 1px solid var(--border-subtle, #2e2e33);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	box-sizing: border-box;
	width: 100%;
	min-height: 38px;
}
.beepboxEditor .menu-area > * {
	margin: 0;
	flex-shrink: 0;
}
.beepboxEditor .menu-left-group {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
}
.beepboxEditor .menu-left-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	order: 6;
}
.beepboxEditor .menu-right-group {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 18px;
	margin-left: auto;
	flex-shrink: 0;
}
.beepboxEditor .playback-controls-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 18px;
}
.beepboxEditor .version-area {
	display: flex;
	align-items: center;
	margin: 0;
	flex-shrink: 0;
}
.beepboxEditor .song-title-input,
.beepboxEditor .version-area input {
	background: ${ColorConfig.uiWidgetBackground};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.1) 100%);
	color: ${ColorConfig.primaryText};
	font-family: var(--font-sans);
	font-size: 11px;
	font-weight: 600;
	border: 1px solid var(--border-subtle, #3f3f46);
	border-radius: 4px;
	padding: 2px 8px;
	height: 28px;
	width: 130px;
	box-sizing: border-box;
	text-align: center;
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
	transition: all 0.16s ease;
}
.beepboxEditor .song-title-input:hover,
.beepboxEditor .version-area input:hover {
	border-color: var(--accent-mod-cyan, #38bdf8);
}
.beepboxEditor .song-title-input:focus,
.beepboxEditor .version-area input:focus {
	outline: none;
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 6px rgba(56, 189, 248, 0.35);
	background: ${ColorConfig.uiWidgetFocus};
}
.beepboxEditor .playback-bar-controls {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 6px;
	flex-shrink: 0;
}
.beepboxEditor .playback-volume-controls {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	height: 28px;
	flex-shrink: 0;
	margin-left: 2px;
}
.beepboxEditor .playback-volume-controls .volume-speaker {
	width: 18px;
	height: 18px;
	opacity: 0.85;
	flex-shrink: 0;
}
.beepboxEditor .playback-volume-controls > span {
	display: flex !important;
	align-items: center;
	width: 130px;
}
.beepboxEditor .playback-volume-slider,
.beepboxEditor .playback-volume-controls input[type="range"] {
	width: 130px !important;
	min-width: 130px !important;
	max-width: 130px !important;
	height: 6px;
	margin: 0;
	flex-grow: 0 !important;
}
.beepboxEditor .playback-volume-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 24px;
	width: 180px;
	min-width: 140px;
	flex-shrink: 0;
	padding: 0 4px;
	background: ${ColorConfig.editorBackground};
	border: 1px solid var(--border-subtle, #2e2e33);
	border-radius: 4px;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7);
	box-sizing: border-box;
	margin-left: 6px;
}
.beepboxEditor .global-oscilloscope-container {
	display: flex;
	align-items: center;
	height: 28px;
	flex-shrink: 0;
}
.beepboxEditor .global-oscilloscope-container canvas {
	height: 26px !important;
	width: 90px !important;
	border-radius: 4px;
	border: 1px solid var(--border-subtle, #3f3f46) !important;
	background: ${ColorConfig.editorBackground};
}
.beepboxEditor .desktop-menu-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 6px;
}
.beepboxEditor .mobile-buttons-row {
	display: none;
}

.beepboxEditor .menu-area .selectContainer.menu {
	width: 112px;
	min-width: 112px;
	position: relative;
}
.beepboxEditor .menu-area .selectContainer.menu.preferences {
	width: 144px;
	min-width: 144px;
}
.beepboxEditor .menu-area select {
	width: 100%;
	height: 28px;
	padding: 0 6px;
	font-weight: 600;
	font-size: 12px;
	font-family: var(--font-sans);
	border: 1px solid var(--border-subtle, #2e2e33);
	background: ${ColorConfig.uiWidgetBackground};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.12) 100%);
	border-radius: 5px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
	color: ${ColorConfig.primaryText};
	text-align: center;
	text-align-last: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}
.beepboxEditor .menu-area select:hover {
	background: ${ColorConfig.uiWidgetFocus};
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(0, 0, 0, 0.08) 100%);
	border-color: var(--accent-mod-cyan, #38bdf8);
	color: ${ColorConfig.primaryText};
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.14);
}
.beepboxEditor .menu-area select:focus,
.beepboxEditor .menu-area select:active {
	background: ${ColorConfig.uiWidgetFocus};
	border-color: var(--accent-mod-cyan, #38bdf8);
	color: ${ColorConfig.primaryText};
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 6px rgba(56, 189, 248, 0.3);
}
.beepboxEditor .menu-area .selectContainer.menu::after,
.beepboxEditor .selectContainer.menu::after {
	display: none !important;
}
.beepboxEditor .menu-area .menu.file::before,
.beepboxEditor .menu-area .menu.edit::before,
.beepboxEditor .menu-area .menu.preferences::before,
.beepboxEditor .menu-area .menu.help::before,
.beepboxEditor .menu-area .menu.about::before {
	left: 6px;
	top: 50%;
	transform: translateY(-50%);
	width: 18px;
	height: 18px;
	z-index: 2;
	pointer-events: none;
	opacity: 0.85;
	background: ${ColorConfig.primaryText};
	transition: opacity 0.15s ease, background-color 0.15s ease;
}
.beepboxEditor .menu-area .selectContainer.menu:hover::before {
	opacity: 1;
	background: var(--accent-mod-cyan, #38bdf8);
}
.beepboxEditor select option,
.beepboxEditor select optgroup,
.beepboxEditor .menu-area select option,
.beepboxEditor .menu-area select optgroup,
.beepboxEditor .menu-left-group select option,
.beepboxEditor .menu-left-group select optgroup {
	text-align: left;
	font-family: var(--font-sans);
	font-size: 12px;
	font-weight: 500;
	letter-spacing: 0.2px;
	padding: 5px 10px;
	margin: 0;
	text-indent: 0;
	background: ${ColorConfig.uiWidgetBackground};
	color: ${ColorConfig.primaryText};
}
.beepboxEditor select optgroup,
.beepboxEditor .menu-area select optgroup,
.beepboxEditor .menu-left-group select optgroup {
	font-weight: 700;
	font-family: var(--font-sans);
	font-size: 12px;
	letter-spacing: 0.3px;
	color: var(--accent-mod-cyan, #38bdf8);
	background: ${ColorConfig.uiWidgetFocus};
	padding: 6px 10px;
}

.beepboxEditor .song-settings-area {
	display: flex;
	flex-direction: column;
	background: ${ColorConfig.editorBackground};
	border: 1px solid var(--border-subtle, #2e2e33);
	border-radius: 6px;
	padding: 8px 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
	flex-shrink: 0;
	min-width: 192px;
	max-height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	box-sizing: border-box;
	scrollbar-width: thin;
	scrollbar-color: #3f3f46 transparent;
}
.beepboxEditor .song-settings-area::-webkit-scrollbar {
	width: 5px;
}
.beepboxEditor .song-settings-area::-webkit-scrollbar-track {
	background: transparent;
}
.beepboxEditor .song-settings-area::-webkit-scrollbar-thumb {
	background-color: #3f3f46;
	border-radius: 3px;
}
.beepboxEditor .song-settings-area::-webkit-scrollbar-thumb:hover {
	background-color: #71717a;
}

.beepboxEditor .editor-controls {
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.beepboxEditor .instrument-settings-area {
	display: flex;
	flex-direction: column;
	background: ${ColorConfig.editorBackground};
	border: 1px solid var(--border-subtle, #2e2e33);
	border-radius: 6px;
	padding: 8px 10px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
	flex-shrink: 0;
	min-width: 216px;
	max-height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	box-sizing: border-box;
	scrollbar-width: thin;
	scrollbar-color: #3f3f46 transparent;
}
.beepboxEditor .instrument-settings-area::-webkit-scrollbar {
	width: 5px;
}
.beepboxEditor .instrument-settings-area::-webkit-scrollbar-track {
	background: transparent;
}
.beepboxEditor .instrument-settings-area::-webkit-scrollbar-thumb {
	background-color: #3f3f46;
	border-radius: 3px;
}
.beepboxEditor .instrument-settings-area::-webkit-scrollbar-thumb:hover {
	background-color: #71717a;
}

.beepboxEditor .editor-right-side-top > *, .beepboxEditor .editor-right-side-bottom > * {
	flex-shrink: 0;
}

.beepboxEditor .pitchShiftMarkerContainer {
	box-sizing: border-box;
	display: flex;
	height: 100%;
	left: 3px;
	right: 3px;
	position: absolute;
	align-items: center;
	pointer-events: none;
}

.beepboxEditor .pitchShiftMarker {
	width: 0;
	height: 0;
	position: absolute;
}

.beepboxEditor .pitchShiftMarker::before {
	content: "";
	width: 2px;
	height: 20px;
	transform: translate(-50%, -50%);
	position: absolute;
	background: currentColor;
	border-radius: 3px;
}

.beepboxEditor input[type=text], .beepboxEditor input[type=number] {
	font-size: 12px;
	font-weight: 600;
	font-family: var(--font-sans);
	font-feature-settings: "tnum";
	background: #141416;
	text-align: center;
	border: 1px solid var(--border-default, #3f3f46);
	border-radius: 4px;
	color: ${ColorConfig.primaryText};
	padding: 2px 4px;
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
	transition: all 0.15s ease;
}

.beepboxEditor input[type=text]:hover, .beepboxEditor input[type=number]:hover {
	border-color: var(--accent-mod-cyan, #38bdf8);
}

.beepboxEditor input[type=text]:focus, .beepboxEditor input[type=number]:focus {
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: inset 0 1px 2px rgba(0,0,0,0.6), 0 0 6px rgba(56, 189, 248, 0.35);
	background: #1a1a1e;
	outline: none;
}

.beepboxEditor input[type=text]::selection, .beepboxEditor input[type=number]::selection {
	background-color: ${ColorConfig.textSelection};
	color: ${ColorConfig.primaryText};
}

.beepboxEditor input[type=checkbox] {
  transform: scale(1.3);
  accent-color: var(--accent-mod-cyan, #38bdf8);
}

.beepboxEditor input[type=range] {
	-webkit-appearance: none;
	color: inherit;
	width: 100%;
	height: var(--button-size);
	font-size: inherit;
	margin: 0;
	cursor: pointer;
	background: none;
	touch-action: pan-y;
	position: relative;
}
.beepboxEditor input[type=range]:focus {
	outline: none;
}
.beepboxEditor input[type=range]::-webkit-slider-runnable-track {
	width: 100%;
	height: 6px;
	cursor: pointer;
	background: #27272c;
	border-radius: 3px;
	border: 1px solid #3f3f46;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.05);
}

.modTarget:hover {
	fill: ${ColorConfig.hoverPreview} !important;
}

.beepboxEditor span.midTick:after {
    content: "";
    display:inline-block;
    position: absolute;
    background: currentColor;
    width: 2px;
    left: calc(50% - 1px);
    height: 0.6em;
    top: 30%;
    z-index: 1;
	pointer-events: none;
}
.beepboxEditor span.modSlider {
	--mod-position: 20%;
	--mod-color: ${ColorConfig.overwritingModSlider};
	--mod-border-radius: 2px;
}
.beepboxEditor span.modSlider:before {
	content: "";
    display:inline-block;
    position: absolute;
    background: var(--mod-color);
    width: 4px;
    left: var(--mod-position);
    height: 14px;
    top: 24%;
    z-index: 2;
	transform: translate(-50%, 0%);
	pointer-events: none;
	border: 1px solid rgba(255,255,255,0.4);
	border-radius: var(--mod-border-radius);
	box-shadow: 0 0 4px var(--mod-color);
}
.beepboxEditor input[type=range]::-webkit-slider-thumb {
	height: 18px;
	width: 9px;
	border-radius: 2px;
	background: linear-gradient(180deg, #52525b 0%, #3f3f46 50%, #27272a 100%);
	border: 1px solid #71717a;
	box-shadow: 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.3);
	cursor: pointer;
	-webkit-appearance: none;
	margin-top: -6.5px;
	transition: border-color 0.1s ease, box-shadow 0.1s ease;
}
.beepboxEditor input[type=range]:hover::-webkit-slider-thumb {
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 6px rgba(56, 189, 248, 0.6), inset 0 1px 0 rgba(255,255,255,0.4);
}
.beepboxEditor input[type=range]:focus::-webkit-slider-thumb {
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 8px rgba(56, 189, 248, 0.8), inset 0 1px 0 rgba(255,255,255,0.4);
}
.beepboxEditor input[type=range]::-moz-range-track {
	width: 100%;
	height: 6px;
	cursor: pointer;
	background: #27272c;
	border-radius: 3px;
	border: 1px solid #3f3f46;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.05);
}
.beepboxEditor input[type=range]::-moz-range-thumb {
	height: 18px;
	width: 9px;
	border-radius: 2px;
	border: 1px solid #71717a;
	background: linear-gradient(180deg, #52525b 0%, #3f3f46 50%, #27272a 100%);
	box-shadow: 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.3);
	cursor: pointer;
}
.beepboxEditor input[type=range]:hover::-moz-range-thumb {
	border-color: var(--accent-mod-cyan, #38bdf8);
	box-shadow: 0 0 6px rgba(56, 189, 248, 0.6), inset 0 1px 0 rgba(255,255,255,0.4);
}
.beepboxEditor input[type=range]::-ms-track {
	width: 100%;
	height: 6px;
	cursor: pointer;
	background: #27272c;
	border-color: transparent;
	color: transparent;
}
.beepboxEditor input[type=range]::-ms-thumb {
	height: 18px;
	width: 9px;
	border-radius: 2px;
	background: linear-gradient(180deg, #52525b 0%, #3f3f46 50%, #27272a 100%);
	border: 1px solid #71717a;
	cursor: pointer;
}

li.select2-results__option[role=group] > strong:hover {
  background-color: #516fbb;
}

/* wide screen */
@media (min-width: 711px) {
	#beepboxEditorContainer {
		background-image: url(${getLocalStorageItem("customTheme2", "")});
		display: table;
	}
	.beepboxEditor {
		flex-direction: row;
	}
	.beepboxEditor:focus-within {
		outline: 3px solid ${ColorConfig.uiWidgetBackground};
	}
	.beepboxEditor .trackAndMuteContainer {
		width: 512px;
	}
	.beepboxEditor .trackSelectBox {
		display: none;
	}
    .beepboxEditor .muteButtonSelectBox {
		display: none;
	}
	.beepboxEditor .settings-area {
		width: var(--settings-area-width);
	}
}

/* Mobile & Drawer Controls Defaults */
.mobile-menu-btn {
	display: none;
}
.mobile-drawer-close-btn {
	display: none;
}
.mobile-drawer-backdrop {
	display: none;
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.65);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	z-index: 10000;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.22s ease;
}
.mobile-drawer-backdrop.open {
	display: block;
	opacity: 1;
	pointer-events: auto;
}
.mobile-quick-bar,
.mobile-buttons-row {
	display: none;
}
.rotate-device-prompt {
	display: none;
	position: fixed;
	inset: 0;
	z-index: 100000;
	background: rgba(0, 0, 0, 0.82);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	align-items: center;
	justify-content: center;
	padding: 20px;
	box-sizing: border-box;
}
@media (orientation: portrait) and (max-width: 900px) {
	.rotate-device-prompt {
		display: flex;
	}
}
.rotate-device-content {
	background: ${ColorConfig.editorBackground};
	border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.2));
	border-radius: 18px;
	padding: 26px 22px;
	max-width: 320px;
	width: 90%;
	text-align: center;
	box-shadow: 0 16px 48px rgba(0, 0, 0, 0.85);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}
.rotate-device-icon {
	font-size: 42px;
	line-height: 1;
	animation: rotatePromptSpin 2.5s ease-in-out infinite alternate;
}
@keyframes rotatePromptSpin {
	0% { transform: rotate(0deg); }
	50% { transform: rotate(-90deg); }
	100% { transform: rotate(-90deg); }
}
.rotate-device-title {
	font-size: 18px;
	font-weight: bold;
	color: ${ColorConfig.primaryText};
	margin: 0;
}
.rotate-device-desc {
	font-size: 13px;
	color: ${ColorConfig.secondaryText};
	line-height: 1.45;
	margin: 0;
}
.rotate-dismiss-btn {
	margin-top: 6px;
	padding: 9px 24px;
	font-size: 14px;
	font-weight: 600;
	border-radius: 20px;
	border: none;
	background: ${ColorConfig.linkAccent};
	color: #ffffff;
	cursor: pointer;
	box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
	touch-action: manipulation;
	transition: transform 0.12s ease, filter 0.15s ease;
}
.rotate-dismiss-btn:active {
	transform: scale(0.95);
	filter: brightness(1.15);
}

/* Mobile Landscape Mode (Phone/Tablet horizontal & PWA) */
@media (max-width: 900px) and (orientation: landscape), (max-height: 560px) and (orientation: landscape), (hover: none) and (pointer: coarse) and (orientation: landscape), (hover: none) and (pointer: coarse) and (max-height: 560px) {
	.beepboxEditor {
		height: 100vh;
		height: 100dvh;
		max-height: 100dvh;
		grid-template-columns: minmax(180px, var(--primary-left-width, 1.4fr)) 6px minmax(160px, 1fr) !important;
		grid-template-rows: minmax(0, 1fr) !important;
		grid-template-areas: 
			"pattern-area h-splitter track-area" !important;
		gap: 2px !important;
		padding: 2px calc(4px + env(safe-area-inset-right, 0px)) 2px calc(4px + env(safe-area-inset-left, 0px)) !important;
		box-sizing: border-box !important;
		position: relative !important;
	}
	.beepboxEditor .editor-splitter-left,
	.beepboxEditor .editor-splitter-right,
	.beepboxEditor .editor-splitter-mid,
	.beepboxEditor .editor-splitter-mid-h,
	.beepboxEditor .editor-splitter-mid-horizontal,
	.beepboxEditor .editor-splitter-bottom,
	.beepboxEditor .settings-stack-container {
		display: none !important;
	}
	.beepboxEditor .editor-splitter-horizontal {
		grid-area: h-splitter !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		width: 6px !important;
		height: 100% !important;
		cursor: col-resize !important;
		touch-action: none !important;
		background: ${ColorConfig.editorBackground} !important;
		border-left: 1px solid var(--border-subtle, #2e2e33) !important;
		border-right: 1px solid var(--border-subtle, #2e2e33) !important;
		border-top: none !important;
		border-bottom: none !important;
		position: relative !important;
		z-index: 10 !important;
		user-select: none !important;
		transition: background-color 0.15s ease, border-color 0.15s ease !important;
	}
	.beepboxEditor .editor-splitter-horizontal::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: -8px;
		right: -8px;
		z-index: 1;
	}
	.beepboxEditor .editor-splitter-horizontal::after {
		display: none !important;
	}
	.beepboxEditor .editor-splitter-horizontal .splitter-handle-h {
		width: 3px !important;
		height: 42px !important;
		border-radius: 1.5px !important;
		background: #71717a !important;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
		transition: height 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease !important;
		position: relative;
		z-index: 2;
	}
	.beepboxEditor .editor-splitter-horizontal:hover,
	.beepboxEditor .editor-splitter-horizontal.active {
		background: ${ColorConfig.uiWidgetBackground} !important;
		border-color: var(--accent-mod-cyan, #38bdf8) !important;
	}
	.beepboxEditor .editor-splitter-horizontal:hover .splitter-handle-h,
	.beepboxEditor .editor-splitter-horizontal.active .splitter-handle-h {
		height: 60px !important;
		width: 3px !important;
		background: var(--accent-mod-cyan, #38bdf8) !important;
		box-shadow: 0 0 8px rgba(56, 189, 248, 0.7) !important;
	}
	.beepboxEditor .pattern-area {
		grid-area: pattern-area !important;
		width: 100% !important;
		height: 100% !important;
		min-height: 0 !important;
		position: relative !important;
		border-radius: 6px !important;
		margin: 0 !important;
	}
	.beepboxEditor .track-area {
		grid-area: track-area !important;
		width: 100% !important;
		height: 100% !important;
		min-height: 0 !important;
		display: flex !important;
		flex-direction: column !important;
		position: relative !important;
		border-radius: 6px !important;
		margin: 0 !important;
	}
	.beepboxEditor .trackAndMuteContainer {
		width: 100% !important;
		height: 100% !important;
		min-height: 0 !important;
		flex: 1 1 0 !important;
		overflow: auto !important;
		scrollbar-width: thin !important;
		overscroll-behavior: contain !important;
		-webkit-overflow-scrolling: touch !important;
	}
	.beepboxEditor .menu-area {
		position: fixed !important;
		top: calc(4px + env(safe-area-inset-top, 0px)) !important;
		left: calc(6px + env(safe-area-inset-left, 0px)) !important;
		right: calc(6px + env(safe-area-inset-right, 0px)) !important;
		z-index: 990 !important;
		display: flex !important;
		flex-direction: row !important;
		justify-content: space-between !important;
		align-items: center !important;
		background: transparent !important;
		background-image: none !important;
		border: none !important;
		box-shadow: none !important;
		border-radius: 0 !important;
		min-height: 0 !important;
		height: auto !important;
		padding: 0 !important;
		margin: 0 !important;
		pointer-events: none !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open {
		z-index: 10001 !important;
		pointer-events: auto !important;
	}
	.mobile-menu-btn {
		pointer-events: auto !important;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: bold;
		width: 32px;
		height: 28px;
		line-height: 1;
		border-radius: 6px;
		border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.2));
		background: rgba(18, 18, 24, 0.85);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: ${ColorConfig.primaryText};
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
		cursor: pointer;
		margin: 0;
		flex-shrink: 0;
		touch-action: manipulation;
		transition: transform 0.12s ease;
	}
	.mobile-menu-btn:active {
		transform: scale(0.92);
	}
	.beepboxEditor .fold-icon {
		display: none !important;
	}
	.beepboxEditor .menu-right-group {
		position: fixed !important;
		bottom: calc(6px + env(safe-area-inset-bottom, 0px));
		right: calc(6px + env(safe-area-inset-right, 0px));
		left: auto;
		top: auto;
		z-index: 9990 !important;
		pointer-events: auto !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: stretch !important;
		gap: 5px !important;
		margin: 0 !important;
		padding: 5px 8px !important;
		border-radius: 8px !important;
		background: rgba(18, 18, 24, 0.88) !important;
		backdrop-filter: blur(12px) !important;
		-webkit-backdrop-filter: blur(12px) !important;
		border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.18)) !important;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.65) !important;
		touch-action: none !important;
		user-select: none !important;
		cursor: grab;
	}
	.beepboxEditor .menu-right-group.mobile-dragging {
		cursor: grabbing !important;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), 0 0 12px rgba(56, 189, 248, 0.4) !important;
		border-color: var(--accent-mod-cyan, #38bdf8) !important;
	}
	.beepboxEditor .playback-controls-row {
		display: flex !important;
		flex-direction: row !important;
		align-items: center !important;
		justify-content: center !important;
		gap: 4px !important;
		width: 100% !important;
	}
	.beepboxEditor .playback-bar-controls {
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		gap: 4px !important;
	}
	.beepboxEditor .mobile-buttons-row {
		display: flex !important;
		flex-direction: row !important;
		align-items: center !important;
		justify-content: space-between !important;
		gap: 4px !important;
		width: 100% !important;
	}
	.beepboxEditor .mobile-buttons-row .mobile-quick-btn {
		flex: 1 !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		padding: 2px 4px !important;
		font-family: var(--font-sans) !important;
		font-size: 10.5px !important;
		font-weight: 600 !important;
		height: var(--button-size, 26px) !important;
		border-radius: 5px !important;
		border: 1px solid var(--border-default, #3f3f46) !important;
		background: ${ColorConfig.uiWidgetBackground} !important;
		background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.12) 100%) !important;
		color: ${ColorConfig.primaryText} !important;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
		cursor: pointer !important;
		touch-action: manipulation !important;
		white-space: nowrap !important;
		transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important;
	}
	.beepboxEditor .mobile-buttons-row .mobile-undo-btn,
	.beepboxEditor .mobile-buttons-row .mobile-redo-btn {
		font-size: 14px !important;
		flex: 0.75 !important;
	}
	.beepboxEditor .mobile-buttons-row .mobile-quick-btn:hover {
		background: ${ColorConfig.uiWidgetFocus} !important;
		background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.08) 100%) !important;
		border-color: var(--accent-mod-cyan, #38bdf8) !important;
		color: #ffffff !important;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), 0 0 8px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
	}
	.beepboxEditor .mobile-buttons-row .mobile-quick-btn:active {
		transform: translateY(0.5px) !important;
		background: #1f1f23 !important;
		border-color: var(--accent-mod-cyan, #38bdf8) !important;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 0 6px rgba(56, 189, 248, 0.3) !important;
	}
	.beepboxEditor .playback-volume-controls {
		display: none !important;
	}
	.beepboxEditor .playback-volume-bar {
		width: 70px !important;
		min-width: 50px !important;
		height: 20px !important;
		margin-left: 2px !important;
	}
	.beepboxEditor .global-oscilloscope-container {
		height: 22px !important;
		margin-right: 0 !important;
	}
	.beepboxEditor .global-oscilloscope-container canvas {
		height: 20px !important;
		width: 50px !important;
	}
	.beepboxEditor .menu-area .menu-left-group {
		display: none !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .menu-left-group {
		display: flex !important;
		position: fixed !important;
		left: 0 !important;
		top: 0 !important;
		bottom: 0 !important;
		width: min(320px, calc(86vw - env(safe-area-inset-left, 0px))) !important;
		height: 100vh !important;
		height: 100dvh !important;
		z-index: 10010 !important;
		flex-direction: column !important;
		align-items: stretch !important;
		background: ${ColorConfig.editorBackground} !important;
		border-right: 1px solid var(--border-subtle, #333) !important;
		box-shadow: 8px 0 32px rgba(0, 0, 0, 0.85) !important;
		padding: calc(12px + env(safe-area-inset-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px)) !important;
		box-sizing: border-box !important;
		gap: 10px !important;
		overflow-y: auto !important;
		overscroll-behavior: contain !important;
		-webkit-overflow-scrolling: touch !important;
		pointer-events: auto !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .menu-left-header {
		display: flex !important;
		flex-direction: row !important;
		align-items: center !important;
		justify-content: space-between !important;
		width: 100% !important;
		gap: 10px !important;
		order: 0 !important;
		margin-bottom: 6px !important;
		pointer-events: auto !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .menu-song-title-area {
		flex: 1 !important;
		width: auto !important;
		pointer-events: auto !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .menu-song-title-area input {
		width: 100% !important;
		height: 34px !important;
		font-size: 13px !important;
		text-align: left !important;
		padding: 4px 10px !important;
		pointer-events: auto !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .selectContainer.menu {
		display: block !important;
		width: 100% !important;
		min-width: 100% !important;
		height: 38px !important;
		position: relative !important;
		pointer-events: auto !important;
		margin: 0 !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .selectContainer.menu select {
		display: block !important;
		width: 100% !important;
		min-width: 100% !important;
		height: 38px !important;
		line-height: 38px !important;
		font-size: 13px !important;
		font-weight: 600 !important;
		padding: 6px 14px 6px 36px !important;
		pointer-events: auto !important;
		cursor: pointer !important;
		border-radius: 8px !important;
		text-align: left !important;
		text-align-last: left !important;
		box-sizing: border-box !important;
	}
	.beepboxEditor .menu-area.mobile-menu-open .selectContainer.menu::before {
		left: 10px !important;
		top: 50% !important;
		transform: translateY(-50%) !important;
		pointer-events: none !important;
	}
	.mobile-drawer-close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		font-size: 14px;
		font-weight: bold;
		background: ${ColorConfig.uiWidgetBackground};
		color: ${ColorConfig.primaryText};
		border: 1px solid var(--border-subtle, #333);
		border-radius: 6px;
		cursor: pointer;
		touch-action: manipulation;
		flex-shrink: 0;
	}
	.mobile-drawer-close-btn:active {
		transform: scale(0.92);
	}
	.beepboxEditor .song-settings-area,
	.beepboxEditor .instrument-settings-area {
		position: fixed !important;
		right: 0 !important;
		top: 0 !important;
		bottom: 0 !important;
		width: min(340px, calc(85vw - env(safe-area-inset-right, 0px))) !important;
		height: 100vh !important;
		height: 100dvh !important;
		max-height: 100vh !important;
		max-height: 100dvh !important;
		overflow-y: auto !important;
		overscroll-behavior: contain !important;
		-webkit-overflow-scrolling: touch !important;
		z-index: 10010 !important;
		background: ${ColorConfig.editorBackground} !important;
		border-left: 1px solid var(--border-subtle, #333) !important;
		box-shadow: -8px 0 32px rgba(0, 0, 0, 0.8) !important;
		transform: translateX(110%) !important;
		transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
		margin: 0 !important;
		padding: calc(10px + env(safe-area-inset-top, 0px)) calc(12px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) 12px !important;
		box-sizing: border-box !important;
		display: block !important;
		pointer-events: auto !important;
	}
	.beepboxEditor .song-settings-area.mobile-drawer-open,
	.beepboxEditor .instrument-settings-area.mobile-drawer-open {
		transform: translateX(0) !important;
	}
	.beepboxEditor .song-settings-area > .editor-controls,
	.beepboxEditor .instrument-settings-area > .editor-controls {
		position: relative;
		width: 100%;
	}
	.beepboxEditor .panel-lock-button,
	.beepboxEditor .panel-floating-lock {
		display: none !important;
	}
}

/* narrow screen (tablet / medium mobile portrait) */
@media (min-width: 481px) and (max-width: 710px) and (orientation: portrait) {
	.beepboxEditor {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		grid-template-rows: max-content min-content 6px min-content min-content;
		grid-template-areas: 
			"menu-area menu-area"
			"pattern-area pattern-area" 
			". ." 
			"track-area track-area" 
			"song-settings-area instrument-settings-area";
		grid-column-gap: 8px;
		grid-row-gap: 4px;
	}
	.beepboxEditor .song-settings-area,
	.beepboxEditor .instrument-settings-area {
		width: auto;
		max-width: 100%;
		position: relative;
		overflow: visible;
		margin: 0 4px;
	}
	.beepboxEditor .instrument-settings-area > .editor-controls,
	.beepboxEditor .song-settings-area > .editor-controls {
		position: relative;
		width: 100%;
	}
	.beepboxEditor:focus-within {
		outline: none;
	}
	.beepboxEditor .pattern-area {
		max-height: 75vh;
	}
	.beepboxEditor .trackAndMuteContainer {
		overflow-x: auto;
	}
	.beepboxEditor .barScrollBar {
		display: none;
	}
	.beepboxEditor .panel-lock-button,
	.beepboxEditor .panel-floating-lock,
	.beepboxEditor .settings-stack-container,
	.beepboxEditor .editor-splitter-left,
	.beepboxEditor .editor-splitter-right,
	.beepboxEditor .editor-splitter-mid,
	.beepboxEditor .editor-splitter-mid-h,
	.beepboxEditor .editor-splitter-mid-horizontal,
	.beepboxEditor .editor-splitter-bottom {
		display: none !important;
	}
}

/* small mobile screen (portrait) */
@media (max-width: 480px) and (orientation: portrait) {
	.beepboxEditor {
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: max-content min-content 6px min-content min-content min-content;
		grid-template-areas: 
			"menu-area"
			"pattern-area" 
			"." 
			"track-area" 
			"song-settings-area"
			"instrument-settings-area";
		grid-row-gap: 6px;
	}
	.beepboxEditor .song-settings-area,
	.beepboxEditor .instrument-settings-area {
		width: auto;
		max-width: 100%;
		position: relative;
		overflow: visible;
		margin: 0 2px;
	}
	.beepboxEditor .instrument-settings-area > .editor-controls,
	.beepboxEditor .song-settings-area > .editor-controls {
		position: relative;
		width: 100%;
	}
	.beepboxEditor:focus-within {
		outline: none;
	}
	.beepboxEditor .pattern-area {
		max-height: 70vh;
	}
	.beepboxEditor .trackAndMuteContainer {
		overflow-x: auto;
	}
	.beepboxEditor .barScrollBar {
		display: none;
	}
	.beepboxEditor .panel-lock-button,
	.beepboxEditor .panel-floating-lock,
	.beepboxEditor .settings-stack-container,
	.beepboxEditor .editor-splitter-left,
	.beepboxEditor .editor-splitter-right,
	.beepboxEditor .editor-splitter-mid,
	.beepboxEditor .editor-splitter-mid-h,
	.beepboxEditor .editor-splitter-mid-horizontal,
	.beepboxEditor .editor-splitter-bottom {
		display: none !important;
	}
	
	.beepboxEditor .soundIcon {
	  background: ${ColorConfig.editorBackground};
	  display: inline-block;
	  height: 10px;
	  margin-left: 0px;
	  margin-top: 8px;
		position: relative;
		width: 10px;
	}
	.beepboxEditor .soundIcon:before {
	  border-bottom: 6px solid transparent;
	  border-top: 6px solid transparent;
	  border-right: 10px solid ${ColorConfig.editorBackground};
	  content: "";
	  height: 10px;
	  left: 6px;
	  position: absolute;
	  top: -6px;
	}
	.beepboxEditor .panel-lock-button,
	.beepboxEditor .panel-floating-lock {
		display: none !important;
	}
}
.rotate-device-prompt {
	display: none;
}
@media (hover: none) and (pointer: coarse) and (orientation: portrait) and (max-width: 600px) {
	.rotate-device-prompt {
		display: flex;
		position: fixed;
		inset: 0;
		z-index: 99999;
		background: rgba(10, 10, 14, 0.96);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 24px;
		text-align: center;
		box-sizing: border-box;
	}
	.rotate-device-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		max-width: 300px;
	}
	.rotate-device-icon {
		font-size: 48px;
		line-height: 1;
		animation: rotatePhoneAnim 2s infinite ease-in-out;
	}
	.rotate-device-title {
		font-size: 18px;
		font-weight: 700;
		color: ${ColorConfig.primaryText};
	}
	.rotate-device-desc {
		font-size: 13px;
		line-height: 1.4;
		color: ${ColorConfig.secondaryText};
	}
	.rotate-dismiss-btn {
		margin-top: 6px;
		padding: 6px 18px;
		font-size: 12px;
		font-weight: 600;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: ${ColorConfig.uiWidgetBackground};
		color: ${ColorConfig.primaryText};
		cursor: pointer;
	}
}
@keyframes rotatePhoneAnim {
	0%, 100% { transform: rotate(0deg); }
	50% { transform: rotate(-90deg); }
}

`));

