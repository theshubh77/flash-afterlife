"use client";

import React from "react";
import { Sparkles, Flame, Terminal, Cpu, Cloud } from "lucide-react";
import { LottieAnimation } from "./LottieAnimation";

interface HeaderProps {
  onOpenManifesto: () => void;
  onOpenSeance: () => void;
}

export function Header({ onOpenManifesto, onOpenSeance }: HeaderProps) {
  return (
    <header className="relative w-full overflow-hidden border-b border-white/10 glass-panel">
      {/* Subtle Papel Picado Festive Rim */}
      <div className="h-1.5 w-full papel-picado opacity-80" />

      {/* Atmospheric Moon Glow */}
      <div className="pointer-events-none absolute -top-24 right-16 h-48 w-48 rounded-full moon-glow opacity-25 blur-xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3 py-1 text-xs font-medium text-amber-300">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Día de los Muertos • Hacktoberfest 2026</span>
              <span className="text-white/20">|</span>
              <span className="text-emerald-400 font-mono text-[11px]">Ghost in the Machine</span>
            </div>

            <div className="mt-3 flex items-center gap-3.5">
              <LottieAnimation type="ghost" className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl flex items-center gap-2">
                  <span>FLASH</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                    AFTERLIFE
                  </span>
                </h1>
                <p className="text-xs sm:text-sm font-medium tracking-wide text-emerald-400/90 font-mono">
                  THE FLASH GAME PRESERVATION ALTAR & CODE NECROMANCY
                </p>
              </div>
            </div>

            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300/80 leading-relaxed">
              Adobe pulled the plug in 2020. Powered by <span className="text-amber-300 font-medium">Gemma-4</span> open-weights and <span className="text-cyan-300 font-medium">Mastra</span> agents, we reanimate vintage <code className="glass-pill px-1.5 py-0.5 text-amber-300 rounded font-mono text-xs">.swf</code> binaries into pure HTML5 Canvas games in candlelight.
            </p>
          </div>

          {/* Action Hub & Tech Badges */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenSeance}
                className="glass-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-cyan-200 uppercase tracking-wider hover:text-white"
              >
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>Code Séance</span>
              </button>

              <button
                onClick={onOpenManifesto}
                className="gold-glow-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-slate-950 uppercase tracking-wider"
              >
                <Flame className="h-4 w-4 text-slate-950" />
                <span>Why Open Matters</span>
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full glass-pill px-2.5 py-0.5 text-cyan-300">
                <Cpu className="h-3 w-3 text-cyan-400" /> Mastra Agents
              </span>
              <span className="inline-flex items-center gap-1 rounded-full glass-pill px-2.5 py-0.5 text-amber-300">
                <Sparkles className="h-3 w-3 text-amber-400" /> Gemma-4
              </span>
              <span className="inline-flex items-center gap-1 rounded-full glass-pill px-2.5 py-0.5 text-emerald-300">
                <Cloud className="h-3 w-3 text-emerald-400" /> Render
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
