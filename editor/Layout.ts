// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";

export interface WorkspaceState {
	primarySplit: "vertical" | "horizontal"; // "vertical" = top/bottom; "horizontal" = left/right
	primaryInverted: boolean; // false = Pattern first, Track second; true = Track first, Pattern second
	songSettingsDock: "left" | "right";
	instrumentSettingsDock: "left" | "right";
	sharedDockOrientation: "row" | "column"; // When both share same dock
	sharedDockOrder: "song-first" | "instrument-first"; // When both share same dock
	locked: { [key: string]: boolean }; // "pattern", "track", "songSettings", "instrumentSettings"
	// Sizing parameters
	patternAreaHeight?: number;
	primaryLeftWidth?: number;
	songSettingsWidth?: number;
	instrumentSettingsWidth?: number;
	settingsColWidth?: number;
	firstSettingHeight?: number;
	settingsAreaHeight?: number;
	floatingControlsPos?: { x: number; y: number } | null;
	songSettingsCollapsed?: boolean;
	instrumentSettingsCollapsed?: boolean;
}

export class Layout {
	private static readonly _STORAGE_KEY = "megabox_workspace_state_v2";

	private static _state: WorkspaceState = Layout._loadInitialState();
	private static readonly _styleElement: HTMLStyleElement = document.head.appendChild(HTML.style({ type: "text/css" }));

	private static _loadInitialState(): WorkspaceState {
		const defaultState: WorkspaceState = {
			primarySplit: "vertical",
			primaryInverted: false,
			songSettingsDock: "right",
			instrumentSettingsDock: "right",
			sharedDockOrientation: "row",
			sharedDockOrder: "song-first",
			locked: {
				pattern: true,
				track: true,
				songSettings: true,
				instrumentSettings: true,
			},
			patternAreaHeight: 460,
			songSettingsWidth: 192,
			instrumentSettingsWidth: 216,
			settingsColWidth: 216,
			firstSettingHeight: 240,
			settingsAreaHeight: 200,
		};

		try {
			const saved = window.localStorage.getItem(Layout._STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				return {
					...defaultState,
					...parsed,
					songSettingsDock: parsed.songSettingsDock === "left" ? "left" : "right",
					instrumentSettingsDock: parsed.instrumentSettingsDock === "left" ? "left" : "right",
					locked: { ...defaultState.locked, ...(parsed.locked || {}) },
				};
			}
			const oldSaved = window.localStorage.getItem("megabox_workspace_state");
			if (oldSaved) {
				const oldParsed = JSON.parse(oldSaved);
				const dock = oldParsed.dockPosition === "left" ? "left" : "right";
				return {
					...defaultState,
					primarySplit: oldParsed.primarySplit || "vertical",
					primaryInverted: !!oldParsed.primaryInverted,
					songSettingsDock: dock,
					instrumentSettingsDock: dock,
					sharedDockOrientation: oldParsed.settingsOrientation || "row",
					sharedDockOrder: oldParsed.settingsInverted ? "instrument-first" : "song-first",
					locked: { ...defaultState.locked, ...(oldParsed.locked || {}) },
				};
			}
		} catch (e) {
			console.warn("Failed to load workspace state from localStorage:", e);
		}
		return defaultState;
	}

	public static getWorkspaceState(): WorkspaceState {
		return { ...this._state, locked: { ...this._state.locked } };
	}

	public static saveWorkspaceState(newState: Partial<WorkspaceState>): void {
		this._state = {
			...this._state,
			...newState,
			locked: { ...this._state.locked, ...(newState.locked || {}) },
		};
		try {
			window.localStorage.setItem(this._STORAGE_KEY, JSON.stringify(this._state));
		} catch (e) {
			console.warn("Failed to save workspace state to localStorage:", e);
		}
		this.applyWorkspaceState();
	}

	public static isPanelLocked(panelId: string): boolean {
		return this._state.locked[panelId] !== false;
	}

	public static setPanelLock(panelId: string, locked: boolean): void {
		const newLocked = { ...this._state.locked, [panelId]: locked };
		this.saveWorkspaceState({ locked: newLocked });
	}

	public static setPrimarySplit(split: "vertical" | "horizontal"): void {
		this.saveWorkspaceState({ primarySplit: split });
	}

	public static setPanelSize(property: "patternAreaHeight" | "primaryLeftWidth" | "songSettingsWidth" | "instrumentSettingsWidth" | "settingsColWidth" | "firstSettingHeight" | "settingsAreaHeight", value: number): void {
		this.saveWorkspaceState({ [property]: value });
	}

	public static setFloatingControlsPos(pos: { x: number; y: number } | null): void {
		this.saveWorkspaceState({ floatingControlsPos: pos });
	}

	public static setPanelCollapsed(panel: "songSettings" | "instrumentSettings", collapsed: boolean): void {
		if (panel === "songSettings") {
			this.saveWorkspaceState({ songSettingsCollapsed: collapsed });
		} else {
			this.saveWorkspaceState({ instrumentSettingsCollapsed: collapsed });
		}
	}

	public static setLayout(_layoutName?: string): void {
		this.applyWorkspaceState();
	}

	public static applyWorkspaceState(): void {
		const state = this._state;

		if (typeof document !== "undefined" && document.documentElement) {
			if (state.patternAreaHeight != null) {
				document.documentElement.style.setProperty("--pattern-area-height", `${state.patternAreaHeight}px`);
			}
			if (state.primaryLeftWidth != null) {
				document.documentElement.style.setProperty("--primary-left-width", `${state.primaryLeftWidth}px`);
			}
			if (state.songSettingsWidth != null) {
				document.documentElement.style.setProperty("--song-settings-width", `${state.songSettingsWidth}px`);
			}
			if (state.instrumentSettingsWidth != null) {
				document.documentElement.style.setProperty("--instrument-settings-width", `${state.instrumentSettingsWidth}px`);
			}
			if (state.settingsColWidth != null) {
				document.documentElement.style.setProperty("--settings-col-width", `${state.settingsColWidth}px`);
			}
			if (state.firstSettingHeight != null) {
				document.documentElement.style.setProperty("--first-setting-height", `${state.firstSettingHeight}px`);
			}
			if (state.settingsAreaHeight != null) {
				document.documentElement.style.setProperty("--settings-area-height", `${state.settingsAreaHeight}px`);
			}
		}

		const topPanel = state.primaryInverted ? "track-area" : "pattern-area";
		const bottomPanel = state.primaryInverted ? "pattern-area" : "track-area";
		const leftPanel = state.primaryInverted ? "track-area" : "pattern-area";
		const rightPanel = state.primaryInverted ? "pattern-area" : "track-area";
		const isHorizontalPrimary = state.primarySplit === "horizontal";

		let gridTemplateColumns = "";
		let gridTemplateRows = "";
		let gridTemplateAreas = "";

		const songDock = state.songSettingsDock;
		const instDock = state.instrumentSettingsDock;

		// Case 1: Song Settings on Left, Instrument Settings on Right
		if (songDock === "left" && instDock === "right") {
			if (!isHorizontalPrimary) {
				gridTemplateColumns = "clamp(185px, var(--song-settings-width, 192px), 320px) 6px minmax(250px, 1fr) 6px clamp(185px, var(--instrument-settings-width, 216px), 320px)";
				gridTemplateRows = "max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr)";
				gridTemplateAreas = state.primaryInverted ? `
					"menu-area menu-area menu-area menu-area menu-area"
					"${topPanel} ${topPanel} ${topPanel} ${topPanel} ${topPanel}"
					"h-splitter h-splitter h-splitter h-splitter h-splitter"
					"song-settings-area v-splitter-left ${bottomPanel} v-splitter-right instrument-settings-area"
				` : `
					"menu-area menu-area menu-area menu-area menu-area"
					"song-settings-area v-splitter-left ${topPanel} v-splitter-right instrument-settings-area"
					"h-splitter h-splitter h-splitter h-splitter h-splitter"
					"${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel}"
				`;
			} else {
				gridTemplateColumns = "clamp(185px, var(--song-settings-width, 192px), 320px) 6px var(--primary-left-width, 1fr) 6px minmax(200px, 1fr) 6px clamp(185px, var(--instrument-settings-width, 216px), 320px)";
				gridTemplateRows = "max-content 1fr";
				gridTemplateAreas = `
					"menu-area menu-area menu-area menu-area menu-area menu-area menu-area"
					"song-settings-area v-splitter-left ${leftPanel} h-splitter ${rightPanel} v-splitter-right instrument-settings-area"
				`;
			}
		}
		// Case 2: Instrument Settings on Left, Song Settings on Right
		else if (instDock === "left" && songDock === "right") {
			if (!isHorizontalPrimary) {
				gridTemplateColumns = "clamp(185px, var(--instrument-settings-width, 216px), 320px) 6px minmax(250px, 1fr) 6px clamp(185px, var(--song-settings-width, 192px), 320px)";
				gridTemplateRows = "max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr)";
				gridTemplateAreas = state.primaryInverted ? `
					"menu-area menu-area menu-area menu-area menu-area"
					"${topPanel} ${topPanel} ${topPanel} ${topPanel} ${topPanel}"
					"h-splitter h-splitter h-splitter h-splitter h-splitter"
					"instrument-settings-area v-splitter-left ${bottomPanel} v-splitter-right song-settings-area"
				` : `
					"menu-area menu-area menu-area menu-area menu-area"
					"instrument-settings-area v-splitter-left ${topPanel} v-splitter-right song-settings-area"
					"h-splitter h-splitter h-splitter h-splitter h-splitter"
					"${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel}"
				`;
			} else {
				gridTemplateColumns = "clamp(185px, var(--instrument-settings-width, 216px), 320px) 6px var(--primary-left-width, 1fr) 6px minmax(200px, 1fr) 6px clamp(185px, var(--song-settings-width, 192px), 320px)";
				gridTemplateRows = "max-content 1fr";
				gridTemplateAreas = `
					"menu-area menu-area menu-area menu-area menu-area menu-area menu-area"
					"instrument-settings-area v-splitter-left ${leftPanel} h-splitter ${rightPanel} v-splitter-right song-settings-area"
				`;
			}
		}
		// Case 3: Both on Left
		else if (songDock === "left" && instDock === "left") {
			const firstPanel = state.sharedDockOrder === "song-first" ? "song-settings-area" : "instrument-settings-area";
			const secondPanel = state.sharedDockOrder === "song-first" ? "instrument-settings-area" : "song-settings-area";
			const firstWidth = state.sharedDockOrder === "song-first" ? "var(--song-settings-width, 192px)" : "var(--instrument-settings-width, 216px)";
			const secondWidth = state.sharedDockOrder === "song-first" ? "var(--instrument-settings-width, 216px)" : "var(--song-settings-width, 192px)";

			if (state.sharedDockOrientation === "row") {
				if (!isHorizontalPrimary) {
					gridTemplateColumns = `clamp(185px, ${firstWidth}, 320px) 6px clamp(185px, ${secondWidth}, 320px) 6px minmax(250px, 1fr)`;
					gridTemplateRows = "max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr)";
					gridTemplateAreas = state.primaryInverted ? `
						"menu-area menu-area menu-area menu-area menu-area"
						"${topPanel} ${topPanel} ${topPanel} ${topPanel} ${topPanel}"
						"h-splitter h-splitter h-splitter h-splitter h-splitter"
						"${firstPanel} v-splitter-mid ${secondPanel} v-splitter-left ${bottomPanel}"
					` : `
						"menu-area menu-area menu-area menu-area menu-area"
						"${firstPanel} v-splitter-mid ${secondPanel} v-splitter-left ${topPanel}"
						"h-splitter h-splitter h-splitter h-splitter h-splitter"
						"${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel}"
					`;
				} else {
					gridTemplateColumns = `clamp(185px, ${firstWidth}, 320px) 6px clamp(185px, ${secondWidth}, 320px) 6px var(--primary-left-width, 1fr) 6px minmax(200px, 1fr)`;
					gridTemplateRows = "max-content 1fr";
					gridTemplateAreas = `
						"menu-area menu-area menu-area menu-area menu-area menu-area menu-area"
						"${firstPanel} v-splitter-mid ${secondPanel} v-splitter-left ${leftPanel} h-splitter ${rightPanel}"
					`;
				}
			} else {
				// Stacked in column on left
				if (!isHorizontalPrimary) {
					gridTemplateColumns = "clamp(185px, var(--settings-col-width, 216px), 320px) 6px minmax(250px, 1fr)";
					gridTemplateRows = "max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr)";
					gridTemplateAreas = state.primaryInverted ? `
						"menu-area menu-area menu-area"
						"${topPanel} ${topPanel} ${topPanel}"
						"h-splitter h-splitter h-splitter"
						"settings-col-area v-splitter-left ${bottomPanel}"
					` : `
						"menu-area menu-area menu-area"
						"settings-col-area v-splitter-left ${topPanel}"
						"h-splitter h-splitter h-splitter"
						"${bottomPanel} ${bottomPanel} ${bottomPanel}"
					`;
				} else {
					gridTemplateColumns = "clamp(185px, var(--settings-col-width, 216px), 320px) 6px var(--primary-left-width, 1fr) 6px minmax(200px, 1fr)";
					gridTemplateRows = "max-content 1fr";
					gridTemplateAreas = `
						"menu-area menu-area menu-area menu-area menu-area"
						"settings-col-area v-splitter-left ${leftPanel} h-splitter ${rightPanel}"
					`;
				}
			}
		}
		// Default / Case 4: Both on Right
		else {
			const firstPanel = state.sharedDockOrder === "song-first" ? "song-settings-area" : "instrument-settings-area";
			const secondPanel = state.sharedDockOrder === "song-first" ? "instrument-settings-area" : "song-settings-area";
			const firstWidth = state.sharedDockOrder === "song-first" ? "var(--song-settings-width, 192px)" : "var(--instrument-settings-width, 216px)";
			const secondWidth = state.sharedDockOrder === "song-first" ? "var(--instrument-settings-width, 216px)" : "var(--song-settings-width, 192px)";

			if (state.sharedDockOrientation === "row") {
				if (!isHorizontalPrimary) {
					gridTemplateColumns = `minmax(250px, 1fr) 6px clamp(185px, ${firstWidth}, 320px) 6px clamp(185px, ${secondWidth}, 320px)`;
					gridTemplateRows = "max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr)";
					gridTemplateAreas = state.primaryInverted ? `
						"menu-area menu-area menu-area menu-area menu-area"
						"${topPanel} ${topPanel} ${topPanel} ${topPanel} ${topPanel}"
						"h-splitter h-splitter h-splitter h-splitter h-splitter"
						"${bottomPanel} v-splitter-right ${firstPanel} v-splitter-mid ${secondPanel}"
					` : `
						"menu-area menu-area menu-area menu-area menu-area"
						"${topPanel} v-splitter-right ${firstPanel} v-splitter-mid ${secondPanel}"
						"h-splitter h-splitter h-splitter h-splitter h-splitter"
						"${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel} ${bottomPanel}"
					`;
				} else {
					gridTemplateColumns = `var(--primary-left-width, 1fr) 6px minmax(200px, 1fr) 6px clamp(185px, ${firstWidth}, 320px) 6px clamp(185px, ${secondWidth}, 320px)`;
					gridTemplateRows = "max-content 1fr";
					gridTemplateAreas = `
						"menu-area menu-area menu-area menu-area menu-area menu-area menu-area"
						"${leftPanel} h-splitter ${rightPanel} v-splitter-right ${firstPanel} v-splitter-mid ${secondPanel}"
					`;
				}
			} else {
				// Stacked in column on right
				if (!isHorizontalPrimary) {
					gridTemplateColumns = "minmax(250px, 1fr) 6px clamp(185px, var(--settings-col-width, 216px), 320px)";
					gridTemplateRows = "max-content var(--pattern-area-height, 460px) 6px minmax(100px, 1fr)";
					gridTemplateAreas = state.primaryInverted ? `
						"menu-area menu-area menu-area"
						"${topPanel} ${topPanel} ${topPanel}"
						"h-splitter h-splitter h-splitter"
						"${bottomPanel} v-splitter-right settings-col-area"
					` : `
						"menu-area menu-area menu-area"
						"${topPanel} v-splitter-right settings-col-area"
						"h-splitter h-splitter h-splitter"
						"${bottomPanel} ${bottomPanel} ${bottomPanel}"
					`;
				} else {
					gridTemplateColumns = "var(--primary-left-width, 1fr) 6px minmax(200px, 1fr) 6px clamp(185px, var(--settings-col-width, 216px), 320px)";
					gridTemplateRows = "max-content 1fr";
					gridTemplateAreas = `
						"menu-area menu-area menu-area menu-area menu-area"
						"${leftPanel} h-splitter ${rightPanel} v-splitter-right settings-col-area"
					`;
				}
			}
		}

		const hasLeftSplitter = gridTemplateAreas.includes("v-splitter-left");
		const hasRightSplitter = gridTemplateAreas.includes("v-splitter-right");
		const hasMidSplitter = gridTemplateAreas.includes("v-splitter-mid");
		const hasMidHorizontalSplitter = gridTemplateAreas.includes("h-splitter-mid");
		const hasBottomSplitter = gridTemplateAreas.includes("v-splitter-bottom");

		this._styleElement.textContent = `
			@media (min-width: 901px), (min-width: 711px) and (min-height: 561px) {
				#beepboxEditorContainer {
					max-width: initial;
					height: 100vh;
					height: 100dvh;
					padding-top: 0px;
				}
				.beepboxEditor {
					width: 100%;
					height: 100vh;
					height: 100dvh;
					padding: 6px;
					gap: 6px;
					box-sizing: border-box;
					grid-template-columns: ${gridTemplateColumns};
					grid-template-rows: ${gridTemplateRows};
					grid-template-areas: ${gridTemplateAreas};
				}
				.beepboxEditor .pattern-area {
					grid-area: pattern-area;
					width: 100%;
					height: 100%;
					min-width: 0;
					min-height: 0;
					position: relative;
				}
				.beepboxEditor .track-area {
					grid-area: track-area;
					width: 100%;
					height: 100%;
					min-width: 0;
					min-height: 0;
					display: flex;
					flex-direction: column;
					position: relative;
				}
				.beepboxEditor .trackAndMuteContainer {
					width: 100%;
					min-height: 0;
					flex: 1;
					overflow: auto;
					max-height: 100%;
				}
				.beepboxEditor .settings-stack-container {
					grid-area: settings-col-area;
					display: flex;
					flex-direction: column;
					width: 100%;
					min-width: 185px;
					max-width: 320px;
					height: 100%;
					max-height: 100%;
					min-height: 0;
					position: relative;
					box-sizing: border-box;
					overflow: hidden;
				}
				.beepboxEditor .song-settings-area {
					grid-area: song-settings-area;
					min-width: 185px;
					max-width: 320px;
					max-height: 100%;
					height: 100%;
					overflow-y: auto;
					overflow-x: hidden;
					box-sizing: border-box;
					scrollbar-width: thin;
					flex-shrink: 0;
					position: relative;
				}
				.beepboxEditor .instrument-settings-area {
					grid-area: instrument-settings-area;
					min-width: 185px;
					max-width: 320px;
					max-height: 100%;
					height: 100%;
					overflow-y: auto;
					overflow-x: hidden;
					box-sizing: border-box;
					scrollbar-width: thin;
					flex-shrink: 0;
					position: relative;
				}
				.beepboxEditor .instrument-settings-area > .editor-controls {
					position: relative;
					width: 100%;
				}

				.beepboxEditor .editor-splitter-horizontal {
					grid-area: h-splitter;
					display: flex;
					cursor: ${isHorizontalPrimary ? "col-resize" : "row-resize"};
					${isHorizontalPrimary ? "width: 6px; height: 100%; border-top: none; border-bottom: none; border-left: 1px solid var(--border-subtle, #2e2e33); border-right: 1px solid var(--border-subtle, #2e2e33);" : "height: 6px; width: 100%; border-left: none; border-right: none; border-top: 1px solid var(--border-subtle, #2e2e33); border-bottom: 1px solid var(--border-subtle, #2e2e33);"}
				}
				.beepboxEditor .editor-splitter-horizontal .splitter-handle-h {
					${isHorizontalPrimary ? "width: 3px; height: 42px;" : "height: 3px; width: 42px;"}
				}
				.beepboxEditor .editor-splitter-horizontal:hover .splitter-handle-h,
				.beepboxEditor .editor-splitter-horizontal.active .splitter-handle-h {
					${isHorizontalPrimary ? "height: 60px; width: 3px;" : "width: 60px; height: 3px;"}
				}

				.beepboxEditor .editor-splitter-left {
					grid-area: v-splitter-left;
					cursor: col-resize;
					width: 6px;
					height: 100%;
					display: ${hasLeftSplitter ? "flex" : "none"};
				}

				.beepboxEditor .editor-splitter-right {
					grid-area: v-splitter-right;
					cursor: col-resize;
					width: 6px;
					height: 100%;
					display: ${hasRightSplitter ? "flex" : "none"};
				}

				.beepboxEditor .editor-splitter-mid {
					grid-area: v-splitter-mid;
					cursor: col-resize;
					width: 6px;
					height: 100%;
					display: ${hasMidSplitter ? "flex" : "none"};
				}

				.beepboxEditor .editor-splitter-mid-h {
					grid-area: h-splitter-mid;
					cursor: row-resize;
					height: 6px;
					width: 100%;
					display: ${hasMidHorizontalSplitter ? "flex" : "none"};
				}

				.beepboxEditor .editor-splitter-bottom {
					grid-area: v-splitter-bottom;
					cursor: row-resize;
					height: 6px;
					width: 100%;
					display: ${hasBottomSplitter ? "flex" : "none"};
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
		`;
	}
}

// Apply workspace state styles and CSS variables on startup
Layout.applyWorkspaceState();
