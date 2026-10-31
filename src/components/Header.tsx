"use client";

import React from "react";
import { Flame, Terminal, Sparkles, Shield, Cpu } from "lucide-react";
import { LottieAnimation } from "./LottieAnimation";

interface HeaderProps {
  onOpenManifesto: () => void;
  onOpenSeance: () => void;
}

export function Header({ onOpenManifesto, onOpenSeance }: HeaderProps) {
  return (
    <header className="relative w-full overflow-hidden border-b border-purple-500/20 glass-panel spooky-stars">
      {/* Subtle Papel Picado Festive Rim */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 via-purple-500 to-orange-500 opacity-90 shadow-[0_0_12px_rgba(255,122,0,0.5)]" />

      {/* Atmospheric Moon Glow & Hanging Lantern */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Big Halloween Title & Description */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl">
            
            {/* Playful Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/30 shadow-md">
              <span className="text-sm">🍬</span>
              <span>DÍA DE LOS MUERTOS ARCHIVE</span>
              <span className="text-white/20">|</span>
              <span className="text-emerald-300 font-bold text-[11px]">THE RETRO WEB LIVING OFRENDA</span>
            </div>

            {/* Giant Playful "TRICK OR TREAT" Title Structure */}
            <h1 className="mt-4 flex flex-col items-center lg:items-start select-none">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none flex items-center gap-3">
                <span className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">TRICK</span>
                <span className="text-2xl sm:text-3xl text-orange-400 font-bold flex items-center gap-1.5 bg-orange-500/20 px-3 py-1 rounded-2xl border border-orange-500/40">
                  <span>🎃</span>
                  <span className="tracking-wider text-amber-300">OR</span>
                </span>
              </div>
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-[0_0_30px_rgba(255,106,0,0.4)] mt-1">
                TREAT!
              </div>
            </h1>

            {/* Sub-headline */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-orange-400 uppercase">
                FLASH AFTERLIFE • RESURRECTING 2000s WEB LEGENDS
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-purple-100/85 leading-relaxed max-w-xl">
              In 2020, Adobe pulled the plug on Flash Player, burying millions of legendary web games. We decompile vintage <code className="glass-pill px-1.5 py-0.5 text-orange-300 rounded font-mono text-xs font-bold">.swf</code> binaries and awaken their souls into living 60 FPS HTML5 Canvas games right inside your browser.
            </p>

            {/* Candy Ribbon Action Tabs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenSeance}
                className="candy-wrapper-pill px-5 py-2.5 text-xs font-extrabold text-white uppercase tracking-wider group"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
                  <span>Code Séance</span>
                </div>
              </button>

              <button
                onClick={onOpenManifesto}
                className="candy-orange-btn px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-2 shadow-lg"
              >
                <Flame className="h-4 w-4 fill-white" />
                <span>The Open Web Manifesto</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Mascot popping out of Pumpkin + Glowing Lantern */}
          <div className="relative flex items-center justify-center">
            {/* Hanging Lantern (User's Lottie) */}
            <div className="absolute -top-6 -right-4 sm:-right-8 z-30 flex flex-col items-center">
              <div className="w-0.5 h-10 bg-amber-400/60 shadow-[0_0_8px_#ff9900]" />
              <LottieAnimation type="lantern" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_20px_rgba(255,165,0,0.6)]" />
            </div>

            {/* Mascot Container: Ghost popping out of Pumpkin with Speech Bubble */}
            <div className="relative flex flex-col items-center">
              
              {/* Cute Speech Bubble */}
              <div className="speech-bubble px-4 py-2 mb-2 text-xs font-black text-slate-900 flex items-center gap-1.5 shadow-xl border-2 border-orange-300 animate-bounce">
                <span>Trick or Treat! Feed me vintage .SWF bytes!</span>
                <span className="text-amber-500 font-extrabold">🍬</span>
              </div>

              {/* The Pumpkin & Ghost Assembly */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                {/* Glowing Carved Jack-o'-Lantern Base */}
                <div className="absolute bottom-0 w-40 h-28 sm:w-48 sm:h-32 bg-gradient-to-t from-orange-600 via-orange-500 to-amber-500 rounded-[50%_50%_46%_46%] border-3 border-amber-300 shadow-[0_0_40px_rgba(255,106,0,0.6)] flex items-center justify-center overflow-hidden z-10">
                  {/* Carved Glowing Eyes & Grin */}
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <div className="flex gap-7">
                      <div className="w-3.5 h-3.5 bg-yellow-200 rotate-45 shadow-[0_0_12px_#ffd000]" />
                      <div className="w-3.5 h-3.5 bg-yellow-200 rotate-45 shadow-[0_0_12px_#ffd000]" />
                    </div>
                    {/* Tooth Grin */}
                    <div className="w-10 h-3 bg-yellow-200 rounded-b-full shadow-[0_0_14px_#ffd000]" />
                  </div>
                </div>

                {/* Animated Ghost (User's Lottie) popping up */}
                <div className="relative -top-6 sm:-top-8 z-20 hover:scale-105 transition-transform">
                  <LottieAnimation type="ghost" className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                </div>
              </div>

              {/* Feature Badges underneath Mascot */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold text-purple-200">
                <span className="inline-flex items-center gap-1 rounded-full glass-pill px-3 py-1 text-cyan-300 border border-purple-400/20">
                  <Cpu className="h-3 w-3 text-cyan-400" /> Neural Transpiler
                </span>
                <span className="inline-flex items-center gap-1 rounded-full glass-pill px-3 py-1 text-amber-300 border border-purple-400/20">
                  <Sparkles className="h-3 w-3 text-amber-400" /> 60 FPS HTML5 Canvas
                </span>
                <span className="inline-flex items-center gap-1 rounded-full glass-pill px-3 py-1 text-emerald-300 border border-purple-400/20">
                  <Shield className="h-3 w-3 text-emerald-400" /> Zero Plugins Needed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
