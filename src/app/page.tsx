"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { AlmanacSelector } from "@/components/AlmanacSelector";
import { DropZone } from "@/components/DropZone";
import { CanvasStage } from "@/components/CanvasStage";
import { OfrendaAltar } from "@/components/OfrendaAltar";
import { GhostSeanceWall } from "@/components/GhostSeanceWall";
import { CodeSeanceModal } from "@/components/CodeSeanceModal";
import { WhyOpenSourceManifesto } from "@/components/WhyOpenSourceManifesto";
import { FLASH_PRESETS, FlashPreset } from "@/lib/presets/flashPresets";
import { SwfMetadata } from "@/lib/swf/parser";
import { NormalizedFlashAST } from "@/lib/mastra/tools/normalizeActionScript";
import { playReanimationChime } from "@/lib/audio/retroSynth";
import { Terminal } from "lucide-react";
import { LottieAnimation } from "@/components/LottieAnimation";

export default function Home() {
  const [activePreset, setActivePreset] = useState<FlashPreset>(FLASH_PRESETS[0]);
  const [isUploadMode, setIsUploadMode] = useState<boolean>(false);

  // Canvas State & Generated ECMAScript Game Loop
  const [currentSwfData, setCurrentSwfData] = useState<ArrayBuffer | null>(null);
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
  const [modelUsed, setModelUsed] = useState<string>("Neural Code Transpiler");

  const [isManifestoOpen, setIsManifestoOpen] = useState<boolean>(false);
  const [isSeanceOpen, setIsSeanceOpen] = useState<boolean>(false);

  // Handle Preset Selection from Almanac
  const handleSelectPreset = async (preset: FlashPreset) => {
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
    setModelUsed("Neural Code Transpiler");
    playReanimationChime();

    // Pre-load sample SWF buffer so Ruffle can play it if user toggles engine
    try {
      const swfMap: Record<string, string> = {
        "helicopter-2004": "/sample-swfs/vintage_copter_2004.swf",
        "tank-blaster": "/sample-swfs/arcade_tank_assault.swf",
        "elastic-ball": "/sample-swfs/bouncing_elastic_ball.swf",
      };
      const swfUrl = swfMap[preset.id];
      if (swfUrl) {
        const res = await fetch(swfUrl);
        const buf = await res.arrayBuffer();
        setCurrentSwfData(buf);
      }
    } catch (_) {
      // ignore
    }
  };

  // Redesigned SWF-to-Canvas Reanimation Pipeline
  const handleBytecodeExtracted = async (
    extractedAs2: string,
    metadata: SwfMetadata,
    filename: string,
    rawBuffer: ArrayBuffer
  ) => {
    setIsProcessing(true);
    setAs2Code(extractedAs2);
    setCurrentSwfData(rawBuffer);

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

  const handleSelectUploadMode = () => {
    setIsUploadMode(true);
    setTimeout(() => {
      const el = document.getElementById("upload-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Lighting Background Spheres */}
      <div className="pointer-events-none fixed top-24 left-10 h-[450px] w-[450px] rounded-full bg-purple-600/[0.12] blur-[140px] -z-10" />
      <div className="pointer-events-none fixed top-44 right-10 h-[500px] w-[500px] rounded-full bg-orange-500/[0.12] blur-[150px] -z-10" />
      <div className="pointer-events-none fixed bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-500/[0.08] blur-[150px] -z-10" />

      {/* Top Atmospheric Header with Korean Halloween Hero */}
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
          onSelectUploadMode={handleSelectUploadMode}
          isUploadMode={isUploadMode}
        />

        {/* Custom SWF Upload Zone (revealed and scrolled into view on click) */}
        {isUploadMode && (
          <div id="upload-section" className="scroll-mt-6 transition-all duration-300">
            <DropZone
              onBytecodeExtracted={handleBytecodeExtracted}
              isProcessing={isProcessing}
              onClose={() => setIsUploadMode(false)}
            />
          </div>
        )}

        {/* The Two Main Pillars: Reanimated Canvas Stage & The Virtual Ofrenda */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Reanimated Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <CanvasStage
              gameCode={currentGameCode}
              swfData={currentSwfData}
              title={currentTitle}
              controls={currentControls}
              cemeteryKeeperMessage={cemeteryKeeperMessage}
              isFallback={isFallback}
              onOpenCodeSeance={() => setIsSeanceOpen(true)}
            />

            {/* Quick Action Bar under Canvas */}
            <div className="flex items-center justify-between rounded-2xl glass-panel p-4 text-xs border border-purple-500/20">
              <div className="flex items-center gap-3">
                <LottieAnimation type="portal" className="w-7 h-7 shrink-0" />
                <div>
                  <span className="font-extrabold text-white uppercase tracking-wider">
                    SWF-TO-CANVAS PIPELINE: ACTIVE
                  </span>
                  <p className="text-[11px] text-purple-200/70">
                    Dual-Engine: Pure HTML5 Canvas + WebAssembly Vectors
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSeanceOpen(true)}
                  className="candy-wrapper-pill flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-200 uppercase tracking-wider hover:text-white"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Inspect Bytecode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Virtual Ofrenda Altar with User's Lottie Candle (5 Cols) */}
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

        {/* Interactive Ghost Séance / Community Tribute Wall (Matching Inspiration Screen) */}
        <GhostSeanceWall />
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

      {/* Wavy Pumpkin Orange Transition & Footer (Matching Inspiration Screen Base) */}
      <div className="mt-16 w-full">
        {/* Playful Halloween SVG Wave */}
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-20 text-[#ff6600] preserve-3d"
        >
          <path
            d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="currentColor"
          />
        </svg>

        {/* Pumpkin Orange Festive Footer - Sole Technical Crediting Zone */}
        <footer className="w-full bg-gradient-to-b from-[#ff6600] to-[#e65100] py-8 text-xs font-mono text-slate-950 font-bold shadow-2xl">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-black">
              <span>🎃 FlashAfterlife</span>
              <span className="text-black/30">•</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full">Gemma-4-26B</span>
              <span className="text-black/30">•</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full">Mastra Agents</span>
              <span className="text-black/30">•</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full">Render Cloud</span>
              <span className="text-black/30">•</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full">HTML5 Canvas</span>
            </div>

            <div className="text-slate-950 text-center sm:text-right font-black">
              Built with 🕯️ for the Hacktoberfest 2026 Open-Source AI Challenge • Ghost in the Machine
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
