"use client";

import React, { useState } from "react";
import { Sparkles, Volume2, Heart, Globe, Cpu } from "lucide-react";
import confetti from "canvas-confetti";
import { playCalaveritaBell } from "@/lib/audio/retroSynth";
import { LottieAnimation } from "./LottieAnimation";

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
  const [activeLang, setActiveLang] = useState<"en" | "es">("en");

  const triggerMarigoldPetals = () => {
    playCalaveritaBell();

    // Fire marigold / cempasúchil orange & gold petals confetti
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#ea580c", "#fde047", "#f97316", "#ffffff"],
      shapes: ["circle"],
      scalar: 1.15,
    });
  };

  return (
    <div className="relative flex flex-col rounded-3xl glass-panel-gold p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-2xl">
      {/* Subtle Golden Aura Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-orange-600/15 blur-3xl" />

      {/* Ofrenda Header with Lottie Candle */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2.5">
          <LottieAnimation type="skull" className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-300">
              The Digital Ofrenda
            </h3>
            <p className="text-[11px] text-amber-200/70">
              Preserving early web heritage for Día de los Muertos
            </p>
          </div>
        </div>

        {/* Lottie Flickering Candle Flame in Glass Capsule */}
        <div className="flex items-center gap-1.5 rounded-full glass-pill px-3 py-1 border-amber-500/30">
          <LottieAnimation type="candle" className="w-6 h-10" />
          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
            Candlelit
          </span>
        </div>
      </div>

      {/* Memorial Tablet */}
      <div className="mt-4 rounded-2xl glass-card p-4.5 bg-amber-500/[0.04]">
        <div className="flex items-center justify-between">
          <span className="rounded-full glass-pill px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border-amber-500/30">
            CHRONICLE: {year}
          </span>
          {author && (
            <span className="text-xs text-amber-200/80 font-medium font-mono">
              Architect: {author}
            </span>
          )}
        </div>

        <h4 className="mt-2 text-xl font-black text-white">{title}</h4>

        {epitaph && (
          <p className="mt-1.5 text-xs italic text-amber-200/80 border-l-2 border-amber-400/80 pl-2.5 leading-relaxed">
            &ldquo;{epitaph}&rdquo;
          </p>
        )}

        {/* Historical Lore Context */}
        {loreSummary && (
          <div className="mt-3 rounded-xl bg-black/30 p-3 border border-white/5 text-[11px] text-slate-300/90">
            <div className="flex items-center justify-between text-[10px] text-amber-400/80 mb-1 font-mono">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-cyan-400" /> Historical Origin
              </span>
              <span>{loreSource || "Web Archive"}</span>
            </div>
            <p className="leading-relaxed line-clamp-3">{loreSummary}</p>
          </div>
        )}
      </div>

      {/* Calaverita Literaria (Bilingual Rhyming Tribute) with Clean Language Switcher */}
      <div className="mt-4 rounded-2xl glass-card p-4.5 bg-amber-500/[0.05] text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-300 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Calaverita Literaria
          </span>

          {/* Minimal Language Switch Tabs */}
          <div className="flex items-center rounded-lg glass-pill p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setActiveLang("en")}
              className={`rounded px-2 py-0.5 font-bold transition-all ${
                activeLang === "en"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang("es")}
              className={`rounded px-2 py-0.5 font-bold transition-all ${
                activeLang === "es"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Poetry View */}
        <div className="min-h-[90px] flex items-center">
          {activeLang === "en" ? (
            <pre className="font-serif text-sm italic text-amber-100 whitespace-pre-line leading-relaxed selection:bg-amber-400 selection:text-black">
              {calaverita.english}
            </pre>
          ) : (
            <pre className="font-serif text-sm italic text-amber-200/95 whitespace-pre-line leading-relaxed selection:bg-amber-400 selection:text-black">
              {calaverita.spanish}
            </pre>
          )}
        </div>
      </div>

      {/* Model & Orchestration Badge */}
      {modelUsed && (
        <div className="mt-3 flex items-center justify-between rounded-xl glass-pill px-3 py-1.5 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Cpu className="h-3 w-3 text-amber-400" /> {modelUsed}
          </span>
          <span className="text-emerald-400 font-bold">Zero-Crash Active</span>
        </div>
      )}

      {/* Ofrenda Offering Button */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={triggerMarigoldPetals}
          className="gold-glow-btn w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black uppercase tracking-wider text-slate-950"
        >
          <Heart className="h-4 w-4 fill-slate-950 text-slate-950" />
          <span>Offer Marigold Flowers (Cempasúchil)</span>
        </button>

        <button
          onClick={triggerMarigoldPetals}
          className="glass-btn flex items-center justify-center rounded-2xl px-3 py-3 text-amber-300 hover:text-white"
          title="Toll Bell"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
