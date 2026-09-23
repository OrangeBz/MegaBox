// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { SongDocument } from "./SongDocument";
import { HTML } from "imperative-html/dist/esm/elements-strict";

interface StardustParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    maxAlpha: number;
    hue: number;
    life: number;
    maxLife: number;
}

export class AtmosphereOverlay {
    public readonly canvas: HTMLCanvasElement = HTML.canvas({
        style: "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;",
    });
    private readonly _ctx: CanvasRenderingContext2D = this.canvas.getContext("2d", { alpha: true })!;
    private _width: number = 0;
    private _height: number = 0;
    private _dpr: number = 1;

    private readonly _particles: StardustParticle[] = [];
    private readonly _maxParticles: number = 70;

    private _currentJuice: number = 0.0;
    private _targetJuice: number = 0.0;
    private _pulseEnergy: number = 0.0;
    private _lastBar: number = -1;
    private _animFrameId: number | null = null;
    private _time: number = 0;

    constructor(private readonly _doc: SongDocument) {
        this.resize();
        window.addEventListener("resize", this._onResize);

        this._startLoop();
    }

    private readonly _onResize = (): void => {
        this.resize();
    };

    public resize(): void {
        this._dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : document.body.getBoundingClientRect();
        this._width = Math.max(100, Math.floor(rect.width));
        this._height = Math.max(100, Math.floor(rect.height));

        this.canvas.width = Math.floor(this._width * this._dpr);
        this.canvas.height = Math.floor(this._height * this._dpr);
        this._ctx.scale(this._dpr, this._dpr);
    }

    private _startLoop(): void {
        const loop = (timestamp: number): void => {
            this._time = timestamp * 0.001;
            this._update();
            this._render();
            this._animFrameId = requestAnimationFrame(loop);
        };
        this._animFrameId = requestAnimationFrame(loop);
    }

    public destroy(): void {
        if (this._animFrameId !== null) {
            cancelAnimationFrame(this._animFrameId);
            this._animFrameId = null;
        }
        window.removeEventListener("resize", this._onResize);
    }

    private _computeJuice(): void {
        if (!this._doc.prefs.dynamicAtmosphere || !this._doc.song) {
            this._targetJuice = 0;
            return;
        }

        const song = this._doc.song;
        let totalNotes = 0;
        let activeChannels = 0;

        for (let channelIndex = 0; channelIndex < song.channels.length; channelIndex++) {
            const channel = song.channels[channelIndex];
            let channelHasNotes = false;

            for (let patternIndex = 0; patternIndex < channel.patterns.length; patternIndex++) {
                const pattern = channel.patterns[patternIndex];
                if (pattern && pattern.notes.length > 0) {
                    totalNotes += pattern.notes.length;
                    channelHasNotes = true;
                }
            }

            if (channelHasNotes) activeChannels++;
        }

        const totalChannels = Math.max(1, song.channels.length);
        const channelRatio = activeChannels / totalChannels;
        const noteRatio = Math.min(1.0, totalNotes / 90);

        // Real-time playback intensity
        let liveIntensity = 0.0;
        if (this._doc.synth.playing) {
            liveIntensity = 0.35;
            // Beat drop pulse
            if (this._doc.bar !== this._lastBar) {
                this._lastBar = this._doc.bar;
                this._pulseEnergy = 1.0;
            }
        }

        // Composite Balatro Juice Metric
        const rawJuice = noteRatio * 0.45 + channelRatio * 0.35 + liveIntensity * 0.20;
        this._targetJuice = Math.max(0.0, Math.min(1.0, rawJuice));
    }

    private _update(): void {
        this._computeJuice();

        // Smooth juice lerp
        this._currentJuice += (this._targetJuice - this._currentJuice) * 0.04;
        this._pulseEnergy *= 0.92;

        if (this._currentJuice < 0.01 && this._particles.length === 0) return;

        // Spawn particles proportional to juice
        const spawnChance = this._currentJuice * 0.35 + this._pulseEnergy * 0.25;
        if (this._particles.length < this._maxParticles * Math.max(0.2, this._currentJuice) && Math.random() < spawnChance) {
            const hues = [185, 275, 45, 195]; // Cyan, Purple/Magenta, Gold, Deep Cyan
            const selectedHue = hues[Math.floor(Math.random() * hues.length)];

            this._particles.push({
                x: Math.random() * this._width,
                y: this._height + 10 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -(0.4 + Math.random() * 0.8) * (1.0 + this._currentJuice * 0.8),
                size: 1.2 + Math.random() * 2.6,
                alpha: 0.0,
                maxAlpha: 0.15 + Math.random() * 0.35 * Math.min(1.0, this._currentJuice + 0.3),
                hue: selectedHue,
                life: 0,
                maxLife: 160 + Math.random() * 180,
            });
        }

        // Update particles
        for (let i = this._particles.length - 1; i >= 0; i--) {
            const p = this._particles[i];
            p.life++;
            p.x += p.vx + Math.sin(this._time + i) * 0.2;
            p.y += p.vy;

            // Fade in and out
            const progress = p.life / p.maxLife;
            if (progress < 0.2) {
                p.alpha = (progress / 0.2) * p.maxAlpha;
            } else if (progress > 0.7) {
                p.alpha = ((1.0 - progress) / 0.3) * p.maxAlpha;
            } else {
                p.alpha = p.maxAlpha;
            }

            if (p.life >= p.maxLife || p.y < -20) {
                this._particles.splice(i, 1);
            }
        }
    }

    private _render(): void {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, this._width, this._height);

        const juice = this._currentJuice;
        if (juice < 0.01 && this._particles.length === 0) return;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Level 2+: Ambient Background Aurora Glow (Juice >= 0.20)
        if (juice >= 0.20) {
            const auroraAlpha = (juice - 0.20) * 0.14 * (1.0 + this._pulseEnergy * 0.5);

            // Bottom-left cyan resonance
            const g1 = ctx.createRadialGradient(0, this._height, 10, 0, this._height, this._width * 0.65);
            g1.addColorStop(0, `rgba(0, 229, 255, ${auroraAlpha * 0.8})`);
            g1.addColorStop(0.6, `rgba(0, 150, 200, ${auroraAlpha * 0.3})`);
            g1.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, this._width, this._height);

            // Top-right magenta/purple resonance
            const g2 = ctx.createRadialGradient(this._width, 0, 10, this._width, 0, this._width * 0.55);
            g2.addColorStop(0, `rgba(192, 132, 252, ${auroraAlpha * 0.6})`);
            g2.addColorStop(0.7, `rgba(120, 50, 180, ${auroraAlpha * 0.2})`);
            g2.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, this._width, this._height);
        }

        // Level 3+: Constellation Connections (Juice >= 0.60)
        if (juice >= 0.60 && this._particles.length > 3) {
            const constelAlpha = (juice - 0.60) * 0.25;
            ctx.lineWidth = 0.75;
            const maxDist = 90;

            for (let i = 0; i < this._particles.length; i++) {
                for (let j = i + 1; j < this._particles.length; j++) {
                    const p1 = this._particles[i];
                    const p2 = this._particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDist * maxDist) {
                        const lineDist = Math.sqrt(distSq);
                        const lineAlpha = (1.0 - lineDist / maxDist) * constelAlpha * Math.min(p1.alpha, p2.alpha);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Level 1+: Floating Stardust Particles (Juice >= 0.05)
        for (const p of this._particles) {
            if (p.alpha <= 0.001) continue;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            let r = 0, g = 229, b = 255;
            if (p.hue === 275) { r = 192; g = 132; b = 252; }
            else if (p.hue === 45) { r = 250; g = 204; b = 21; }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.8})`;
            ctx.shadowBlur = p.size * 2.5;
            ctx.fill();
        }

        ctx.restore();
    }
}
