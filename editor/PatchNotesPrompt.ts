// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, h2, h3, p, ul, li, b } = HTML;

interface PatchCategory {
	titleEs: string;
	titleEn: string;
	itemsEs: string[];
	itemsEn: string[];
}

export class PatchNotesPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument) {
		const es = isSpanish();

		const categories: PatchCategory[] = [
			{
				titleEs: "Formato de Proyecto .mgb y Base de Datos de Samples",
				titleEn: ".mgb Project Bundle & Sample Database",
				itemsEs: [
					"Empaquetado completo de canciones y samples de audio en archivos .mgb / .zip.",
					"Base de datos local IndexedDB (SampleDatabase) integrada para persistencia de samples sin pérdida.",
					"Soporte de arrastrar y soltar (Drag & Drop) directo al editor para canciones (.json, .mgb) y audio (.wav, .mp3, .ogg, .flac).",
					"Compresión y descompresión ZIP nativa (ZipArchive) sin dependencias externas.",
				],
				itemsEn: [
					"Complete bundling of songs and custom audio samples into unified .mgb / .zip packages.",
					"Integrated local IndexedDB database (SampleDatabase) for persistent sample caching across sessions.",
					"Direct Drag & Drop support for project files (.json, .mgb) and raw audio files (.wav, .mp3, .ogg, .flac).",
					"Native client-side ZIP compressor/extractor (ZipArchive) with zero external dependencies.",
				],
			},
			{
				titleEs: "Rediseño DAW y Barra Superior",
				titleEn: "Modern DAW Layout & Top Navigation",
				itemsEs: [
					"Barra de menú superior estilo DAW con menús desplegables: Archivo, Edición, Preferencias, Ayuda y Acerca de.",
					"Alineación pixel-perfect de atajos de teclado y casillas de verificación (✓) en los menús desplegables.",
					"Caja de texto interactiva para el título de la canción en la barra superior.",
					"Medidor de volumen estéreo interactivo (dB meter) y osciloscopio en tiempo real.",
				],
				itemsEn: [
					"Top DAW-style navigation bar with dropdown menus: File, Edit, Preferences, Help, and About.",
					"Pixel-accurate right-aligned keyboard shortcuts and checkmarks (✓) in all dropdowns.",
					"Editable song title input integrated directly into the top bar.",
					"Real-time stereo dB level meter and oscilloscope integrated into playback controls.",
				],
			},
			{
				titleEs: "Espacio Modular y Paneles Acoplables",
				titleEn: "Modular Docking Workspace",
				itemsEs: [
					"Paneles desacoplables y arrastrables con candados de seguridad.",
					"Arrastre de paneles restringido al botón de candado con re-bloqueo automático al soltar.",
					"Acoplamiento flexible de Ajustes de Canción e Instrumento (izquierda, derecha o apilados).",
					"Divisores ajustables (splitters) interactivos para redimensionar paneles libremente.",
				],
				itemsEn: [
					"Modular draggable panels with security locks.",
					"Safe panel dragging restricted strictly to the lock handle with auto-locking on drop.",
					"Flexible docking for Song and Instrument settings (dock left, right, or stacked).",
					"Interactive splitters to freely resize workspace columns and rows.",
				],
			},
			{
				titleEs: "Optimización para Móviles y Modo Horizontal",
				titleEn: "Dedicated Mobile & Landscape Experience",
				itemsEs: [
					"Menú hamburguesa lateral con acceso rápido a todos los comandos y ajustes.",
					"Panel flotante de controles de audio compacto, libremente arrastrable a cualquier posición.",
					"Botones de acceso rápido Song S. e Instrument S. con paneles deslizantes que no saturan la pantalla.",
					"Desplazamiento horizontal fluido en el secuenciador táctil sin cambiar números de compás por error.",
				],
				itemsEn: [
					"Side hamburger drawer with full access to menus and configuration.",
					"Compact floating audio controls widget, freely draggable anywhere on the screen.",
					"Quick-access Song S. and Instrument S. buttons with sleek slide-out drawers.",
					"Smooth touch scrolling on the sequencer track grid without accidental pattern stepping.",
				],
			},
			{
				titleEs: "Motor de Sonido y Modulación Expandidos",
				titleEn: "Expanded Audio Engine & Modulation",
				itemsEs: [
					"Síntesis FM de 6 operadores con matrices de algoritmos configurables y feedback gráfico.",
					"Formas de onda chip extendidas con control de loops, offsets y reproducción inversa.",
					"Grabación en vivo de automatización de sliders manteniendo Ctrl o Shift durante la reproducción.",
					"Previsualización de sonido de notas al añadirlas y editarlas en la cuadrícula.",
				],
				itemsEn: [
					"6-operator FM synthesis with custom algorithm routing and visual feedback graphs.",
					"Extended chip waves with visual loop points, start offsets, and reverse playback.",
					"Real-time live slider automation recording by holding Ctrl or Shift during playback.",
					"Instant audio note preview when placing and modifying notes on the grid.",
				],
			},
		];

		const cardElements: HTMLElement[] = categories.map(cat => {
			const items = es ? cat.itemsEs : cat.itemsEn;
			return div({
				style: "padding: 12px 14px; margin-bottom: 10px; border-radius: 8px; background: var(--ui-widget-background, rgba(255, 255, 255, 0.05)); border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1)); display: flex; flex-direction: column; gap: 4px;"
			},
				h3({ style: "margin: 0 0 4px 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);" }, es ? cat.titleEs : cat.titleEn),
				ul({ style: "margin: 0; padding-left: 18px; line-height: 1.5; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
					...items.map(item => li(item)),
				),
			);
		});

		this.container = div({ class: "prompt patchNotesPrompt", style: "width: 600px; max-width: 90vw;" },
			h2(es ? "Notas de Versión — MegaBox v1.0" : "Patch Notes — MegaBox v1.0"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				p({ style: "margin: 0 0 10px 0; font-size: 0.85rem; color: var(--secondary-text, #94a3b8);" },
					b(es ? "Lanzamiento oficial v1.0 • " : "Official Release v1.0 • "),
					"MegaBox by OrangeBz"
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
