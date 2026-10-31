"use client";

import React from "react";
import { FlashPreset, FLASH_PRESETS } from "@/lib/presets/flashPresets";
import { BookOpen, Sparkles, UploadCloud, Skull, Trophy } from "lucide-react";
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
    <section className="w-full rounded-2xl border-2 border-cyan-800/60 bg-gradient-to-b from-[#081e2b] to-[#040f17] p-5 shadow-2xl">
      {/* Almanac Header - PvZ Codex Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-800/40 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-amber-300">
              Almanac of the Departed
            </h2>
            <p className="text-xs text-slate-400">
              Select a consecrated 2000s Flash soul to channel, or drop your own .SWF binary
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
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105"
              : "border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60"
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Custom .SWF</span>
        </button>
      </div>

      {/* Preset Cards Carousel / Grid (Plants vs Zombies & Amo's Style) */}
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
              className={`group relative flex flex-col justify-between rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-amber-400 bg-[#0e3447] shadow-xl shadow-amber-500/20 scale-[1.02]"
                  : "border-cyan-900/70 bg-[#071d2b]/80 hover:border-cyan-700 hover:bg-[#0b2738]"
              }`}
            >
              {/* Card Corner Year Badge */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300 border border-amber-500/30">
                  <span className="text-xs">📅</span> {preset.year}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                    preset.almanac.difficulty === "NIGHTMARE"
                      ? "bg-red-950 text-red-300 border border-red-800"
                      : preset.almanac.difficulty === "MEDIUM"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  }`}
                >
                  {preset.almanac.difficulty}
                </span>
              </div>

              {/* Avatar & Title */}
              <div className="my-3 flex items-center gap-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-amber-400/40 bg-slate-950/80 text-3xl shadow-inner group-hover:scale-110 transition-transform"
                  style={{ borderColor: preset.accentColor }}
                >
                  {preset.avatarIcon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-300 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-400">{preset.author}</p>
                  <p className="text-[11px] font-mono text-emerald-400">{preset.genre}</p>
                </div>
              </div>

              {/* Almanac Lore Excerpt */}
              <div className="rounded-lg bg-black/40 p-2.5 border border-cyan-950 text-[11px] text-slate-300">
                <p className="italic text-slate-400 line-clamp-2">
                  &ldquo;{preset.almanac.historicalLore}&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>SWF: {preset.swfFileSize}</span>
                  <span className="text-amber-400">{preset.almanac.spiritStrength}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                <button
                  className={`w-full rounded-lg py-2 text-xs font-black uppercase tracking-wider transition-all ${
                    isSelected
                      ? "gold-flame-btn text-slate-950 shadow-md"
                      : "bg-cyan-950/70 border border-cyan-700/60 text-cyan-200 group-hover:bg-cyan-800 group-hover:text-white"
                  }`}
                >
                  {isSelected ? "✦ Preserved & Summoned ✦" : "Reanimate Spirit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

