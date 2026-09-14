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
					p("MegaBox es una herramienta web para componer y compartir música instrumental de forma gratuita en tu navegador."),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li("Síntesis FM de 6 operadores y ondas personalizadas."),
						li("Soporte para cargar tus propios archivos de audio (.wav, .mp3, .ogg, .flac)."),
						li("Paneles que puedes mover, reorganizar y fijar a tu gusto."),
						li("Diseño adaptado para su uso en teléfonos y tabletas."),
					),
				),
				answerEn: div(
					p("MegaBox is a web tool to compose and share instrumental music for free in your browser."),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li("6-operator FM synthesis and custom wave types."),
						li("Support for loading your own audio files (.wav, .mp3, .ogg, .flac)."),
						li("Panels you can move, rearrange, and lock as you prefer."),
						li("Layout adapted for use on phones and tablets."),
					),
				),
			},
			{
				questionEs: "¿Cómo añado mis propios audios o samples?",
				questionEn: "How do I add custom audio or samples?",
				answerEs: div(
					p("Puedes añadir audios de dos formas muy sencillas:"),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Arrastrar y soltar: "), "Arrastra archivos de audio (.wav, .mp3, .ogg, .flac) directamente sobre la pantalla."),
						li(b("Menú Edición: "), "Ve a ", b("Editar > Añadir samples personalizados (Shift+Q)"), " para usar enlaces o archivos locales."),
					),
				),
				answerEn: div(
					p("You can add audio in two simple ways:"),
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Drag & Drop: "), "Drag audio files (.wav, .mp3, .ogg, .flac) directly onto the screen."),
						li(b("Edit Menu: "), "Go to ", b("Edit > Add Custom Samples (Shift+Q)"), " to use links or local files."),
					),
				),
			},
			{
				questionEs: "¿Funciona sin conexión a internet?",
				questionEn: "Does it work offline?",
				answerEs: p("Sí. Una vez cargada la página, puedes seguir usándola sin internet. Tus canciones y archivos guardados se quedan almacenados en tu navegador."),
				answerEn: p("Yes. Once loaded, you can keep using it without internet. Your saved songs and audio files remain stored in your browser."),
			},
			{
				questionEs: "¿Cómo guardo y comparto mis canciones?",
				questionEn: "How do I save and share songs?",
				answerEs: div(
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Por enlace (URL): "), "Copia la URL desde ", b("Archivo > Copiar URL de canción"), ". Toda la canción se guarda en el enlace."),
						li(b("Como archivo (.mgb): "), "Exporta tu proyecto desde ", b("Archivo > Exportar canción (.mgb)"), " para guardarlo en tu equipo."),
					),
				),
				answerEn: div(
					ul({ style: "margin: 4px 0 0 16px; line-height: 1.5;" },
						li(b("Via URL link: "), "Copy the URL from ", b("File > Copy Song URL"), ". The entire song is stored inside the link."),
						li(b("As a file (.mgb): "), "Export your project via ", b("File > Export Song (.mgb)"), " to save it on your computer."),
					),
				),
			},
			{
				questionEs: "¿Cómo uso la modulación y automatización?",
				questionEn: "How do I use modulation & automation?",
				answerEs: p("Añade un canal de modulación y mantén presionada la tecla ", b("Ctrl"), " o ", b("Shift"), " mientras suena la canción para mover y grabar los controles en directo."),
				answerEn: p("Add a modulator channel and hold ", b("Ctrl"), " or ", b("Shift"), " while playing to move and record controls live."),
			},
		];

		const itemElements: HTMLElement[] = faqList.map(item => {
			return div({
				style: "margin-bottom: 16px; text-align: left;"
			},
				h3({ style: "margin: 0 0 4px 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);" }, es ? item.questionEs : item.questionEn),
				div({ style: "font-size: 0.88rem; line-height: 1.5; color: var(--primary-text, #e2e8f0);" }, es ? item.answerEs : item.answerEn),
			);
		});

		this.container = div({ class: "prompt faqPrompt", style: "width: 540px; max-width: 90vw;" },
			h2(es ? "Preguntas Frecuentes (FAQ)" : "Frequently Asked Questions"),
			div({ style: "max-height: 460px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				...itemElements,
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
