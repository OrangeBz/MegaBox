// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, span, h2, h3, p, ul, li, b, a } = HTML;

export class AboutPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument, private _onNavigate?: (promptName: string) => void) {
		const es = isSpanish();

		const sectionStyle = "margin-bottom: 16px; text-align: left;";
		const h3Style = "margin: 0 0 6px 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);";

		const createLink = (title: string, promptName: string): HTMLElement => {
			const link = a({
				href: "#",
				style: "font-weight: 600; color: var(--link-accent, #38bdf8); text-decoration: underline; cursor: pointer;"
			}, title);
			link.addEventListener("click", (e: MouseEvent) => {
				e.preventDefault();
				if (this._onNavigate) {
					this._onNavigate(promptName);
				} else {
					this._doc.openPrompt(promptName);
				}
			});
			return link;
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
					h3({ style: h3Style }, es ? "Secciones y recursos" : "Sections & Resources"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.8; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
						li(createLink(es ? "Créditos y Cronología" : "Credits & Mod Lineage", "credits"), es ? " — Desarrolladores y proyectos base" : " — Developers and base projects"),
						li(createLink(es ? "Preguntas Frecuentes (FAQ)" : "Frequently Asked Questions (FAQ)", "faq"), es ? " — Dudas comunes y soluciones" : " — Common questions & solutions"),
						li(createLink(es ? "Notas de Versión" : "Patch Notes", "patchNotes"), es ? " — Lista de cambios y novedades" : " — Recent updates & changes"),
						li(a({ href: "https://twitter-archive.beepbox.co/", target: "_blank", style: "font-weight: 600; color: var(--link-accent, #38bdf8); text-decoration: underline;" }, es ? "Archivo de Canciones" : "Song Archive"), es ? " — Biblioteca de canciones de la comunidad" : " — Community song library"),
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
