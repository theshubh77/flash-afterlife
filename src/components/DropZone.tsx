"use client";

import React, { useState, useRef } from "react";
import { extractSwfBytecode, SwfMetadata } from "@/lib/swf/parser";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";
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
  onClose?: () => void;
}

export function DropZone({ onBytecodeExtracted, isProcessing, onClose }: DropZoneProps) {
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
    <div className="w-full rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-orange-500/30">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />

      {/* Header with Lantern icon */}
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-400/40 text-orange-300">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base sm:text-lg uppercase tracking-wider">
              SWF-to-Canvas Reanimation Altar
            </h3>
            <p className="text-xs text-purple-200/70">
              In-browser ActionScript decompilation & instant HTML5 Canvas synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LottieAnimation type="lantern" className="w-8 h-8 shrink-0" />
          <span className="hidden sm:inline-block rounded-full glass-pill px-3 py-1 text-[11px] font-mono font-bold text-orange-300 border border-orange-400/30">
            CWS Zlib Decompressor • Neural Transpiler
          </span>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="candy-wrapper-pill p-1.5 rounded-xl text-purple-200 hover:text-white transition-colors"
              title="Close Upload Section"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-purple-100/80 leading-relaxed">
        Drag and drop any vintage <code className="glass-pill px-1.5 py-0.5 text-orange-300 font-mono rounded font-bold">.swf</code> file. Our client-side decompressor unpacks the raw CWS zlib stream, extracts the original ActionScript bytecode, and synthesizes a standalone 60 FPS HTML5 Canvas game with zero plugins required.
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
        className={`mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-orange-400 bg-orange-500/20 scale-[1.01] shadow-[0_0_35px_rgba(255,106,0,0.35)]"
            : "border-purple-400/30 bg-black/30 hover:border-orange-400/60 hover:bg-orange-500/[0.06]"
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
            <LottieAnimation type="portal" className="w-20 h-20" />
            <p className="text-sm font-bold text-amber-300 animate-pulse text-center">
              {extracting ? "Decompressing CWS zlib stream & parsing ActionScript..." : "Neural code reconstruction & HTML5 Canvas reanimation in progress..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <LottieAnimation type="ghost" className="w-16 h-16" />
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                Drop your nostalgic <span className="text-amber-300 font-mono">.swf</span> binary here, or click to browse
              </p>
              <p className="text-xs text-purple-200/70 mt-1">
                Client-side bytecode extraction • Instant 60 FPS playable canvas
              </p>
            </div>
            <span className="mt-1 candy-wrapper-pill px-4 py-1.5 text-xs font-bold text-orange-200">
              Select .SWF File 🎃
            </span>
          </div>
        )}
      </div>

      {/* Quick Test Sample SWFs Bar (Styled like candy pills) */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-500/20">
        <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Or test instantly with classic archives:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleSwf("/sample-swfs/vintage_copter_2004.swf", "copter_2004.swf");
            }}
            className="rounded-full candy-wrapper-pill px-3.5 py-1 text-xs font-mono text-purple-100 hover:text-white transition-all"
          >
            🚁 copter_2004.swf
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleSwf("/sample-swfs/arcade_tank_assault.swf", "tank_blaster.swf");
            }}
            className="rounded-full candy-wrapper-pill px-3.5 py-1 text-xs font-mono text-purple-100 hover:text-white transition-all"
          >
            🚀 tank_blaster.swf
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSampleSwf("/sample-swfs/bouncing_elastic_ball.swf", "elastic_ball.swf");
            }}
            className="rounded-full candy-wrapper-pill px-3.5 py-1 text-xs font-mono text-purple-100 hover:text-white transition-all"
          >
            ⚪ elastic_ball.swf
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-500/15 border border-red-500/30 p-3.5 text-xs text-red-200 backdrop-blur-md">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted Metadata Card */}
      {extractedMetadata && (
        <div className="mt-5 rounded-2xl bg-[#1d0b38] border border-purple-500/30 p-4 font-mono text-xs text-purple-200 shadow-lg">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5 mb-2.5">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> SWF Forensics: {currentFile}
            </span>
            <span className="text-amber-400 font-bold">
              Format: {extractedMetadata.signature} (v{extractedMetadata.version})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-purple-300/80">
            <div>
              <span className="text-purple-400">Dimensions:</span>{" "}
              <span className="text-white font-bold">{extractedMetadata.width} x {extractedMetadata.height} px</span>
            </div>
            <div>
              <span className="text-purple-400">FPS:</span>{" "}
              <span className="text-white font-bold">{extractedMetadata.fps}</span>
            </div>
            <div>
              <span className="text-purple-400">Tags:</span>{" "}
              <span className="text-white font-bold">{extractedMetadata.tagCount}</span>
            </div>
            <div>
              <span className="text-purple-400">ActionScript Tags:</span>{" "}
              <span className="text-amber-300 font-bold">{extractedMetadata.actionScriptTagsFound}</span>
            </div>
          </div>

          {extractedMetadata.extractedSymbols.length > 0 && (
            <div className="mt-3">
              <span className="text-purple-400 text-[10px] uppercase font-bold">Recovered Bytecode Symbols:</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {extractedMetadata.extractedSymbols.slice(0, 10).map((sym, i) => (
                  <span
                    key={i}
                    className="rounded-full glass-pill px-2.5 py-0.5 text-[10px] text-amber-300 border border-purple-400/30"
                  >
                    {sym}
                  </span>
                ))}
                {extractedMetadata.extractedSymbols.length > 10 && (
                  <span className="text-[10px] text-purple-400 self-center">
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
