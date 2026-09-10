// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, h2, h3, p, ul, li, b } = HTML;

interface FaqItem {
	questionEs: string;
	questionEn: string;
	answerEs: HTMLElement | string;
	answerEn: HTMLElement | string;
}

export class FaqPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument) {
		const es = isSpanish();

		const faqList: FaqItem[] = [
			{
				questionEs: "¿Qué es MegaBox?",
				questionEn: "What is MegaBox?",
				answerEs: div(
					p("MegaBox es una estación de trabajo de audio (DAW tracker) moderna y modular para componer y compartir música instrumental y chiptune directamente en tu navegador."),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li("Síntesis FM de 6 operadores con feedback y algoritmos interactivos."),
						li("Soporte nativo de samples de audio (.wav, .mp3, .ogg, .flac) y base de datos local."),
						li("Espacio modular con paneles desacoplables, bloqueables y reorganizables."),
						li("Experiencia optimizada para móviles con controles flotantes y paneles deslizantes."),
					),
				),
				answerEn: div(
					p("MegaBox is a modernized, modular in-browser music workstation for sketching and composing instrumental and chiptune tracks."),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li("6-operator FM synthesis with custom algorithm matrices."),
						li("Native audio sampling (.wav, .mp3, .ogg, .flac) with local IndexedDB storage."),
						li("Modular docking workspace with lockable, draggable panels."),
						li("Dedicated mobile landscape mode with floating controls and slide-out drawers."),
					),
				),
			},
			{
				questionEs: "¿Cómo añado samples personalizados?",
				questionEn: "How do I add custom samples?",
				answerEs: div(
					p("Puedes añadir tus propios sonidos de dos formas muy sencillas:"),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Arrastrar y soltar: "), "Arrastra archivos de audio (.wav, .mp3, .ogg, .flac) directamente sobre la ventana del editor."),
						li(b("Menú Edición: "), "Ve a ", b("Editar > Añadir samples personalizados (Shift+Q)"), " para pegar URLs directas o cargar archivos."),
					),
				),
				answerEn: div(
					p("You can add your own sounds in two simple ways:"),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Drag & Drop: "), "Drag audio files (.wav, .mp3, .ogg, .flac) directly onto the editor workspace."),
						li(b("Edit Menu: "), "Go to ", b("Edit > Add Custom Samples (Shift+Q)"), " to paste direct URLs or load local files."),
					),
				),
			},
			{
				questionEs: "¿Tiene MegaBox modo sin conexión (Offline)?",
				questionEn: "Does MegaBox work offline?",
				answerEs: p("¡Sí! MegaBox funciona como una aplicación web progresiva (PWA). Una vez cargada por primera vez, puedes utilizarla sin conexión a internet. Todas las canciones y samples añadidos se guardan localmente en tu navegador."),
				answerEn: p("Yes! MegaBox works as a progressive web app. Once loaded, you can compose completely offline. All songs and loaded samples persist in your browser's local database."),
			},
			{
				questionEs: "¿Cómo guardo y comparto mis canciones?",
				questionEn: "How do I save and share songs?",
				answerEs: div(
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Por URL: "), "Copia la URL del navegador desde ", b("Archivo > Copiar URL de canción"), ". Todo el proyecto queda comprimido en el enlace."),
						li(b("Paquete .mgb / .zip: "), "Exporta tu proyecto completo con samples desde ", b("Archivo > Exportar canción (.mgb)"), " para guardarlo en tu equipo."),
					),
				),
				answerEn: div(
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Via URL: "), "Copy the URL from ", b("File > Copy Song URL"), ". All song data is compressed inside the link."),
						li(b(".mgb / .zip package: "), "Export a complete project bundle containing your song and audio samples via ", b("File > Export Song (.mgb)"), "."),
					),
				),
			},
			{
				questionEs: "¿Cómo uso la modulación y automatización en vivo?",
				questionEn: "How do I use live modulation & automation?",
				answerEs: p("Crea un canal de modulación, añade efectos a controlar y mantén presionada la tecla ", b("Ctrl"), " o ", b("Shift"), " mientras la canción se reproduce para grabar movimientos de deslizadores en tiempo real."),
				answerEn: p("Add a modulator channel, configure the target sliders, and hold ", b("Ctrl"), " or ", b("Shift"), " while playing to record live slider automation."),
			},
		];

		const cardElements: HTMLElement[] = faqList.map(item => {
			return div({
				style: "padding: 12px 14px; margin-bottom: 10px; border-radius: 8px; background: var(--ui-widget-background, rgba(255, 255, 255, 0.05)); border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1)); display: flex; flex-direction: column; gap: 6px;"
			},
				h3({ style: "margin: 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);" }, es ? item.questionEs : item.questionEn),
				div({ style: "font-size: 0.88rem; line-height: 1.5; color: var(--primary-text, #e2e8f0);" }, es ? item.answerEs : item.answerEn),
			);
		});

		this.container = div({ class: "prompt faqPrompt", style: "width: 580px; max-width: 90vw;" },
			h2(es ? "Preguntas Frecuentes (FAQ)" : "Frequently Asked Questions"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
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
