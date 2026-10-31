"use client";

import React, { useState, useRef } from "react";
import { extractSwfBytecode, SwfMetadata } from "@/lib/swf/parser";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { playBlip, playReanimationChime } from "@/lib/audio/retroSynth";
import { LottieAnimation } from "./LottieAnimation";

interface DropZoneProps {
  onBytecodeExtracted: (
    actionScript: string,
    metadata: SwfMetadata,
    filename: string,
    rawBuffer: ArrayBuffer
  ) => void;
  isProcessing: boolean;
}

export function DropZone({ onBytecodeExtracted, isProcessing }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedMetadata, setExtractedMetadata] = useState<SwfMetadata | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processBuffer = async (arrayBuffer: ArrayBuffer, filename: string) => {
    try {
      setError(null);
      setExtracting(true);
      setCurrentFile(filename);

      const result = await extractSwfBytecode(arrayBuffer);

      if (!result.success || !result.metadata) {
        setError(result.error || "Could not parse SWF tags.");
        setExtracting(false);
        return;
      }

      setExtractedMetadata(result.metadata);
      playReanimationChime();

      onBytecodeExtracted(
        result.rawActionScript || result.metadata.reconstructedActionScript,
        result.metadata,
        filename,
        arrayBuffer
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Extraction error: ${msg}`);
    } finally {
      setExtracting(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".swf")) {
      setError("Please drop a valid Macromedia / Adobe Flash .SWF file.");
      return;
    }
    const arrayBuffer = await file.arrayBuffer();
    await processBuffer(arrayBuffer, file.name);
  };

  const loadSampleSwf = async (samplePath: string, name: string) => {
    try {
      playBlip();
      setError(null);
      setExtracting(true);
      setCurrentFile(name);

      const res = await fetch(samplePath);
      const arrayBuffer = await res.arrayBuffer();
      await processBuffer(arrayBuffer, name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Sample load error: ${msg}`);
      setExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel-emerald p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <UploadCloud className="h-5 w-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base uppercase tracking-wider">
            SWF-to-Canvas Reanimation Altar
          </h3>
        </div>
        <span className="rounded-full glass-pill px-3 py-1 text-[11px] font-mono font-bold text-emerald-300">
          In-Browser Decompressor + Gemma-4 AI
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-300/80 leading-relaxed">
        Drop any vintage <code className="glass-pill px-1.5 py-0.5 text-emerald-300 font-mono rounded">.swf</code> binary. The in-browser WebAssembly decompressor streams the CWS/FWS bytes, scrapes ActionScript tags, and triggers Gemma-4 via Mastra to synthesize a 60 FPS HTML5 Canvas game.
      </p>

      {/* Drag & Drop Target Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-emerald-400 bg-emerald-500/15 scale-[1.01] shadow-[0_0_30px_rgba(16,185,129,0.25)]"
            : "border-white/15 bg-black/20 hover:border-emerald-400/50 hover:bg-emerald-500/[0.04]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".swf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFile(e.target.files[0]);
            }
          }}
        />

        {extracting || isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <LottieAnimation type="portal" className="w-18 h-18" />
            <p className="text-sm font-bold text-emerald-300 animate-pulse text-center">
              {extracting ? "Decompressing CWS zlib stream & scraping ActionScript..." : "Gemma AI Transpilation & HTML5 Canvas Reanimation in progress..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <LottieAnimation type="ghost" className="w-14 h-14" />
            <p className="text-sm font-bold text-slate-100">
              Drop your vintage <span className="text-emerald-300 font-mono">.swf</span> binary here, or click to browse
            </p>
            <p className="text-xs text-slate-400">
              Direct In-Browser Bytecode Extraction • 60 FPS HTML5 Canvas
            </p>
          </div>
        )}
      </div>

      {/* Quick Test Sample SWFs Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
        <span className="text-xs font-mono text-emerald-300 font-medium flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Or test instantly with vintage .SWF samples:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleSwf("/sample-swfs/vintage_copter_2004.swf", "copter_2004.swf");
            }}
            className="rounded-full glass-pill px-3 py-1 text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            🚁 copter_2004.swf
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleSwf("/sample-swfs/arcade_tank_assault.swf", "tank_blaster.swf");
            }}
            className="rounded-full glass-pill px-3 py-1 text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            🚀 tank_blaster.swf
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleSwf("/sample-swfs/bouncing_elastic_ball.swf", "elastic_ball.swf");
            }}
            className="rounded-full glass-pill px-3 py-1 text-xs font-mono text-slate-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            ⚪ elastic_ball.swf
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-200 backdrop-blur-md">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted Metadata Card */}
      {extractedMetadata && (
        <div className="mt-4 rounded-xl glass-card p-4 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> SWF Forensics: {currentFile}
            </span>
            <span className="text-amber-400 font-medium">
              Format: {extractedMetadata.signature} (v{extractedMetadata.version})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500">Dimensions:</span>{" "}
              <span className="text-white">{extractedMetadata.width} x {extractedMetadata.height} px</span>
            </div>
            <div>
              <span className="text-slate-500">FPS:</span>{" "}
              <span className="text-white">{extractedMetadata.fps}</span>
            </div>
            <div>
              <span className="text-slate-500">Tags:</span>{" "}
              <span className="text-white">{extractedMetadata.tagCount}</span>
            </div>
            <div>
              <span className="text-slate-500">ActionScript Tags:</span>{" "}
              <span className="text-emerald-300 font-bold">{extractedMetadata.actionScriptTagsFound}</span>
            </div>
          </div>

          {extractedMetadata.extractedSymbols.length > 0 && (
            <div className="mt-3">
              <span className="text-slate-500 text-[10px]">RECOVERED BYTECODE SYMBOLS:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {extractedMetadata.extractedSymbols.slice(0, 10).map((sym, i) => (
                  <span
                    key={i}
                    className="rounded-full glass-pill px-2 py-0.5 text-[10px] text-emerald-300"
                  >
                    {sym}
                  </span>
                ))}
                {extractedMetadata.extractedSymbols.length > 10 && (
                  <span className="text-[10px] text-slate-500 self-center">
                    +{extractedMetadata.extractedSymbols.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
