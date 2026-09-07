// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";

export class Layout {
	private static readonly _layoutMap: {[K: string]: string} = {
		"small": "",
		"long": `\

			/* long layout */
			@media (min-width: 711px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: minmax(0, 1fr) 6px var(--settings-area-width, 390px);
					grid-template-rows: max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr);
					grid-template-areas: 
						"menu-area menu-area menu-area" 
						"pattern-area v-splitter settings-area" 
						"h-splitter v-splitter settings-area" 
						"track-area v-splitter settings-area";
				}
				.beepboxEditor .pattern-area {
					width: 100%;
					height: 100%;
				}
				.beepboxEditor .track-area {
					width: 100%;
					display: flex;
					flex-direction: column;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					min-height: 0;
					flex: 1;
					overflow: auto;
					max-height: 97.5vh;
				}
				.beepboxEditor .instrument-settings-area {
					position: relative;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}
				.beepboxEditor .song-settings-area {
					position: relative;
				}
				
				.beepboxEditor .settings-area {
					width: var(--settings-area-width, 390px);
					display: flex;
					flex-direction: column;
					gap: 8px;
					overflow-y: auto;
				}
				
				.beepboxEditor .barScrollBar {
					display: none;
				}
				.beepboxEditor.selectRow {
					height: 2em;
				}
				.beepboxEditor .trackAndMuteContainer {
					max-height: 446px;
				}

				.beepboxEditor .trackContainer {
					overflow: visible;
				}
				.beepboxEditor .trackAndMuteContainer {
					scrollbar-width: auto;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar {
					width: 20px;
					height: 20px;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-track {
					background: ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-thumb {
					background-color: ${ColorConfig.uiWidgetBackground};
					border: 3px solid ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-corner {
					background-color: ${ColorConfig.editorBackground};
				}
			}
		`,
		"tall": `\
			/* tall layout */
			@media (min-width: 711px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: minmax(0, 1fr) 6px minmax(0, 1fr) 6px var(--settings-area-width, 192px);
					grid-template-rows: max-content 1fr;
					grid-template-areas: "menu-area menu-area menu-area menu-area menu-area" "track-area h-splitter pattern-area v-splitter settings-area";
				}
				.beepboxEditor .pattern-area {
					width: 100%;
					height: 100%;
				}
				.beepboxEditor .track-area {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					min-height: 0;
					flex: 0;
					overflow: auto;
					flex-basis: initial;
					flex-grow: 0;
					max-height: 97.5vh;
				}
				.beepboxEditor .instrument-settings-area {
					position: relative;
					overflow: visible;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}
				
				.beepboxEditor .settings-area {
					width: var(--settings-area-width, 192px);
					position: relative;
					overflow-y: auto;
					display: flex;
					flex-direction: column;
					gap: 8px;
				}
				
				.beepboxEditor .barScrollBar {
					display: none;
				}
				.beepboxEditor .trackContainer {
					overflow: visible;
				}
				.beepboxEditor .trackAndMuteContainer {
					scrollbar-width: auto;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar {
					width: 20px;
					height: 20px;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-track {
					background: ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-thumb {
					background-color: ${ColorConfig.uiWidgetBackground};
					border: 3px solid ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-corner {
					background-color: ${ColorConfig.editorBackground};
				}
			}
		`,
		"wide": `\
			/* wide layout */
			@media (min-width: 1001px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: 512px 6px minmax(0, 1fr) 6px var(--settings-area-width, 30em);
					grid-template-rows: max-content minmax(481px, 1fr);
					grid-template-areas: "menu-area menu-area menu-area menu-area menu-area" "track-area h-splitter pattern-area v-splitter settings-area";
				}
				.beepboxEditor .pattern-area {
					width: 100%;
					height: 100%;
				}
				.beepboxEditor .track-area {
					width: 100%;
					height: 100%;
					max-height: 100%
				}
				.beepboxEditor .editor-widget-column {
					flex: 0;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					flex: 0;
					flex-basis: initial;
					flex-grow: 0;
					overflow-y: auto;
					max-height: 97.5vh;
				}
				.beepboxEditor .instrument-settings-area {
					position: relative;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}
				
				.beepboxEditor .song-settings-area {
					position: relative;
				}
				
				.beepboxEditor .settings-area {
					width: var(--settings-area-width, 30em);
					display: flex;
					flex-direction: column;
					gap: 8px;
					overflow-y: auto;
				}
				
				.beepboxEditor .trackContainer {
					overflow: visible;
				}
			}
		`,
		"flipped long": `\

            	/* AB Special layout */
			@media (min-width: 711px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: var(--settings-area-width, 390px) 6px minmax(0, 1fr);
					grid-template-rows: max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr);
					grid-template-areas: 
						"menu-area menu-area menu-area" 
						"settings-area v-splitter pattern-area" 
						"settings-area v-splitter h-splitter" 
						"settings-area v-splitter track-area";
				}
				.beepboxEditor .pattern-area {
					width: 100%;
					height: 100%;
				}
				.beepboxEditor .track-area {
					width: 100%;
					display: flex;
					flex-direction: column;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					min-height: 0;
					flex: 1;
					overflow: auto;
					max-height: 97.5vh;
				}
				.beepboxEditor .instrument-settings-area {
					position: relative;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}
				.beepboxEditor .song-settings-area {
					position: relative;
				}
				
				.beepboxEditor .settings-area {
					width: var(--settings-area-width, 30em);
					display: flex;
					flex-direction: column;
					gap: 8px;
					overflow-y: auto;
				}
				
				.beepboxEditor .barScrollBar {
					display: none;
				}
				.beepboxEditor.selectRow {
					height: 2em;
				}
				.beepboxEditor .trackAndMuteContainer {
					max-height: 446px;
				}

				.beepboxEditor .trackContainer {
					overflow: visible;
				}
				.beepboxEditor .trackAndMuteContainer {
					scrollbar-width: auto;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar {
					width: 20px;
					height: 20px;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-track {
					background: ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-thumb {
					background-color: ${ColorConfig.uiWidgetBackground};
					border: 3px solid ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-corner {
					background-color: ${ColorConfig.editorBackground};
				}
			}
		`,
		"wide long": `\

			@media (min-width: 711px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: minmax(0, 1fr) 6px var(--settings-area-width, 30em);
					grid-template-rows: max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr);
					grid-template-areas: 
						"menu-area menu-area menu-area" 
						"pattern-area v-splitter settings-area" 
						"h-splitter v-splitter settings-area" 
						"track-area v-splitter settings-area";
				}
				.beepboxEditor .pattern-area {
					width: 100%;
					height: 100%;
				}
				.beepboxEditor .track-area {
					display: flex;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					min-height: 0;
					flex: 1;
					overflow: auto;
					max-height: 97.5vh;
				}
				.beepboxEditor .instrument-settings-area {
					position: relative;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}
				
				.beepboxEditor .song-settings-area {
					position: relative;
				}
				
				.beepboxEditor .settings-area {
					width: var(--settings-area-width, 30em);
					display: flex;
					flex-direction: column;
					gap: 8px;
					overflow-y: auto;
				}				
				.beepboxEditor .barScrollBar {
					display: none;
				}
				.beepboxEditor.selectRow {
					height: 2em;
				}
				.beepboxEditor .trackAndMuteContainer {
					max-height: 446px;
				}

				.beepboxEditor .trackContainer {
					overflow: visible;
				}
				.beepboxEditor .trackAndMuteContainer {
					scrollbar-width: auto;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar {
					width: 20px;
					height: 20px;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-track {
					background: ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-thumb {
					background-color: ${ColorConfig.uiWidgetBackground};
					border: 3px solid ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-corner {
					background-color: ${ColorConfig.editorBackground};
				}
			}
		`,
		"focused long": `\

			/* focused long layout */
			@media (min-width: 711px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: minmax(0, 1fr) 6px var(--settings-area-width, 190px); 
					grid-template-rows: max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr);
					grid-template-areas: 
						"menu-area menu-area menu-area" 
						"pattern-area v-splitter settings-area" 
						"h-splitter v-splitter settings-area" 
						"track-area v-splitter settings-area";
				}
				.beepboxEditor .pattern-area {
					width: 100%;
					height: 100%;
				}
				.beepboxEditor .track-area {
					display: flex;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					min-height: 0;
					flex: 1;
					overflow: auto;
					max-height: 97.5vh;
				}
				.beepboxEditor .instrument-settings-area {
					position: relative;
					overflow: visible;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}

				.beepboxEditor .settings-area {
					width: var(--settings-area-width, 100%);
					position: relative;
					overflow-y: auto;
					display: flex;
					flex-direction: column;
					gap: 8px;
				}
				.beepboxEditor .barScrollBar {
					display: none;
				}
				.beepboxEditor.selectRow {
					height: 2em;
				}
				.beepboxEditor .trackAndMuteContainer {
					max-height: 446px;
				}

				.beepboxEditor .trackContainer {
					overflow: visible;
				}
				.beepboxEditor .trackAndMuteContainer {
					scrollbar-width: auto;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar {
					width: 20px;
					height: 20px;
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-track {
					background: ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-thumb {
					background-color: ${ColorConfig.uiWidgetBackground};
					border: 3px solid ${ColorConfig.editorBackground};
				}
				.beepboxEditor .trackAndMuteContainer::-webkit-scrollbar-corner {
					background-color: ${ColorConfig.editorBackground};
				}
			}
		`,

	}
		
	private static readonly _styleElement: HTMLStyleElement = document.head.appendChild(HTML.style({type: "text/css"}));
		
	public static setLayout(layout: string): void {
		this._styleElement.textContent = this._layoutMap[layout];
	}
}
