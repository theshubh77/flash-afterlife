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
    script.onload = () => setIsRuffleLoaded(true);
    script.onerror = () => {
      console.warn("Ruffle CDN was blocked or unavailable. Gemma HTML5 Canvas is active.");
      setRuffleError("Ruffle CDN was blocked by network/adblocker.");
    };
    document.head.appendChild(script);
  }, []);

  // Mount Ruffle Player ONLY when user explicitly toggles to "ruffle-wasm"
  useEffect(() => {
    if (engineMode !== "ruffle-wasm" || !ruffleContainerRef.current) return;

    if (!swfData) return;

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
      className="relative flex flex-col rounded-3xl glass-panel-glow p-5 sm:p-6 shadow-2xl backdrop-blur-2xl"
    >
      {/* Top Dock Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3.5 gap-3">
        <div className="flex items-center gap-2.5">
          <LottieAnimation type="arcade" className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
              <span>Canvas Stage</span>
              <span className="text-xs text-amber-300 font-mono">[{title}]</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine: {engineMode === "gemma-canvas" ? "⚡ Reanimated HTML5 Canvas (60 FPS)" : "🏺 Authentic Ruffle WASM"}
            </span>
          </div>
        </div>

        {/* Dual Engine Switcher & Controls Dock */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Engine Selector Toggle */}
          <div className="flex items-center rounded-xl glass-pill p-1 text-xs font-mono">
            <button
              onClick={() => {
                playBlip();
                setEngineMode("gemma-canvas");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold transition-all ${
                engineMode === "gemma-canvas"
                  ? "gold-glow-btn text-slate-950 shadow-md font-black"
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
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold transition-all ${
                engineMode === "ruffle-wasm"
                  ? "bg-emerald-500 text-slate-950 shadow-md font-black"
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
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold transition-all ${
              enableCrt
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "glass-pill text-slate-400 hover:text-white"
            }`}
            title="Toggle authentic 2004 CRT scanline filter"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>CRT {enableCrt ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={restartGame}
            className="glass-btn flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-white"
            title="Restart Game Loop"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>

          <button
            onClick={onOpenCodeSeance}
            className="glass-btn flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-amber-300 hover:text-amber-200"
            title="Inspect ActionScript vs Canvas Code Séance"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Inspect AS2</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="glass-btn flex items-center justify-center rounded-xl p-2 text-slate-400 hover:text-white"
            title="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Cemetery Keeper Lore Banner if Fallback Active */}
      {cemeteryKeeperMessage && (
        <div className="mt-3 flex items-start gap-2.5 rounded-2xl glass-card bg-amber-500/[0.08] border-amber-500/30 p-3.5 text-xs text-amber-200">
          <LottieAnimation type="skull" className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-300">
              The Cemetery Keeper Speaks:
            </span>
            <p className="mt-0.5 text-amber-200/90 leading-relaxed">{cemeteryKeeperMessage}</p>
          </div>
        </div>
      )}

      {/* The Screen / Sandboxed Canvas Housing */}
      <div
        className={`relative mt-4 flex min-h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black crt-curve shadow-[0_0_40px_rgba(0,0,0,0.8)] ${
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#051119]/90 backdrop-blur-md p-6 text-center text-xs text-slate-300">
              <LottieAnimation type="portal" className="w-16 h-16 mb-2" />
              <p className="font-bold text-amber-300 text-sm">
                {ruffleError || "Drop a .SWF binary or select an Almanac preset to load the raw vector binary."}
              </p>
              <button
                onClick={() => setEngineMode("gemma-canvas")}
                className="mt-3 rounded-xl gold-glow-btn px-4 py-2 text-xs font-black text-slate-950"
              >
                Switch to Gemma HTML5 Canvas
              </button>
            </div>
          )}
        </div>

        {/* Live FPS / Specs Badge */}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full glass-pill px-3 py-1 font-mono text-[10px] text-emerald-400 z-30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{engineMode === "ruffle-wasm" ? "RUFFLE WASM" : "HTML5 CANVAS"}</span>
          <span className="text-white/20">|</span>
          <span>60 FPS</span>
        </div>
      </div>

      {/* Controls Cheat-Sheet HUD */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl glass-pill p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-amber-300 uppercase tracking-wider text-[11px]">
            Controls:
          </span>
          {controls.map((ctrl, i) => (
            <span
              key={i}
              className="rounded-lg glass-pill px-2.5 py-1 font-mono text-cyan-200 text-[11px]"
            >
              {ctrl}
            </span>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Pure HTML5 Canvas • Zero Plugins Required
        </span>
      </div>
    </div>
  );
}
