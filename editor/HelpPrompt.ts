// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";

const { button, div, h2, h3, p, ul, li, b } = HTML;

export class HelpPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement = div({ class: "prompt helpPrompt", style: "width: 580px; max-width: 90vw;" },
		h2("Help & Instructions"),
		div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
			h3({ style: "margin: 0.8em 0 0.4em 0; color: var(--link-accent, #98f);" }, "Basic Instructions"),
			p("You can add or remove notes by clicking on the rows in the pattern grid. MegaBox automatically plays the notes out loud for you."),
			p("Notes go into patterns, and you can edit one pattern at a time. The numbered boxes at the bottom of the editor are the different patterns. Click the boxes to move to a different part of the song, or click the arrows on the currently selected box to change which pattern is played."),
			p("MegaBox can play several rows of patterns simultaneously, and each row has its own set of patterns. Most rows can play melodies or harmonies, but the bottom rows are typically for drums or modulators."),
			p("All song data is contained in the URL in your browser. When you make changes to the song, the URL is updated to reflect your changes. Copy and paste the URL to save and share your song!"),

			h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, "Keyboard Shortcuts"),
			p("When MegaBox has focus, you can use these keyboard shortcuts:"),
			ul({ style: "padding-left: 20px; line-height: 1.6;" },
				li(b("Spacebar"), ": Play or pause the song"),
				li(b("Shift + Spacebar"), ": Play from mouse location"),
				li(b("Z"), ": Undo | ", b("Y or Shift + Z"), ": Redo"),
				li(b("C"), ": Copy pattern from selection"),
				li(b("V"), ": Paste pattern into selection"),
				li(b("0-9"), ": Assign pattern number to selection"),
				li(b("Arrows"), ": Move selection"),
				li(b("Ctrl + Arrows"), ": Rearrange channels"),
				li(b("[ ]"), ": Move playhead backward or forward"),
				li(b("F / H"), ": Move to First or Highlighted pattern"),
				li(b("Shift + Drag"), ": Select part of a pattern"),
				li(b("+ / -"), ": Transpose notes up or down"),
				li(b("W"), ": Move all notes sideways"),
				li(b("E"), ": Generate Euclidean rhythm"),
				li(b("L"), ": Change song length (bar count)"),
				li(b("Shift + B"), ": Change beats per bar"),
				li(b("Q"), ": Channel settings"),
				li(b("Shift + L"), ": Limiter settings"),
				li(b("Shift + Q"), ": Add custom samples"),
			),

			h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, "Editing Techniques & Advanced Tips"),
			p("In the note pattern editor, click and drag horizontally on a note to adjust its duration. Click above or below an existing note to add more notes for chords."),
			p(b("Pitch Bending: "), "Drag vertically from an existing note to bend its pitch."),
			p(b("Volume Adjustment: "), "Drag vertically from above or below a note to adjust its volume. Hold Control for fine volume adjustment!"),
			p(b("Multi-Selection: "), "Click and drag on the pattern grid to make a box selection. Then press C/V to mass copy/paste parts of your song."),
			p(b("Modulator Recording: "), "If your song has any modulator channels, you can hold Ctrl or Shift while the song is playing to record the movement of sliders directly!"),
			p(b("Mobile Touch: "), "On mobile or touchscreen devices, long-press in the pattern editor to select a time range within a pattern, which you can then drag to move multiple notes at once."),
		),
		this._cancelButton,
	);

	constructor(private _doc: SongDocument) {
		this._cancelButton.addEventListener("click", this._close);
	}

	private _close = (): void => {
		this._doc.undo();
	}

	public cleanUp = (): void => {
		this._cancelButton.removeEventListener("click", this._close);
	}
}
