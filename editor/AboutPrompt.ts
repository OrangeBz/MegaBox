// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, h2, h3, p, ul, li, a, b } = HTML;

export class AboutPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument) {
		const es = isSpanish();

		this.container = div({ class: "prompt aboutPrompt", style: "width: 520px; max-width: 90vw;" },
			h2(es ? "Acerca de MegaBox" : "About MegaBox"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				h3({ style: "margin: 0.8em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "¿Qué es MegaBox?" : "What is MegaBox?"),
				p(es
					? "MegaBox es un tracker musical modular y modernizado basado en el código de BeepBox / JummBox. Expande la fórmula principal con síntesis avanzada, soporte nativo de samples, paneles desacoplables y un flujo optimizado para móviles."
					: "MegaBox is a modernized, modular music tracker based on the BeepBox / JummBox codebase. It expands the core tracker formula with advanced synthesis, native sample support, modular panel docking, and a dedicated mobile workflow."),

				h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Mejoras clave frente a sus predecesores" : "Key Improvements over Predecessors"),
				ul({ style: "padding-left: 20px; line-height: 1.6; margin: 6px 0;" },
					li(b(es ? "Motor de sonido expandido: " : "Expanded Sound Engine: "), es ? "Síntesis FM de 6 operadores con matriz de algoritmos y feedback gráfico interactivo, loops/offsets avanzados de chip waves y unísono multivoz." : "6-operator FM synthesis with customizable algorithms and feedback graph, enhanced chip wave looping/offsets, and multi-voice unison."),
					li(b(es ? "Soporte nativo de samples: " : "Native Sample Support: "), es ? "Importación directa de audio (.wav, .mp3, .ogg, .flac) en almacenamiento local del navegador y empaquetado de proyectos ZIP." : "Direct audio file import (.wav, .mp3, .ogg, .flac) stored in browser storage and exportable as bundled ZIP song packages."),
					li(b(es ? "Espacio de trabajo modular: " : "Modular Workspace: "), es ? "Paneles arrastrables, desacoplables y bloqueables. Organiza el piano roll, secuenciador y barras de ajustes en divisiones horizontales o verticales." : "Draggable, dockable, and lockable panels. Arrange piano roll, sequencer, and sidebars in horizontal or vertical splits."),
					li(b(es ? "Experiencia móvil horizontal: " : "Mobile Landscape Experience: "), es ? "Interfaz a pantalla completa con paneles deslizantes, desplazamiento táctil en el secuenciador y controles flotantes compactos." : "Full-screen interface with slide-out drawers, gesture scrolling on the sequencer, and compact floating controls."),
					li(b(es ? "Modulación en tiempo real: " : "Real-Time Modulation: "), es ? "Grabación en vivo de automatización de sliders y canales de modulación extendidos." : "Live slider automation recording and extended modulator channels."),
				),

				h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Documentación y enlaces" : "Documentation & Links"),
				div({ style: "display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0;" },
					div({ style: "padding: 8px 10px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
						b("★ " + (es ? "Créditos: " : "Credits: ")),
						a({ href: "./credits.html", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, es ? "Colaboradores" : "Contributors"),
					),
					div({ style: "padding: 8px 10px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
						b("❓ " + (es ? "Preguntas: " : "FAQ: ")),
						a({ href: "./faq.html", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, es ? "Preguntas frecuentes" : "Questions"),
					),
					div({ style: "padding: 8px 10px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
						b("📝 " + (es ? "Notas de versión: " : "Patch Notes: ")),
						a({ href: "./patch_notes.html", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, es ? "Notas v1.0" : "Changelog v1.0"),
					),
					div({ style: "padding: 8px 10px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border-radius: 6px;" },
						b("🌐 " + (es ? "Archivo: " : "Archive: ")),
						a({ href: "https://twitter-archive.beepbox.co/", target: "_blank", style: "color: var(--link-accent, #98f); text-decoration: underline;" }, es ? "Archivo de canciones" : "Song Archive"),
					),
				),

				p({ style: "font-size: 11px; opacity: 0.8; margin-top: 12px;" }, es ? "MegaBox es software libre bajo la Licencia MIT. Las canciones se guardan comprimidas en la URL." : "MegaBox is free, open-source software under the MIT License. Songs are compressed and stored in the URL."),
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
