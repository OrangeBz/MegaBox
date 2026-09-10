// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export type SupportedLanguage = "en" | "es";

export class Localization {
	private static _detectedLanguage: SupportedLanguage | null = null;

	public static getLanguage(): SupportedLanguage {
		if (this._detectedLanguage != null) {
			return this._detectedLanguage;
		}

		try {
			const navLang = (typeof navigator !== "undefined" && (navigator.language || (navigator as any).userLanguage)) || "en";
			if (navLang.toLowerCase().startsWith("es")) {
				this._detectedLanguage = "es";
			} else {
				this._detectedLanguage = "en";
			}
		} catch (e) {
			this._detectedLanguage = "en";
		}

		return this._detectedLanguage;
	}

	public static isSpanish(): boolean {
		return this.getLanguage() === "es";
	}

	public static setLanguage(lang: SupportedLanguage): void {
		this._detectedLanguage = lang;
	}
}

export const isSpanish = (): boolean => Localization.isSpanish();
