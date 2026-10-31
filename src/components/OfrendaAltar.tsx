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
      particleCount: 85,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#ff7e00", "#ffd000", "#f97316", "#ffffff", "#c084fc"],
      shapes: ["circle"],
      scalar: 1.2,
    });
  };

  return (
    <div className="relative flex flex-col rounded-3xl glass-panel-gold p-6 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-2xl border-2 border-amber-400/35">
      {/* Subtle Golden/Purple Aura Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-orange-600/20 blur-3xl" />

      {/* Ofrenda Header with User's Lottie Candle Flame */}
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-3">
          <LottieAnimation type="skull" className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-300">
              The Digital Ofrenda
            </h3>
            <p className="text-[11px] text-amber-200/70 font-mono">
              Honoring early web heritage with candlelit code & remembrance
            </p>
          </div>
        </div>

        {/* Lottie Flickering Candle Flame in Glass Capsule (User-uploaded candle.lottie) */}
        <div className="flex items-center gap-2 rounded-full bg-orange-500/20 px-3.5 py-1 border border-orange-400/40 shadow-[0_0_15px_rgba(255,122,0,0.3)]">
          <LottieAnimation type="candle" className="w-6 h-10 shrink-0" />
          <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-extrabold">
            Candlelit
          </span>
        </div>
      </div>

      {/* Memorial Tablet */}
      <div className="mt-4 rounded-2xl bg-[#200c3b]/80 border border-purple-500/25 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-orange-500/20 px-3 py-0.5 text-[10px] font-mono font-extrabold text-amber-300 border border-orange-500/30">
            CHRONICLE: {year}
          </span>
          {author && (
            <span className="text-xs text-amber-200/80 font-bold font-mono">
              Architect: {author}
            </span>
          )}
        </div>

        <h4 className="mt-2.5 text-xl font-black text-white">{title}</h4>

        {epitaph && (
          <p className="mt-2 text-xs italic text-amber-100/90 border-l-3 border-orange-400 pl-3 leading-relaxed">
            &ldquo;{epitaph}&rdquo;
          </p>
        )}

        {/* Historical Lore Context */}
        {loreSummary && (
          <div className="mt-3.5 rounded-xl bg-black/40 p-3.5 border border-purple-500/20 text-[11px] text-purple-100/90 leading-relaxed">
            <div className="flex items-center justify-between text-[10px] text-amber-400/90 mb-1.5 font-mono">
              <span className="flex items-center gap-1 font-bold">
                <Globe className="h-3 w-3 text-cyan-400" /> Historical Origin
              </span>
              <span>{loreSource || "Web Archive"}</span>
            </div>
            <p className="leading-relaxed line-clamp-3">{loreSummary}</p>
          </div>
        )}
      </div>

      {/* Calaverita Literaria (Bilingual Rhyming Tribute) */}
      <div className="mt-4 rounded-2xl bg-[#200c3b]/80 border border-purple-500/25 p-5 text-xs shadow-lg">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-3">
          <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-amber-300 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Calaverita Literaria
          </span>

          {/* Minimal Language Switch Tabs */}
          <div className="flex items-center rounded-xl bg-black/40 border border-purple-500/30 p-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveLang("en")}
              className={`rounded-lg px-2.5 py-0.5 font-extrabold transition-all ${
                activeLang === "en"
                  ? "candy-orange-btn text-white shadow-sm"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang("es")}
              className={`rounded-lg px-2.5 py-0.5 font-extrabold transition-all ${
                activeLang === "es"
                  ? "candy-orange-btn text-white shadow-sm"
                  : "text-purple-300 hover:text-white"
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
            <pre className="font-serif text-sm italic text-amber-200 whitespace-pre-line leading-relaxed selection:bg-amber-400 selection:text-black">
              {calaverita.spanish}
            </pre>
          )}
        </div>
      </div>

      {/* Engine Status Badge */}
      <div className="mt-3.5 flex items-center justify-between rounded-xl glass-pill px-3.5 py-1.5 text-[10px] font-mono text-purple-200 border border-purple-400/20">
        <span className="flex items-center gap-1.5 text-amber-300 font-bold">
          <Cpu className="h-3 w-3 text-amber-400" /> Neural Code Resurrection
        </span>
        <span className="text-emerald-400 font-bold">Zero-Crash Guaranteed</span>
      </div>

      {/* Ofrenda Offering Button */}
      <div className="mt-4 flex gap-2.5">
        <button
          onClick={triggerMarigoldPetals}
          className="candy-orange-btn w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span>Offer Marigold Flowers (Cempasúchil)</span>
        </button>

        <button
          onClick={triggerMarigoldPetals}
          className="candy-wrapper-pill flex items-center justify-center rounded-2xl px-4 py-3.5 text-amber-300 hover:text-white"
          title="Toll Bell"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
