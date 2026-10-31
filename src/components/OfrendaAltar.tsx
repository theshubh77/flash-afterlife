"use client";

import React from "react";
import { Flame, Sparkles, Volume2, Skull, Heart, Globe, Cpu } from "lucide-react";
import confetti from "canvas-confetti";
import { playCalaveritaBell } from "@/lib/audio/retroSynth";

interface OfrendaAltarProps {
  title: string;
  year: number;
  author?: string;
  calaverita: {
    english: string;
    spanish: string;
  };
  epitaph?: string;
  loreSummary?: string;
  loreSource?: string;
  modelUsed?: string;
}

export function OfrendaAltar({
  title,
  year,
  author,
  calaverita,
  epitaph,
  loreSummary,
  loreSource,
  modelUsed,
}: OfrendaAltarProps) {
  const triggerMarigoldPetals = () => {
    playCalaveritaBell();

    // Fire marigold / cempasúchil orange & gold petals confetti
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#ea580c", "#fde047", "#f97316", "#ffffff"],
      shapes: ["circle"],
      scalar: 1.1,
    });
  };

  return (
    <div className="relative flex flex-col rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-[#181104] via-[#100a02] to-[#080501] p-5 shadow-2xl overflow-hidden">
      {/* Golden Aura Glow */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-orange-600/20 blur-3xl" />

      {/* Papel Picado Decorative Ribbon */}
      <div className="h-2 w-full papel-picado mb-4 opacity-90 rounded-sm" />

      {/* Ofrenda Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl select-none">🕯️</span>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-300">
              The Digital Ofrenda
            </h3>
            <p className="text-[11px] text-amber-400/80">
              Honoring the departed Flash legacy in the spirit of Día de los Muertos
            </p>
          </div>
        </div>

        {/* Flickering Animated Candle */}
        <div className="flex items-center gap-1.5 rounded-full bg-black/60 border border-amber-500/40 px-3 py-1">
          <div className="relative h-6 w-3 flex items-end justify-center">
            {/* Candle Body */}
            <div className="h-3 w-2.5 rounded-t-sm bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-400/50" />
            {/* Candle Flame with Flicker Animation */}
            <div className="candle-flame absolute -top-3.5 h-4 w-2 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white" />
          </div>
          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">
            Candlelit
          </span>
        </div>
      </div>

      {/* Main Altar Memorial Tablet */}
      <div className="mt-4 rounded-xl border border-amber-500/30 bg-[#221703]/60 p-4">
        <div className="flex items-center justify-between">
          <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-800">
            CHRONICLE: {year}
          </span>
          {author && (
            <span className="text-xs text-amber-400/90 font-medium">
              Architect: {author}
            </span>
          )}
        </div>

        <h4 className="mt-2 text-xl font-black text-white">{title}</h4>

        {epitaph && (
          <p className="mt-1 text-xs italic text-amber-200/80 border-l-2 border-amber-500 pl-2">
            &ldquo;{epitaph}&rdquo;
          </p>
        )}

        {/* Historical Context from SerpAPI / Web Search */}
        {loreSummary && (
          <div className="mt-3 rounded-lg bg-black/50 p-2.5 border border-amber-950/70 text-[11px] text-slate-300">
            <div className="flex items-center justify-between text-[10px] text-amber-400/80 mb-1 font-mono">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-cyan-400" /> Historical Origin
              </span>
              <span>{loreSource || "SerpAPI Research"}</span>
            </div>
            <p className="line-clamp-3 leading-relaxed text-slate-300">{loreSummary}</p>
          </div>
        )}
      </div>

      {/* Calaverita Literaria (Bilingual Rhyming Tribute) */}
      <div className="mt-4 rounded-xl border border-amber-600/40 bg-gradient-to-br from-[#2a1b05] to-[#1a1103] p-4 text-xs">
        <div className="flex items-center justify-between border-b border-amber-700/40 pb-2 mb-3">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Calaverita Literaria
          </span>
          <button
            onClick={triggerMarigoldPetals}
            className="flex items-center gap-1 rounded bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 px-2 py-1 text-[11px] font-bold text-amber-200 transition-colors"
            title="Toll the ofrenda bronze bell & shower marigold petals"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Toll Bell & Petals</span>
          </button>
        </div>

        {/* English Calaverita */}
        <div className="mb-3">
          <span className="text-[10px] font-mono text-amber-400/70 uppercase">English Ode:</span>
          <pre className="mt-1 font-serif text-sm italic text-amber-100 whitespace-pre-line leading-relaxed">
            {calaverita.english}
          </pre>
        </div>

        {/* Spanish Calaverita */}
        <div className="border-t border-amber-800/40 pt-2.5">
          <span className="text-[10px] font-mono text-amber-400/70 uppercase">Calaverita en Español:</span>
          <pre className="mt-1 font-serif text-xs italic text-amber-200/90 whitespace-pre-line leading-relaxed">
            {calaverita.spanish}
          </pre>
        </div>
      </div>

      {/* Model & Orchestration Badge */}
      {modelUsed && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-black/40 px-3 py-1.5 text-[10px] font-mono border border-amber-900/40 text-slate-400">
          <span className="flex items-center gap-1 text-amber-300">
            <Cpu className="h-3 w-3 text-amber-400" /> {modelUsed}
          </span>
          <span className="text-emerald-400">Zero-Crash Active</span>
        </div>
      )}

      {/* Ofrenda Offering Button */}
      <div className="mt-4">
        <button
          onClick={triggerMarigoldPetals}
          className="gold-flame-btn w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 transition-all"
        >
          <Heart className="h-4 w-4 fill-amber-900 text-amber-900" />
          <span>Offer Marigold Flowers (Cempasúchil)</span>
        </button>
      </div>
    </div>
  );
}
