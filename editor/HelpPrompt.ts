// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { isSpanish } from "./Localization";

const { button, div, h2, h3, p, ul, li, b } = HTML;

export class HelpPrompt implements Prompt {
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

	public readonly container: HTMLDivElement;

	constructor(private _doc: SongDocument) {
		const es = isSpanish();

		this.container = div({ class: "prompt helpPrompt", style: "width: 580px; max-width: 90vw;" },
			h2(es ? "Ayuda e Instrucciones" : "Help & Instructions"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				h3({ style: "margin: 0.8em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Resumen básico" : "Basic Overview"),
				p(es
					? "Haz clic en la cuadrícula de notas para añadir o quitar notas. Las casillas numeradas en la parte inferior son los patrones del secuenciador. Haz clic en ellas para desplazarte a otra parte de la canción, o usa las flechas para cambiar el número de patrón."
					: "Click rows in the note grid to add or remove notes. The numbered boxes at the bottom are patterns in the sequencer. Click them to move to different parts of the song, or click arrows to change pattern numbers."),
				p(es
					? "Todos los datos de la canción se guardan y comprimen directamente en la URL de tu navegador. Copia la URL para guardar y compartir tu creación."
					: "All song data is saved and compressed directly within the browser URL. Copy the URL to save and share your creation."),

				h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Espacio modular y movimiento de paneles" : "Modular Workspace & Panel Movement"),
				ul({ style: "padding-left: 20px; line-height: 1.6;" },
					li(b(es ? "Arrastrar y reorganizar paneles: " : "Drag & Rearrange Panels: "), es ? "Arrastra los paneles desde su encabezado o tirador para cambiar su orden en divisiones horizontales o verticales." : "Drag panels by their header or drag handle to reorder piano roll, sequencer, and settings sidebars horizontally or vertically."),
					li(b(es ? "Bloquear / Desbloquear diseño: " : "Lock / Unlock Layout: "), es ? "Haz clic en el icono de candado (🔒) de cualquier panel para fijarlo o desbloquearlo y moverlo." : "Click the lock icon (🔒) on any panel header to pin it in place or unlock it for repositioning."),
					li(b(es ? "Ajustes de acoplamiento: " : "Docking Settings: "), es ? "Acopla los ajustes de canción e instrumento a la izquierda, derecha o apilados en Editar > Preferencias de diseño." : "Dock Song and Instrument settings to the left, right, or stacked together in Edit > Layout Preferences."),
				),

				h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Movimiento táctil y versión móvil" : "Mobile & Touch Movement"),
				ul({ style: "padding-left: 20px; line-height: 1.6;" },
					li(b(es ? "Arrastre / Desplazamiento en secuenciador: " : "Sequencer Drag / Scroll: "), es ? "Arrastra horizontalmente sobre las pistas para hacer scroll fluido sin cambiar números de patrón por error." : "Drag horizontally across the track sequencer on touch devices to scroll smoothly without accidentally stepping pattern numbers."),
					li(b(es ? "Menú lateral (≡): " : "Hamburger Menu (≡): "), es ? "Toca el icono de sándwich arriba a la izquierda para abrir el menú con Archivo, Edición, Preferencias, Ayuda y Acerca de." : "Tap the top-left menu icon to open the full drawer containing File, Edit, Preferences, Help, and About."),
					li(b(es ? "Ajustes deslizantes: " : "Slide-out Settings: "), es ? "Toca " : "Tap ", b("Song S."), es ? " o " : " or ", b("Instrument S."), es ? " abajo a la derecha para abrir los paneles sin saturar la pantalla." : " at the bottom right to slide open drawer panels without cluttering your workspace."),
					li(b(es ? "Selección táctil en cuadrícula: " : "Pattern Touch Selection: "), es ? "Mantén presionado sobre la cuadrícula para seleccionar una región y arrastrar notas en bloque." : "Long-press on the note pattern grid to select a region, then drag horizontally to move multiple notes."),
				),

				h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Atajos de teclado" : "Keyboard Shortcuts"),
				ul({ style: "padding-left: 20px; line-height: 1.6;" },
					li(b("Spacebar"), es ? ": Reproducir / Pausar | " : ": Play / Pause | ", b("Shift + Spacebar"), es ? ": Reproducir desde cursor" : ": Play from cursor"),
					li(b("Z"), es ? ": Deshacer | " : ": Undo | ", b("Y / Shift + Z"), es ? ": Rehacer" : ": Redo"),
					li(b("C / V"), es ? ": Copiar / Pegar patrón o región" : ": Copy / Paste selected pattern or region"),
					li(b("0-9"), es ? ": Asignar número de patrón a selección" : ": Assign pattern number to selection"),
					li(b("Arrows"), es ? ": Mover selección | " : ": Move selection | ", b("Ctrl + Arrows"), es ? ": Reordenar canales" : ": Reorder channels"),
					li(b("[ / ]"), es ? ": Mover cabezal atrás / adelante" : ": Move playhead backward / forward"),
					li(b("+ / -"), es ? ": Transportar notas arriba / abajo" : ": Transpose notes up / down"),
					li(b("W"), es ? ": Desplazar notas lateralmente" : ": Shift notes sideways"),
					li(b("E"), es ? ": Generador de ritmos euclidianos" : ": Euclidean rhythm generator"),
					li(b("L"), es ? ": Duración de canción | " : ": Bar count | ", b("Shift + B"), es ? ": Pulsos por compás" : ": Beats per bar"),
					li(b("Q"), es ? ": Ajustes de canal | " : ": Channel settings | ", b("Shift + L"), es ? ": Ajustes de limitador" : ": Limiter settings"),
					li(b("Shift + Q"), es ? ": Añadir samples personalizados" : ": Add custom samples"),
				),

				h3({ style: "margin: 1.2em 0 0.4em 0; color: var(--link-accent, #98f);" }, es ? "Consejos de edición y modulación" : "Editing & Modulation Tips"),
				p("• ", b(es ? "Pitch Bend: " : "Pitch Bending: "), es ? "Arrastra verticalmente desde una nota existente." : "Drag vertically from an existing note to bend pitch."),
				p("• ", b(es ? "Volumen de nota: " : "Note Volume: "), es ? "Arrastra verticalmente arriba o abajo de una nota (mantén Ctrl para ajuste fino)." : "Drag vertically above or below a note (hold Ctrl for fine control)."),
				p("• ", b(es ? "Automatización en vivo: " : "Live Automation: "), es ? "Mantén presionado Ctrl o Shift durante la reproducción para grabar el movimiento de sliders en canales de modulación." : "Hold Ctrl or Shift while playing to record slider movements into modulator channels in real time."),
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
