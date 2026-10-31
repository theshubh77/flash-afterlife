"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { RotateCcw, Monitor, Maximize2, Terminal, Cpu, Layers } from "lucide-react";
import { playBlip, playReanimationChime } from "@/lib/audio/retroSynth";
import { LottieAnimation } from "./LottieAnimation";

interface CanvasStageProps {
  gameCode: string;
  swfData?: ArrayBuffer | null;
  title: string;
  controls: string[];
  cemeteryKeeperMessage?: string;
  isFallback?: boolean;
  onOpenCodeSeance: () => void;
}

export function CanvasStage({
  gameCode,
  swfData,
  title,
  controls,
  cemeteryKeeperMessage,
  isFallback,
  onOpenCodeSeance,
}: CanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ruffleContainerRef = useRef<HTMLDivElement>(null);

  // Default is ALWAYS the high-performance Reanimated HTML5 Canvas!
  const [engineMode, setEngineMode] = useState<"gemma-canvas" | "ruffle-wasm">("gemma-canvas");
  const [enableCrt, setEnableCrt] = useState(true);
  const [isRuffleLoaded, setIsRuffleLoaded] = useState(false);
  const [ruffleError, setRuffleError] = useState<string | null>(null);
  const [restartNonce, setRestartNonce] = useState(0);

  // Initialize Ruffle from reliable jsDelivr CDN with fixed Webpack publicPath
  useEffect(() => {
    if (typeof window === "undefined") return;

    interface RuffleGlobal {
      config?: Record<string, unknown>;
      newest?: () => {
        createPlayer: () => {
          style: { width: string; height: string };
          load: (config: { data: ArrayBuffer; autoplay: string; letterbox: string }) => Promise<void>;
          destroy?: () => void;
        };
      };
    }

    const win = window as unknown as { RufflePlayer?: RuffleGlobal };

    // Explicitly configure Ruffle BEFORE loading the script!
    // This tells Webpack exactly where all sub-chunks (chunk 110) and WASM binaries live, preventing 404/ChunkLoadErrors!
    win.RufflePlayer = win.RufflePlayer || {};
    win.RufflePlayer.config = {
      publicPath: "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@0.7.1/",
      polyfills: false,
      autoplay: "on",
      unmuteOverlay: "hidden",
      letterbox: "on",
    };

    if (win.RufflePlayer && typeof win.RufflePlayer.newest === "function") {
      setIsRuffleLoaded(true);
      return;
    }

    const existing = document.querySelector('script[src*="@ruffle-rs/ruffle"]');
    if (existing) {
      existing.addEventListener("load", () => setIsRuffleLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@0.7.1/ruffle.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      setIsRuffleLoaded(true);
    };
    script.onerror = () => {
      console.warn("Ruffle CDN was blocked or unavailable. Gemma HTML5 Canvas is active.");
      setRuffleError("Ruffle CDN was blocked by network/adblocker.");
    };
    document.head.appendChild(script);
  }, []);

  // Mount Ruffle Player ONLY when user explicitly toggles to "ruffle-wasm"
  useEffect(() => {
    if (engineMode !== "ruffle-wasm" || !ruffleContainerRef.current) return;

    if (!swfData) {
      return;
    }

    const win = window as unknown as {
      RufflePlayer?: {
        newest: () => {
          createPlayer: () => {
            style: { width: string; height: string };
            load: (config: { data: ArrayBuffer; autoplay: string; letterbox: string }) => Promise<void>;
            destroy?: () => void;
          };
        };
      };
    };

    if (win.RufflePlayer && typeof win.RufflePlayer.newest === "function") {
      try {
        setRuffleError(null);
        const ruffle = win.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        player.style.width = "100%";
        player.style.height = "100%";

        ruffleContainerRef.current.innerHTML = "";
        ruffleContainerRef.current.appendChild(player as unknown as Node);

        player.load({
          data: swfData,
          autoplay: "on",
          letterbox: "on",
        }).catch((err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("Ruffle SWF player error:", err);
          setRuffleError(`Flash playback notice: ${msg}`);
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Ruffle mount error:", err);
        setRuffleError(`Mount error: ${msg}`);
      }
    }

    return () => {
      if (ruffleContainerRef.current) {
        ruffleContainerRef.current.innerHTML = "";
      }
    };
  }, [engineMode, swfData, isRuffleLoaded, restartNonce]);

  // Build the sandboxed HTML5 document for 60 FPS Canvas execution
  const iframeSrcDoc = useMemo(() => {
    const safeJs = (gameCode || "").replace(/<\/script>/gi, "<\\/script>");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      font-family: monospace;
    }
    #screen {
      display: block;
      width: 100%;
      height: 100%;
      max-width: 640px;
      max-height: 400px;
      object-fit: contain;
      background: #000;
      image-rendering: pixelated;
      outline: none;
      cursor: crosshair;
    }
  </style>
</head>
<body>
  <canvas id="screen" width="640" height="400" tabindex="0"></canvas>
  <script>
    (function() {
      const canvas = document.getElementById('screen');
      const ctx = canvas.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.focus();
      window.addEventListener('click', () => {
        try { canvas.focus(); } catch (_) {}
      });

      // Prevent arrow/space scrolling on the parent window
      window.addEventListener('keydown', function(e) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
          e.preventDefault();
        }
      }, { passive: false });

      try {
        ${safeJs}
        if (typeof startReanimatedGame === 'function') {
          startReanimatedGame(canvas, ctx);
        } else {
          throw new Error('startReanimatedGame entry point not found in code');
        }
      } catch (err) {
        console.error('Canvas Loop Runtime Error:', err);
        ctx.fillStyle = '#061722';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('Séance Recovery Active:', 20, 50);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText(String(err && err.message ? err.message : err), 20, 80);
      }
    })();
  <\/script>
</body>
</html>`;
  }, [gameCode, restartNonce]);

  const restartGame = () => {
    playBlip();
    setRestartNonce((n) => n + 1);
    playReanimationChime();
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
      {/* Stage Header with Dual-Engine Switcher & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-900/50 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <LottieAnimation type="arcade" className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
              <span>Canvas Stage</span>
              <span className="text-xs text-amber-400 font-mono">[{title}]</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Engine: {engineMode === "gemma-canvas" ? "⚡ Reanimated HTML5 Canvas (60 FPS Pure Web Standards)" : "🏺 Authentic Ruffle WASM Player"}
            </span>
          </div>
        </div>

        {/* Dual Engine Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Engine Selector */}
          <div className="flex items-center rounded-lg bg-slate-900/90 p-1 border border-cyan-900/70 text-xs font-mono">
            <button
              onClick={() => {
                playBlip();
                setEngineMode("gemma-canvas");
              }}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-bold transition-all ${
                engineMode === "gemma-canvas"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Play Gemma's re-architected modern HTML5 Canvas JavaScript loop"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>HTML5 Canvas</span>
            </button>

            <button
              onClick={() => {
                playBlip();
                setEngineMode("ruffle-wasm");
              }}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-bold transition-all ${
                engineMode === "ruffle-wasm"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Play original Flash vectors via Ruffle WebAssembly"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Ruffle WASM</span>
            </button>
          </div>

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

      {/* Cemetery Keeper Lore Banner if Fallback Active */}
      {cemeteryKeeperMessage && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-600/50 bg-amber-950/40 p-3 text-xs text-amber-200">
          <LottieAnimation type="skull" className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-300">
              The Cemetery Keeper Speaks:
            </span>
            <p className="mt-0.5 text-amber-200/90">{cemeteryKeeperMessage}</p>
          </div>
        </div>
      )}

      {/* The Screen / Sandboxed Canvas Housing */}
      <div
        className={`relative mt-4 flex min-h-[380px] w-full items-center justify-center overflow-hidden rounded-xl border-4 border-slate-800 bg-black crt-curve ${
          enableCrt ? "crt-overlay" : ""
        }`}
      >
        {/* Engine A: Gemma AI HTML5 Sandboxed Canvas */}
        <div
          className={`w-full h-[400px] flex items-center justify-center ${
            engineMode === "gemma-canvas" ? "block" : "hidden"
          }`}
        >
          <iframe
            key={`canvas-frame-${restartNonce}-${title}`}
            ref={iframeRef}
            srcDoc={iframeSrcDoc}
            sandbox="allow-scripts"
            title={`Playable Canvas Stage - ${title}`}
            className="w-full h-full border-none block bg-black"
          />
        </div>

        {/* Engine B: Ruffle WebAssembly Native Flash Canvas */}
        <div
          className={`w-full h-[400px] flex items-center justify-center relative ${
            engineMode === "ruffle-wasm" ? "block" : "hidden"
          }`}
        >
          <div ref={ruffleContainerRef} className="w-full h-full flex items-center justify-center" />

          {(!swfData || ruffleError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#051119]/90 p-6 text-center text-xs text-slate-300">
              <LottieAnimation type="portal" className="w-16 h-16 mb-2" />
              <p className="font-bold text-amber-300 text-sm">
                {ruffleError || "Drop a .SWF binary or select an Almanac preset to load raw vector binary."}
              </p>
              <button
                onClick={() => setEngineMode("gemma-canvas")}
                className="mt-3 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                Switch to Gemma HTML5 Canvas
              </button>
            </div>
          )}
        </div>

        {/* Live FPS / Specs Badge */}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-900/60 z-30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{engineMode === "ruffle-wasm" ? "RUFFLE WASM" : "HTML5 CANVAS"}</span>
          <span className="text-slate-500">|</span>
          <span>60 FPS</span>
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
          Dual-Engine: Pure HTML5 Canvas + Ruffle WASM Vectors
        </span>
      </div>
    </div>
  );
}
