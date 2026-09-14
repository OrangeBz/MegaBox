// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, span, h2, h3, p, ul, li, b } = HTML;

export class AboutPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument, private _onNavigate?: (promptName: string) => void) {
		const es = isSpanish();

		const sectionStyle = "margin-bottom: 16px; text-align: left;";
		const h3Style = "margin: 0 0 6px 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);";

		const createNavBtn = (title: string, desc: string, promptName?: string, url?: string): HTMLElement => {
			const btn = div({
				style: "padding: 8px 12px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1)); border-radius: 6px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; transition: background-color 0.15s ease;"
			},
				div({ style: "font-weight: 700; font-size: 0.9rem; color: var(--link-accent, #38bdf8);" }, title),
				div({ style: "font-size: 0.8rem; color: var(--secondary-text, #94a3b8);" }, desc)
			);

			btn.addEventListener("mouseenter", () => {
				btn.style.backgroundColor = "rgba(56, 189, 248, 0.12)";
			});
			btn.addEventListener("mouseleave", () => {
				btn.style.backgroundColor = "var(--ui-widget-background, rgba(255,255,255,0.06))";
			});

			btn.addEventListener("click", () => {
				if (promptName && this._onNavigate) {
					this._onNavigate(promptName);
				} else if (promptName) {
					this._doc.openPrompt(promptName);
				} else if (url) {
					window.open(url, "_blank");
				}
			});

			return btn;
		};

		this.container = div({ class: "prompt aboutPrompt", style: "width: 540px; max-width: 90vw;" },
			h2(es ? "Acerca de MegaBox" : "About MegaBox"),
			div({ style: "max-height: 460px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				div({ style: sectionStyle },
					h3({ style: h3Style }, es ? "¿Qué es MegaBox?" : "What is MegaBox?"),
					p({ style: "margin: 0; font-size: 0.9rem; line-height: 1.5; color: var(--primary-text, #e2e8f0);" },
						es
							? "MegaBox es una herramienta en línea para crear y compartir música de forma sencilla. Basado en BeepBox, JummBox y UltraBox, añade más opciones de sonido, soporte para audio personalizado y paneles ajustables."
							: "MegaBox is an online tool for creating and sharing music easily. Based on BeepBox, JummBox, and UltraBox, it adds expanded sound options, custom audio support, and adjustable panels."
					),
				),

				div({ style: sectionStyle },
					h3({ style: h3Style }, es ? "Novedades principales" : "Key Features"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.6; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
						li(b(es ? "Sonido ampliado: " : "Expanded Sound: "), es ? "Síntesis FM de 6 operadores, nuevos tipos de onda y unísono." : "6-operator FM synthesis, new wave types, and unison."),
						li(b(es ? "Audio propio: " : "Custom Audio: "), es ? "Importa tus propios archivos (.wav, .mp3, .ogg, .flac) y guárdalos en proyectos." : "Import your own audio files (.wav, .mp3, .ogg, .flac) and save them in projects."),
						li(b(es ? "Paneles móviles: " : "Flexible Workspace: "), es ? "Organiza, mueve y fija las distintas secciones de la interfaz a tu gusto." : "Rearrange, move, and lock interface panels as you like."),
						li(b(es ? "Modo móvil: " : "Mobile Friendly: "), es ? "Diseño adaptado para usar cómodamente en teléfonos y tabletas." : "Adapted layout for easy use on phones and tablets."),
					),
				),

				div({ style: sectionStyle },
					h3({ style: h3Style }, es ? "Enlaces y ayuda" : "Links & Help"),
					div({ style: "display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" },
						createNavBtn(es ? "Créditos" : "Credits", es ? "Creadores y colaboradores" : "Creators and contributors", "credits"),
						createNavBtn(es ? "Preguntas Frecuentes" : "FAQ", es ? "Respuestas y ayuda rápida" : "Common questions & help", "faq"),
						createNavBtn(es ? "Notas de Versión" : "Patch Notes", es ? "Cambios y novedades" : "Recent updates and changes", "patchNotes"),
						createNavBtn(es ? "Archivo de Canciones" : "Song Archive", es ? "Canciones de la comunidad" : "Community song archive", undefined, "https://twitter-archive.beepbox.co/"),
					),
				),

				div({ style: "margin-top: 12px; font-size: 0.85rem; color: var(--secondary-text, #94a3b8); display: flex; justify-content: space-between; align-items: center;" },
					span({ style: "font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);" }, "MegaBox by OrangeBz"),
					span(es ? "Licencia libre MIT" : "MIT License"),
				),
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
