"use client";

import React from "react";
import { Sparkles, Flame, Skull, Cpu, Cloud, Terminal } from "lucide-react";

interface HeaderProps {
  onOpenManifesto: () => void;
  onOpenSeance: () => void;
}

export function Header({ onOpenManifesto, onOpenSeance }: HeaderProps) {
  return (
    <header className="relative w-full overflow-hidden border-b border-cyan-900/50 bg-[#06141f]">
      {/* Papel Picado Decorative Festive Banners (Top Rim) */}
      <div className="h-2.5 w-full papel-picado opacity-90" />

      {/* Atmospheric Graveyard Sky with Full Moon & Bats */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Luminous Halloween Full Moon (Center-Right Glow) */}
        <div className="pointer-events-none absolute -top-12 right-12 h-36 w-36 rounded-full moon-glow opacity-30 blur-sm sm:h-48 sm:w-48 sm:opacity-40" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & Main Title Area */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Flame className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>Día de los Muertos • Hacktoberfest 2026 Final Challenge</span>
              <span className="hidden sm:inline text-amber-300/60">|</span>
              <span className="hidden sm:inline text-emerald-400">Week 4: Ghost in the Machine</span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl sm:text-5xl select-none">🪦</span>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  FLASH <span className="text-amber-400">AFTERLIFE</span>
                </h1>
                <p className="text-xs sm:text-sm font-medium tracking-wide text-emerald-400">
                  THE FLASH GAME PRESERVATION ALTAR & CODE NECROMANCY
                </p>
              </div>
            </div>

            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300">
              Adobe pulled the plug in 2020, entombing 20 years of indie web games.
              Using <span className="font-semibold text-amber-300">Gemma</span> open-weights and{" "}
              <span className="font-semibold text-cyan-300">Mastra</span> agent workflows, we extract
              ghost bytecode from vintage <code className="rounded bg-black/40 px-1 text-amber-300">.SWF</code> binaries and
              resurrect them on HTML5 Canvas in candlelight.
            </p>
          </div>

          {/* Quick Action Navigation Buttons & Tech Stack Hub */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSeance}
                className="flash-btn flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider"
              >
                <Terminal className="h-4 w-4" />
                <span>Code Séance</span>
              </button>

              <button
                onClick={onOpenManifesto}
                className="gold-flame-btn flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-slate-900 uppercase tracking-wider"
              >
                <Flame className="h-4 w-4 text-amber-900" />
                <span>Why Open Matters</span>
              </button>
            </div>

            {/* Partner Tech Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="inline-flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 border border-cyan-800/60 text-cyan-300">
                <Cpu className="h-3 w-3 text-cyan-400" /> Mastra Agents
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 border border-amber-800/60 text-amber-300">
                <Sparkles className="h-3 w-3 text-amber-400" /> Gemma-3-27B
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 border border-emerald-800/60 text-emerald-300">
                <Cloud className="h-3 w-3 text-emerald-400" /> Render Runtime
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

