"use client";

import React, { useRef, useState, useMemo } from "react";
import { RotateCcw, Monitor, Maximize2, Terminal, Cpu } from "lucide-react";
import { playBlip, playReanimationChime } from "@/lib/audio/retroSynth";
import { LottieAnimation } from "./LottieAnimation";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [enableCrt, setEnableCrt] = useState(true);
  const [restartNonce, setRestartNonce] = useState(0);

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
      {/* Stage Header with Controls */}
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
              ⚡ Reanimated HTML5 Canvas (60 FPS Pure Web Standards)
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
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
        <iframe
          key={`canvas-frame-${restartNonce}-${title}`}
          ref={iframeRef}
          srcDoc={iframeSrcDoc}
          sandbox="allow-scripts"
          title={`Playable Canvas Stage - ${title}`}
          className="w-full h-[400px] border-none block bg-black"
        />

        {/* Live FPS / Specs Badge */}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-900/60 z-30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>HTML5 CANVAS</span>
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
          Pure HTML5 Canvas • Zero Flash Plugin Required • 100% Web Standards
        </span>
      </div>
    </div>
  );
}
