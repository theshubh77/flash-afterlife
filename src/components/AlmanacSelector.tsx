"use client";

import React from "react";
import { FlashPreset, FLASH_PRESETS } from "@/lib/presets/flashPresets";
import { BookOpen, UploadCloud, Check, Sparkles } from "lucide-react";
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
    <section className="w-full rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-purple-500/25">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl" />

      {/* Almanac Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-400/40 text-orange-300 shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                Almanac of the Departed
              </h2>
            </div>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Select a consecrated 2000s Flash classic to play, or summon your own custom .SWF binary from the digital afterlife
            </p>
          </div>
        </div>

        {/* Custom Upload Switcher Tab (Styled like candy ribbon button) */}
        <button
          onClick={() => {
            playBlip();
            onSelectUploadMode();
          }}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
            isUploadMode
              ? "candy-orange-btn scale-105"
              : "candy-wrapper-pill text-purple-200 hover:text-white"
          }`}
        >
          <UploadCloud className="h-4 w-4 text-amber-300" />
          <span>Upload Custom .SWF</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {FLASH_PRESETS.map((preset, index) => {
          const isSelected = selectedPresetId === preset.id && !isUploadMode;
          const badgeRank = `RELIC #${index + 1}`;

          return (
            <div
              key={preset.id}
              onClick={() => {
                playBlip();
                onSelectPreset(preset);
              }}
              className={`group relative flex flex-col justify-between rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "bg-gradient-to-b from-[#35155d] to-[#250d44] border-2 border-orange-400 shadow-[0_0_30px_rgba(255,106,0,0.35)] scale-[1.02]"
                  : "glass-card hover:border-purple-400/40"
              }`}
            >
              {/* Card Header: Relic Rank Badge & Year */}
              <div className="flex items-center justify-between">
                {/* Circular / pill candy orange tag */}
                <span className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-0.5 text-xs font-black text-slate-950 shadow-md">
                  {badgeRank}
                </span>

                <span className="flex items-center gap-1 rounded-full glass-pill px-2.5 py-0.5 text-[11px] font-mono text-purple-200">
                  <span>📅</span> {preset.year}
                </span>
              </div>

              {/* Avatar & Title */}
              <div className="my-4 flex items-center gap-3.5">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/40 border border-purple-400/30 text-3xl shadow-inner group-hover:scale-110 transition-transform"
                >
                  {preset.avatarIcon}
                </div>
                <div>
                  <h3 className="font-black text-white text-base leading-snug group-hover:text-amber-300 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-purple-200/70">{preset.author}</p>
                  <span className="inline-block mt-0.5 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                    {preset.genre}
                  </span>
                </div>
              </div>

              {/* Minimal Lore Snippet */}
              <div className="rounded-xl bg-black/40 p-3 border border-purple-500/15 text-[11px] text-purple-100/90 leading-relaxed">
                <p className="italic text-purple-200/80 line-clamp-2">
                  &ldquo;{preset.almanac.historicalLore}&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-purple-300/70 font-mono">
                  <span>SWF: {preset.swfFileSize}</span>
                  <span className="text-amber-400 font-bold">{preset.almanac.spiritStrength}</span>
                </div>
              </div>

              {/* Confirm / Reanimate Button */}
              <div className="mt-4">
                <button
                  type="button"
                  className={`w-full rounded-full py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? "candy-orange-btn"
                      : "candy-wrapper-pill text-purple-100 group-hover:text-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Awakened & Playing</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Summon to Canvas</span>
                    </>
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
