// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, h2, h3, p, ul, li, b } = HTML;

export class AboutPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument, private _onNavigate?: (promptName: string) => void) {
		const es = isSpanish();

		const cardStyle = "padding: 12px 14px; margin-bottom: 10px; border-radius: 8px; background: var(--ui-widget-background, rgba(255, 255, 255, 0.05)); border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1)); display: flex; flex-direction: column; gap: 6px;";
		const h3Style = "margin: 0 0 4px 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);";

		const createNavCard = (title: string, desc: string, promptName?: string, url?: string): HTMLElement => {
			const card = div({
				style: "padding: 10px 12px; background: var(--ui-widget-background, rgba(255,255,255,0.06)); border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1)); border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; transition: border-color 0.15s ease, background-color 0.15s ease;"
			},
				div({ style: "display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.95rem; color: var(--link-accent, #38bdf8);" },
					title
				),
				p({ style: "margin: 0; font-size: 0.8rem; color: var(--secondary-text, #94a3b8);" }, desc)
			);

			card.addEventListener("mouseenter", () => {
				card.style.borderColor = "var(--link-accent, #38bdf8)";
				card.style.backgroundColor = "rgba(56, 189, 248, 0.08)";
			});
			card.addEventListener("mouseleave", () => {
				card.style.borderColor = "var(--border-subtle, rgba(255, 255, 255, 0.1))";
				card.style.backgroundColor = "var(--ui-widget-background, rgba(255,255,255,0.06))";
			});

			card.addEventListener("click", () => {
				if (promptName && this._onNavigate) {
					this._onNavigate(promptName);
				} else if (promptName) {
					this._doc.openPrompt(promptName);
				} else if (url) {
					window.open(url, "_blank");
				}
			});

			return card;
		};

		this.container = div({ class: "prompt aboutPrompt", style: "width: 580px; max-width: 90vw;" },
			h2(es ? "Acerca de MegaBox" : "About MegaBox"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				// Card 1: Description
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "¿Qué es MegaBox?" : "What is MegaBox?"),
					p({ style: "margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--primary-text, #e2e8f0);" },
						es
							? "MegaBox es un tracker musical modular y modernizado basado en el código de BeepBox / JummBox. Expande la fórmula principal con síntesis avanzada, soporte nativo de samples, paneles desacoplables y un flujo optimizado para móviles."
							: "MegaBox is a modernized, modular music tracker based on the BeepBox / JummBox codebase. It expands the core tracker formula with advanced synthesis, native sample support, modular panel docking, and a dedicated mobile workflow."
					),
				),

				// Card 2: Key Improvements
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Mejoras clave" : "Key Improvements"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.6; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
						li(b(es ? "Motor de sonido expandido: " : "Expanded Sound Engine: "), es ? "Síntesis FM de 6 operadores con matrices configurables y feedback gráfico, loops y offsets de chip waves y unísono multivoz." : "6-operator FM synthesis with customizable algorithms and feedback graph, chip wave loops/offsets, and multi-voice unison."),
						li(b(es ? "Soporte nativo de samples: " : "Native Sample Support: "), es ? "Importación directa de audio (.wav, .mp3, .ogg, .flac) en almacenamiento local del navegador y empaquetado de proyectos ZIP (.mgb)." : "Direct audio file import (.wav, .mp3, .ogg, .flac) stored in browser storage and exportable as bundled ZIP song packages (.mgb)."),
						li(b(es ? "Espacio modular: " : "Modular Workspace: "), es ? "Paneles arrastrables, desacoplables y bloqueables. Organiza el piano roll, secuenciador y barras de ajustes a tu gusto." : "Draggable, dockable, and lockable panels. Arrange piano roll, sequencer, and sidebars freely."),
						li(b(es ? "Experiencia móvil horizontal: " : "Mobile Experience: "), es ? "Interfaz fluida con controles flotantes arrastrables, paneles deslizantes y scroll táctil en el secuenciador." : "Dedicated mobile mode with draggable floating controls, slide-out drawers, and smooth touch scrolling."),
						li(b(es ? "Modulación en tiempo real: " : "Real-Time Modulation: "), es ? "Grabación en vivo de automatización de sliders y canales de modulación extendidos." : "Live slider automation recording and extended modulator channels."),
					),
				),

				// Card 3: Interactive Sections
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Documentación y Enlaces" : "Documentation & Links"),
					p({ style: "margin: 0 0 8px 0; font-size: 0.85rem; color: var(--secondary-text, #94a3b8);" },
						es ? "Haz clic en cualquier tarjeta para abrir su panel interactivo:" : "Click any card to open its interactive dialog:"
					),
					div({ style: "display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" },
						createNavCard(es ? "Créditos" : "Credits", es ? "Cronología de mods y colaboradores" : "Mod lineage & contributors", "credits"),
						createNavCard(es ? "Preguntas Frecuentes" : "FAQ", es ? "Dudas comunes y tutoriales" : "Common questions & guides", "faq"),
						createNavCard(es ? "Notas de Versión" : "Patch Notes", es ? "Novedades y cambios de MegaBox v1.0" : "What's new in MegaBox v1.0", "patchNotes"),
						createNavCard(es ? "Archivo de Canciones" : "Song Archive", es ? "Comunidad y canciones de BeepBox" : "BeepBox community archive", undefined, "https://twitter-archive.beepbox.co/"),
					),
				),

				// Card 4: Made by OrangeBz & License
				div({ style: "padding: 10px 14px; margin-bottom: 4px; border-radius: 8px; background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;" },
					div({ style: "font-size: 0.9rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);" },
						"Megabox Made by OrangeBz"
					),
					div({ style: "font-size: 0.8rem; color: var(--secondary-text, #94a3b8);" },
						es ? "Software libre bajo Licencia MIT" : "Free software under MIT License"
					),
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
