"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { AlmanacSelector } from "@/components/AlmanacSelector";
import { DropZone } from "@/components/DropZone";
import { CanvasStage } from "@/components/CanvasStage";
import { OfrendaAltar } from "@/components/OfrendaAltar";
import { CodeSeanceModal } from "@/components/CodeSeanceModal";
import { WhyOpenSourceManifesto } from "@/components/WhyOpenSourceManifesto";
import { FLASH_PRESETS, FlashPreset } from "@/lib/presets/flashPresets";
import { SwfMetadata } from "@/lib/swf/parser";
import { NormalizedFlashAST } from "@/lib/mastra/tools/normalizeActionScript";
import { playReanimationChime, playBlip } from "@/lib/audio/retroSynth";
import { Flame, Sparkles, Terminal, BookOpen, ShieldCheck } from "lucide-react";

export default function Home() {
  const [activePreset, setActivePreset] = useState<FlashPreset>(FLASH_PRESETS[0]);
  const [isUploadMode, setIsUploadMode] = useState<boolean>(false);

  const [currentGameCode, setCurrentGameCode] = useState<string>(FLASH_PRESETS[0].defaultJsCode);
  const [currentTitle, setCurrentTitle] = useState<string>(FLASH_PRESETS[0].title);
  const [currentYear, setCurrentYear] = useState<number>(FLASH_PRESETS[0].year);
  const [currentAuthor, setCurrentAuthor] = useState<string>(FLASH_PRESETS[0].author);
  const [currentControls, setCurrentControls] = useState<string[]>(FLASH_PRESETS[0].controls);
  const [currentCalaverita, setCurrentCalaverita] = useState(FLASH_PRESETS[0].calaverita);
  const [currentEpitaph, setCurrentEpitaph] = useState<string>(FLASH_PRESETS[0].almanac.epitaph);
  const [loreSummary, setLoreSummary] = useState<string | undefined>(FLASH_PRESETS[0].almanac.historicalLore);
  const [loreSource, setLoreSource] = useState<string | undefined>("Macromedia Flash Almanac Archive");
  const [as2Code, setAs2Code] = useState<string>(FLASH_PRESETS[0].as2Code);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cemeteryKeeperMessage, setCemeteryKeeperMessage] = useState<string | undefined>(undefined);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [normalizedAST, setNormalizedAST] = useState<NormalizedFlashAST | undefined>(undefined);
  const [modelUsed, setModelUsed] = useState<string>("Gemma-3-27B via Mastra");

  const [isManifestoOpen, setIsManifestoOpen] = useState<boolean>(false);
  const [isSeanceOpen, setIsSeanceOpen] = useState<boolean>(false);

  // Handle Preset Selection from Almanac
  const handleSelectPreset = (preset: FlashPreset) => {
    setActivePreset(preset);
    setIsUploadMode(false);
    setCurrentGameCode(preset.defaultJsCode);
    setCurrentTitle(preset.title);
    setCurrentYear(preset.year);
    setCurrentAuthor(preset.author);
    setCurrentControls(preset.controls);
    setCurrentCalaverita(preset.calaverita);
    setCurrentEpitaph(preset.almanac.epitaph);
    setLoreSummary(preset.almanac.historicalLore);
    setLoreSource("Macromedia Flash Almanac Archive");
    setAs2Code(preset.as2Code);
    setCemeteryKeeperMessage(undefined);
    setIsFallback(false);
    setModelUsed("Gemma-3-27B via Mastra");
    playReanimationChime();
  };

  // Handle Custom SWF Upload & Reanimation Pipeline
  const handleBytecodeExtracted = async (
    extractedAs2: string,
    metadata: SwfMetadata,
    filename: string
  ) => {
    setIsProcessing(true);
    setAs2Code(extractedAs2);

    try {
      const cleanTitle = filename.replace(/\.swf$/i, "");
      const res = await fetch("/api/reanimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawActionScript: extractedAs2,
          title: cleanTitle,
          year: 2005,
          extractedSymbols: metadata.extractedSymbols,
        }),
      });

      const data = await res.json();

      if (data.success && data.gameCode) {
        setCurrentGameCode(data.gameCode);
        setCurrentTitle(data.title || cleanTitle);
        setCurrentYear(data.year || 2005);
        setCurrentAuthor(data.author || "Recovered Bytecode Soul");
        setCurrentControls(data.controls || ["Spacebar / Mouse: Interact", "Arrow Keys: Move"]);
        setCurrentCalaverita(data.calaverita);
        setCurrentEpitaph(`Preserved from ${filename} on the Flash Altar.`);
        setLoreSummary(data.lore?.historicalContext || "Recovered Flash classic.");
        setLoreSource(data.lore?.source || "SerpAPI Research");
        setCemeteryKeeperMessage(data.cemeteryKeeperMessage);
        setIsFallback(data.isFallback);
        setNormalizedAST(data.normalizedAST);
        setModelUsed(data.modelUsed);
        playReanimationChime();
      }
    } catch (err) {
      console.error("Reanimation request error:", err);
      setCurrentGameCode(activePreset.defaultJsCode);
      setCemeteryKeeperMessage(
        "The Cemetery Keeper channeled this classic temple while your binary spirit was resting."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen graveyard-bg flex flex-col text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Atmospheric Header */}
      <Header
        onOpenManifesto={() => setIsManifestoOpen(true)}
        onOpenSeance={() => setIsSeanceOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Almanac of the Departed / Preset Selection Codex */}
        <AlmanacSelector
          selectedPresetId={activePreset.id}
          onSelectPreset={handleSelectPreset}
          onSelectUploadMode={() => setIsUploadMode(!isUploadMode)}
          isUploadMode={isUploadMode}
        />

        {/* Custom SWF Upload Zone (revealed when user clicks Upload or toggles mode) */}
        {isUploadMode && (
          <DropZone
            onBytecodeExtracted={handleBytecodeExtracted}
            isProcessing={isProcessing}
          />
        )}

        {/* The Two Main Pillars: Reanimated Canvas Stage & The Virtual Ofrenda */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Reanimated Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <CanvasStage
              gameCode={currentGameCode}
              title={currentTitle}
              controls={currentControls}
              cemeteryKeeperMessage={cemeteryKeeperMessage}
              isFallback={isFallback}
              onOpenCodeSeance={() => setIsSeanceOpen(true)}
            />

            {/* Quick Action Bar under Canvas */}
            <div className="flex items-center justify-between rounded-xl bg-[#061722]/80 border border-cyan-900/60 p-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl select-none">🪦</span>
                <div>
                  <span className="font-bold text-white uppercase tracking-wider">
                    Preservation Status: ACTIVE
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Engineered for Hacktoberfest 2026: Ghost in the Machine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSeanceOpen(true)}
                  className="flash-btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Inspect Bytecode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Virtual Ofrenda Altar (5 Cols) */}
          <div className="lg:col-span-5">
            <OfrendaAltar
              title={currentTitle}
              year={currentYear}
              author={currentAuthor}
              calaverita={currentCalaverita}
              epitaph={currentEpitaph}
              loreSummary={loreSummary}
              loreSource={loreSource}
              modelUsed={modelUsed}
            />
          </div>
        </div>
      </main>

      {/* Code Séance Modal */}
      <CodeSeanceModal
        isOpen={isSeanceOpen}
        onClose={() => setIsSeanceOpen(false)}
        title={currentTitle}
        as2Code={as2Code}
        reanimatedJs={currentGameCode}
        normalizedAST={normalizedAST}
        modelUsed={modelUsed}
      />

      {/* Why Open Source Manifesto Modal */}
      <WhyOpenSourceManifesto
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-cyan-950 bg-[#030a10] py-6 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🪦 FlashAfterlife</span>
            <span>•</span>
            <span className="text-amber-400">Gemma-3-27B</span>
            <span>•</span>
            <span className="text-cyan-400">Mastra Agents</span>
            <span>•</span>
            <span className="text-emerald-400">Render Hosted</span>
          </div>

          <div>
            Built with 🕯️ for the Hacktoberfest 2026 Open-Source AI Challenge
          </div>
        </div>
      </footer>
    </div>
  );
}
