"use client";

import React, { useState, useRef } from "react";
import { extractSwfBytecode, SwfMetadata } from "@/lib/swf/parser";
import { UploadCloud, FileCode2, CheckCircle2, AlertCircle, Loader2, Sparkles, Terminal } from "lucide-react";
import { playBlip, playReanimationChime } from "@/lib/audio/retroSynth";

interface DropZoneProps {
  onBytecodeExtracted: (actionScript: string, metadata: SwfMetadata, filename: string) => void;
  isProcessing: boolean;
}

export function DropZone({ onBytecodeExtracted, isProcessing }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedMetadata, setExtractedMetadata] = useState<SwfMetadata | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".swf")) {
      setError("Please drop a valid Macromedia / Adobe Flash .SWF file.");
      return;
    }

    try {
      setError(null);
      setExtracting(true);
      setCurrentFile(file.name);

      const arrayBuffer = await file.arrayBuffer();
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
        file.name
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Extraction error: ${msg}`);
    } finally {
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
    <div className="w-full rounded-2xl border-2 border-emerald-500/40 bg-[#061e22]/90 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
        <div className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base uppercase tracking-wider">
            In-Browser SWF Bytecode Extractor
          </h3>
        </div>
        <span className="rounded bg-emerald-950 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-300 border border-emerald-800">
          Client-Side DecompressionStream
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-300">
        Drop any 2000s <code className="text-emerald-400 font-mono">.swf</code> file. The browser
        streams the zlib body, extracts Tag 12 (<span className="text-amber-300">DoAction</span>) and Tag 59 (<span className="text-amber-300">DoInitAction</span>),
        and feeds the raw ActionScript into the Mastra Gemma agent.
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
        className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
          isDragging
            ? "border-emerald-400 bg-emerald-900/30 scale-[1.01]"
            : "border-emerald-600/50 bg-[#041417]/80 hover:border-emerald-400 hover:bg-[#072429]"
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
            <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
            <p className="text-sm font-bold text-emerald-300">
              {extracting ? "Decompressing CWS zlib stream & scraping Tag 12/59..." : "Mastra Orchestration & Gemma Transpilation in progress..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileCode2 className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-200">
              Drop your vintage <span className="text-emerald-400 font-mono">.swf</span> binary here, or click to browse
            </p>
            <p className="text-xs text-slate-400">
              Supports FWS (uncompressed) & CWS (zlib-deflated) Flash versions 4 through 10
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-950/80 border border-red-800 p-3 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted Metadata Card */}
      {extractedMetadata && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-[#021013] p-4 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-2 mb-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> SWF Forensics: {currentFile}
            </span>
            <span className="text-amber-400">
              Format: {extractedMetadata.signature} (v{extractedMetadata.version})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500">Canvas Dimensions:</span>{" "}
              <span className="text-white">{extractedMetadata.width} x {extractedMetadata.height} px</span>
            </div>
            <div>
              <span className="text-slate-500">Native FPS:</span>{" "}
              <span className="text-white">{extractedMetadata.fps} FPS</span>
            </div>
            <div>
              <span className="text-slate-500">Total Tags:</span>{" "}
              <span className="text-white">{extractedMetadata.tagCount}</span>
            </div>
            <div>
              <span className="text-slate-500">ActionScript Tags:</span>{" "}
              <span className="text-emerald-300">{extractedMetadata.actionScriptTagsFound}</span>
            </div>
          </div>

          {extractedMetadata.extractedSymbols.length > 0 && (
            <div className="mt-3">
              <span className="text-slate-500 text-[10px]">RECOVERED BYTECODE SYMBOLS:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {extractedMetadata.extractedSymbols.slice(0, 12).map((sym, i) => (
                  <span
                    key={i}
                    className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] text-emerald-300 border border-emerald-800/60"
                  >
                    {sym}
                  </span>
                ))}
                {extractedMetadata.extractedSymbols.length > 12 && (
                  <span className="text-[10px] text-slate-500 self-center">
                    +{extractedMetadata.extractedSymbols.length - 12} more
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
