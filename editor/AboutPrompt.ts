// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";

const { button, div, h2, h3, p, a, b } = HTML;

export class AboutPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement = div({ class: "prompt aboutPrompt", style: "width: 520px; max-width: 90vw;" },
		h2("About MegaBox"),
		div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
			h3({ style: "margin: 0.8em 0 0.4em 0; color: var(--link-accent, #98f);" }, "Overview"),
			p("MegaBox is an advanced music workstation designed for composing and sharing chiptune and instrumental music directly in your browser."),
			p("It unites the most versatile synthesizer engines, custom sample playback, enhanced modulation, and extensive sound design tools from the BeepBox ecosystem into one fast, modern package."),

			h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, "Documentation & Resources"),
			div({ style: "display: flex; flex-direction: column; gap: 8px; margin: 12px 0;" },
				div({ style: "padding: 8px 12px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
					b("★ Credits: "),
					a({ href: "./credits.html", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, "View authors and contributors"),
				),
				div({ style: "padding: 8px 12px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
					b("❓ FAQ: "),
					a({ href: "./faq.html", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, "Frequently Asked Questions"),
				),
				div({ style: "padding: 8px 12px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
					b("📝 Patch Notes: "),
					a({ href: "./patch_notes.html", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, "Latest changelog & feature history"),
				),
				div({ style: "padding: 8px 12px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
					b("🌐 Song Archive: "),
					a({ href: "https://twitter-archive.beepbox.co/", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, "Interactive Song Archive"),
				),
			),

			h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, "License & Passion Project"),
			p("MegaBox is distributed under the MIT license and is a free, open-source passion project. All song data is saved and compressed directly within the shareable URL."),
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
