// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, h2, h3, p, a, b } = HTML;

interface ModCredit {
	name: string;
	authors: string;
	url: string;
	highlight?: boolean;
}

const modCredits: ModCredit[] = [
	{ name: "MegaBox", authors: "OrangeBz", url: "https://megabox.placeholder.io/", highlight: true },
	{ name: "UltraBox", authors: "Neptendo, Main & community", url: "https://ultraabox.github.io" },
	{ name: "Voxbox", authors: "Voxel", url: "https://voxeldeev.github.io/voxbox/website/" },
	{ name: "Slarmoo's Box", authors: "Slarmoo", url: "https://slarmoo.github.io/slarmoosbox/website/" },
	{ name: "Unbox", authors: "Unconventional", url: "https://un-conventional.github.io/" },
	{ name: "Nepbox", authors: "Neptendo", url: "https://neptendo.github.io/nepbox/" },
	{ name: "AbyssBox", authors: "choptop84", url: "https://choptop84.github.io/abyssbox-app/" },
	{ name: "Dogebox2", authors: "DogeisCut", url: "https://dogeiscut.github.io/dogebox2/" },
	{ name: "Midbox", authors: "MidTheComposer", url: "https://mid-the-modder.github.io/Midbox/" },
	{ name: "MarioPaintbox", authors: "siliconetemper", url: "https://pmpbox.glitch.me" },
	{ name: "Blubox Desktop", authors: "Bluto", url: "https://github.com/planet-bluto/BluBox2.0/releases/" },
	{ name: "NeuBox", authors: "theparadoxbox", url: "https://github.com/TheParadoxBox/NeuBox/releases/" },
	{ name: "FoxBox", authors: "elithefox", url: "https://elithefox.neocities.org/FoxBox" },
	{ name: "Thurmbox", authors: "Thurm", url: "https://pandoras-box-archive.neptendo.repl.co" },
	{ name: "PaandorasBox", authors: "Main & Jinx", url: "https://paandorasbox.github.io/" },
	{ name: "MicroBox", authors: "TheThreadSnake", url: "https://thethreadsnake.github.io/microbox/" },
	{ name: "Goldbox", authors: "AurySystem", url: "https://aurysystem.github.io/goldbox" },
	{ name: "Nintaribox", authors: "Nintari", url: "https://nintarigenesis.bitbucket.io/" },
	{ name: "WeebBox", authors: "Jimothee", url: "https://jimothee.bitbucket.io/" },
	{ name: "Todbox", authors: "Just a Toad & Main", url: "https://todbox.github.io/" },
	{ name: "Wackybox", authors: "Jinx", url: "https://bluecatgamer.github.io/Wackybox/" },
	{ name: "Synthbox", authors: "Chopy61", url: "https://synthbox.co" },
	{ name: "Blubox", authors: "Bluto", url: "https://ultraabox.github.io/archives/blubox/" },
	{ name: "Dogebox", authors: "DogeisCut", url: "https://dogeiscut.github.io/Dogebox/" },
	{ name: "Cardboardbox", authors: "HiddenRealm", url: "https://hidden-realm.github.io/cardboardbox/" },
	{ name: "JummBox", authors: "Jummbus", url: "https://jummbus.bitbucket.io/" },
	{ name: "Blackbox", authors: "HiddenRealm", url: "https://lihzahrd.github.io/blackbox/" },
	{ name: "Shitbox", authors: "HiddenRealm", url: "https://lihzahrd.github.io/shitbox/" },
	{ name: "Zefbox", authors: "Zef", url: "https://ultraabox.github.io/archives/zefbox" },
	{ name: "NerdBox", authors: "Green Guy", url: "https://ultraabox.github.io/archives/nerdbox" },
	{ name: "Brucebox", authors: "Stinker06", url: "https://ultraabox.github.io/archives/brucebox" },
	{ name: "Haileybox", authors: "Hailey", url: "https://ultraabox.github.io/archives/haileybox" },
	{ name: "Sandbox", authors: "Fillygroove", url: "https://fillygroove.github.io/sandbox-3.1/" },
	{ name: "Modbox", authors: "Theepicosity, Quirby, DAzombieRE, Fillygroove", url: "https://moddedbeepbox.github.io/3.0/" },
	{ name: "BeepBox", authors: "John Nesky", url: "https://beepbox.co/" },
];

export class CreditsPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument) {
		const es = isSpanish();

		const cardElements: HTMLElement[] = modCredits.map(mod => {
			const isHighlighted = !!mod.highlight;
			return div({
				style: `padding: 10px 14px; margin-bottom: 8px; border-radius: 8px; background: ${isHighlighted ? "rgba(56, 189, 248, 0.12)" : "var(--ui-widget-background, rgba(255, 255, 255, 0.05))"}; border: 1px solid ${isHighlighted ? "var(--accent-mod-cyan, #38bdf8)" : "var(--border-subtle, rgba(255, 255, 255, 0.1))"}; display: flex; flex-direction: column; gap: 3px;`
			},
				div({ style: "display: flex; justify-content: space-between; align-items: center;" },
					h3({ style: `margin: 0; font-size: 1.05rem; font-weight: 700; color: ${isHighlighted ? "var(--accent-mod-cyan, #38bdf8)" : "var(--primary-text, #fff)"};` }, mod.name),
					a({ href: mod.url, target: "_blank", style: "font-size: 0.85rem; color: var(--link-accent, #38bdf8); text-decoration: underline;" }, es ? "Visitar web" : "Visit website"),
				),
				p({ style: "margin: 0; font-size: 0.85rem; color: var(--secondary-text, #94a3b8);" },
					b(es ? "Creado por: " : "Made by: "),
					mod.authors
				),
			);
		});

		this.container = div({ class: "prompt creditsPrompt", style: "width: 580px; max-width: 90vw;" },
			h2(es ? "Créditos y Cronología" : "Credits & Mod Lineage"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				p({ style: "margin: 0 0 12px 0; font-size: 0.9rem; color: var(--secondary-text, #94a3b8);" },
					es
						? "MegaBox se construye sobre el legado de BeepBox y su increíble comunidad de desarrolladores de mods:"
						: "MegaBox is built upon the legacy of BeepBox and its incredible community of mod developers:"
				),
				...cardElements,
			),
			this._cancelButton,
		);

		this._cancelButton.addEventListener("click", this._close);
	}

	private _close = (): void => {
		this._doc.undo();
	}

	public cleanUp = (): void => {
		this._cancelButton.removeEventListener("click", this._close);
	}
}
