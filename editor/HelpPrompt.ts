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

		const cardStyle = "padding: 12px 14px; margin-bottom: 10px; border-radius: 8px; background: var(--ui-widget-background, rgba(255, 255, 255, 0.05)); border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1)); display: flex; flex-direction: column; gap: 6px;";
		const h3Style = "margin: 0 0 4px 0; font-size: 1rem; font-weight: 700; color: var(--accent-mod-cyan, #38bdf8);";

		this.container = div({ class: "prompt helpPrompt", style: "width: 580px; max-width: 90vw;" },
			h2(es ? "Ayuda e Instrucciones" : "Help & Instructions"),
			div({ style: "max-height: 480px; overflow-y: auto; padding-right: 8px; text-align: left;" },
				// Card 1: Overview
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Resumen básico" : "Basic Overview"),
					p({ style: "margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--primary-text, #e2e8f0);" },
						es
							? "Haz clic en la cuadrícula de notas para añadir o quitar notas. Las casillas numeradas en la parte inferior son los patrones del secuenciador. Haz clic en ellas para desplazarte a otra parte de la canción, o usa las flechas para cambiar el número de patrón."
							: "Click rows in the note grid to add or remove notes. The numbered boxes at the bottom are patterns in the sequencer. Click them to move to different parts of the song, or click arrows to change pattern numbers."
					),
					p({ style: "margin: 4px 0 0 0; font-size: 0.88rem; line-height: 1.5; color: var(--secondary-text, #94a3b8);" },
						es
							? "Todos los datos de la canción se guardan y comprimen directamente en la URL de tu navegador. Copia la URL para guardar y compartir tu creación."
							: "All song data is saved and compressed directly within the browser URL. Copy the URL to save and share your creation."
					),
				),

				// Card 2: Workspace & Panels
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Espacio modular y movimiento de paneles" : "Modular Workspace & Panel Movement"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.6; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
						li(b(es ? "Arrastrar y reorganizar paneles: " : "Drag & Rearrange Panels: "), es ? "Arrastra los paneles desde su botón de candado para cambiar su orden en divisiones horizontales o verticales." : "Drag panels by their lock button to reorder piano roll, sequencer, and settings sidebars horizontally or vertically."),
						li(b(es ? "Bloquear / Desbloquear diseño: " : "Lock / Unlock Layout: "), es ? "Haz clic en el icono de candado de cualquier panel para fijarlo o desbloquearlo y moverlo." : "Click the lock icon on any panel header to pin it in place or unlock it for repositioning."),
						li(b(es ? "Ajustes de acoplamiento: " : "Docking Settings: "), es ? "Acopla los ajustes de canción e instrumento a la izquierda, derecha o apilados en Editar > Preferencias de diseño." : "Dock Song and Instrument settings to the left, right, or stacked together in Edit > Layout Preferences."),
					),
				),

				// Card 3: Mobile & Touch
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Movimiento táctil y versión móvil" : "Mobile & Touch Movement"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.6; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
						li(b(es ? "Arrastre / Desplazamiento en secuenciador: " : "Sequencer Drag / Scroll: "), es ? "Arrastra horizontalmente sobre las pistas para hacer scroll fluido sin cambiar números de patrón por error." : "Drag horizontally across the track sequencer on touch devices to scroll smoothly without accidentally stepping pattern numbers."),
						li(b(es ? "Menú lateral: " : "Side Drawer Menu: "), es ? "Toca el icono de menú arriba a la izquierda para abrir el menú con Archivo, Edición, Preferencias, Ayuda y Acerca de." : "Tap the top-left menu icon to open the full drawer containing File, Edit, Preferences, Help, and About."),
						li(b(es ? "Controles flotantes: " : "Floating Controls: "), es ? "Mueve el panel flotante de controles a cualquier parte de la pantalla según tu comodidad." : "Drag the floating audio controls widget anywhere on the screen."),
						li(b(es ? "Ajustes deslizantes: " : "Slide-out Settings: "), es ? "Toca " : "Tap ", b("Song S."), es ? " o " : " or ", b("Instrument S."), es ? " abajo a la derecha para abrir los paneles sin saturar la pantalla." : " at the bottom right to slide open drawer panels without cluttering your workspace."),
					),
				),

				// Card 4: Keyboard Shortcuts
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Atajos de teclado" : "Keyboard Shortcuts"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.6; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
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
				),

				// Card 5: Tips
				div({ style: cardStyle },
					h3({ style: h3Style }, es ? "Consejos de edición y modulación" : "Editing & Modulation Tips"),
					ul({ style: "margin: 0; padding-left: 18px; line-height: 1.6; font-size: 0.88rem; color: var(--primary-text, #e2e8f0);" },
						li(b(es ? "Pitch Bend: " : "Pitch Bending: "), es ? "Arrastra verticalmente desde una nota existente." : "Drag vertically from an existing note to bend pitch."),
						li(b(es ? "Volumen de nota: " : "Note Volume: "), es ? "Arrastra verticalmente arriba o abajo de una nota (mantén Ctrl para ajuste fino)." : "Drag vertically above or below a note (hold Ctrl for fine control)."),
						li(b(es ? "Automatización en vivo: " : "Live Automation: "), es ? "Mantén presionado Ctrl o Shift durante la reproducción para grabar el movimiento de sliders en canales de modulación." : "Hold Ctrl or Shift while playing to record slider movements into modulator channels in real time."),
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
