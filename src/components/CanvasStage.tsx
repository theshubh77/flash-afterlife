"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Monitor, Maximize2, ShieldAlert, Sparkles, Terminal } from "lucide-react";
import { playBlip, playReanimationChime } from "@/lib/audio/retroSynth";

interface CanvasStageProps {
  gameCode: string;
  title: string;
  controls: string[];
  cemeteryKeeperMessage?: string;
  isFallback?: boolean;
  onOpenCodeSeance: () => void;
}

export function CanvasStage({
  gameCode,
  title,
  controls,
  cemeteryKeeperMessage,
  isFallback,
  onOpenCodeSeance,
}: CanvasStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const [enableCrt, setEnableCrt] = useState(true);
  const [fps, setFps] = useState(60);
  const [isRunning, setIsRunning] = useState(true);

  // Mount & execute reanimated Canvas Game Loop
  useEffect(() => {
    if (!canvasRef.current || !gameCode) return;

    // Clean up previous game loop if any
    if (cleanupRef.current) {
      try {
        cleanupRef.current();
      } catch (e) {
        console.warn("Cleanup warning:", e);
      }
      cleanupRef.current = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      // Execute sanitized startReanimatedGame contract
      const executor = new Function("canvas", "ctx", `${gameCode}\n return startReanimatedGame(canvas, ctx);`);
      const cleanupFn = executor(canvas, ctx);

      if (typeof cleanupFn === "function") {
        cleanupRef.current = cleanupFn;
      }

      setIsRunning(true);
    } catch (err) {
      console.error("Game execution error:", err);
    }

    return () => {
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch (e) {
          console.warn("Cleanup error on unmount:", e);
        }
        cleanupRef.current = null;
      }
    };
  }, [gameCode]);

  const restartGame = () => {
    playBlip();
    if (!canvasRef.current || !gameCode) return;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const executor = new Function("canvas", "ctx", `${gameCode}\n return startReanimatedGame(canvas, ctx);`);
      cleanupRef.current = executor(canvas, ctx);
      playReanimationChime();
    } catch (err) {
      console.error("Restart error:", err);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col rounded-2xl border-2 border-cyan-800/80 bg-[#040f17] p-5 shadow-2xl"
    >
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-900/50 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="font-black text-white text-base uppercase tracking-wider">
            Reanimated Canvas Stage
          </h3>
          <span className="text-xs text-slate-400 font-mono">[{title}]</span>
        </div>

        {/* Arcade Action Controls Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnableCrt(!enableCrt)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-colors ${
              enableCrt
                ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                : "bg-slate-900 text-slate-400 border border-slate-700 hover:text-white"
            }`}
            title="Toggle authentic 2004 CRT scanline filter"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>CRT {enableCrt ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={restartGame}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-950 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-700 hover:bg-cyan-900 transition-colors"
            title="Restart Game Loop"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>

          <button
            onClick={onOpenCodeSeance}
            className="flex items-center gap-1.5 rounded-lg bg-amber-950/70 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 border border-amber-700 hover:bg-amber-900 transition-colors"
            title="Inspect ActionScript vs Canvas Code Séance"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Inspect AS2</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center rounded-lg bg-slate-900 p-1.5 text-slate-400 border border-slate-700 hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Cemetery Keeper In-Character Lore Alert if Fallback Triggered */}
      {cemeteryKeeperMessage && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-600/50 bg-amber-950/40 p-3 text-xs text-amber-200">
          <span className="text-xl select-none">🪦</span>
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-300">
              The Cemetery Keeper Speaks:
            </span>
            <p className="mt-0.5 text-amber-200/90">{cemeteryKeeperMessage}</p>
          </div>
        </div>
      )}

      {/* The Screen / Canvas Housing */}
      <div
        className={`relative mt-4 flex items-center justify-center overflow-hidden rounded-xl border-4 border-slate-800 bg-black crt-curve ${
          enableCrt ? "crt-overlay" : ""
        }`}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="w-full h-auto max-h-[500px] object-contain cursor-crosshair select-none bg-black"
        />

        {/* Live FPS / Specs Badge */}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-900/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>60 FPS</span>
          <span className="text-slate-500">|</span>
          <span>HTML5 CANVAS</span>
        </div>
      </div>

      {/* Controls Cheat-Sheet HUD */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/70 p-3 border border-cyan-950 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-amber-300 uppercase tracking-wider text-[11px]">
            Controls:
          </span>
          {controls.map((ctrl, i) => (
            <span
              key={i}
              className="rounded bg-cyan-950/80 px-2 py-0.5 font-mono text-cyan-200 border border-cyan-800/50 text-[11px]"
            >
              {ctrl}
            </span>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Runs locally with Zero Plugins
        </span>
      </div>
    </div>
  );
}
