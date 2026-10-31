"use client";

import React from "react";
import { FlashPreset, FLASH_PRESETS } from "@/lib/presets/flashPresets";
import { BookOpen, UploadCloud, Check } from "lucide-react";
import { playBlip } from "@/lib/audio/retroSynth";

interface AlmanacSelectorProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: FlashPreset) => void;
  onSelectUploadMode: () => void;
  isUploadMode: boolean;
}

export function AlmanacSelector({
  selectedPresetId,
  onSelectPreset,
  onSelectUploadMode,
  isUploadMode,
}: AlmanacSelectorProps) {
  return (
    <section className="w-full rounded-2xl glass-panel p-6 shadow-2xl relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Almanac Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-pill text-amber-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              Almanac of the Departed
            </h2>
            <p className="text-xs text-slate-400">
              Select a consecrated 2000s Flash classic, or summon a custom .SWF binary
            </p>
          </div>
        </div>

        {/* Custom Upload Switcher Tab */}
        <button
          onClick={() => {
            playBlip();
            onSelectUploadMode();
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            isUploadMode
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
              : "glass-pill text-emerald-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Custom .SWF</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {FLASH_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id && !isUploadMode;

          return (
            <div
              key={preset.id}
              onClick={() => {
                playBlip();
                onSelectPreset(preset);
              }}
              className={`group relative flex flex-col justify-between rounded-2xl p-4.5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "bg-amber-500/[0.08] border border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.18)] scale-[1.01]"
                  : "glass-card hover:border-white/20"
              }`}
            >
              {/* Card Header: Year & Difficulty Badge */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-full glass-pill px-2.5 py-0.5 text-[11px] font-mono text-amber-300">
                  <span>📅</span> {preset.year}
                </span>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                    preset.almanac.difficulty === "NIGHTMARE"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : preset.almanac.difficulty === "MEDIUM"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {preset.almanac.difficulty}
                </span>
              </div>

              {/* Avatar & Title */}
              <div className="my-3 flex items-center gap-3">
                <div
                  className="flex h-13 w-13 items-center justify-center rounded-2xl glass-pill text-2xl shadow-inner group-hover:scale-105 transition-transform"
                  style={{ borderColor: `${preset.accentColor}60` }}
                >
                  {preset.avatarIcon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-300 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-400">{preset.author}</p>
                  <p className="text-[11px] font-mono text-emerald-400/90">{preset.genre}</p>
                </div>
              </div>

              {/* Minimal Lore Snippet */}
              <div className="rounded-xl bg-black/30 p-2.5 border border-white/5 text-[11px] text-slate-300/90">
                <p className="italic text-slate-400 line-clamp-2 leading-relaxed">
                  &ldquo;{preset.almanac.historicalLore}&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>SWF: {preset.swfFileSize}</span>
                  <span className="text-amber-400">{preset.almanac.spiritStrength}</span>
                </div>
              </div>

              {/* Select Status Button */}
              <div className="mt-3.5">
                <button
                  className={`w-full rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "gold-glow-btn text-slate-950 font-black"
                      : "glass-btn text-slate-300 group-hover:text-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Preserved & Summoned</span>
                    </>
                  ) : (
                    <span>Reanimate Spirit</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
