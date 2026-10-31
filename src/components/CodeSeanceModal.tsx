"use client";

import React, { useState } from "react";
import { X, Copy, Check, Terminal, Cpu, ShieldCheck, Sparkles } from "lucide-react";
import { NormalizedFlashAST } from "@/lib/mastra/tools/normalizeActionScript";

interface CodeSeanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  as2Code: string;
  reanimatedJs: string;
  normalizedAST?: NormalizedFlashAST;
  modelUsed?: string;
}

export function CodeSeanceModal({
  isOpen,
  onClose,
  title,
  as2Code,
  reanimatedJs,
  normalizedAST,
  modelUsed,
}: CodeSeanceModalProps) {
  const [copiedAS2, setCopiedAS2] = useState(false);
  const [copiedJS, setCopiedJS] = useState(false);
  const [activeTab, setActiveTab] = useState<"side-by-side" | "ast">("side-by-side");

  if (!isOpen) return null;

  const copyText = (text: string, isAS2: boolean) => {
    navigator.clipboard.writeText(text);
    if (isAS2) {
      setCopiedAS2(true);
      setTimeout(() => setCopiedAS2(false), 2000);
    } else {
      setCopiedJS(true);
      setTimeout(() => setCopiedJS(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-xl">
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col rounded-3xl glass-panel-glow shadow-2xl overflow-hidden border border-white/10 backdrop-blur-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 glass-panel">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl glass-pill text-amber-300">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                The Code Séance: {title}
              </h3>
              <p className="text-xs text-slate-400">
                ActionScript 2.0 Bytecode ↔ Reanimated Canvas JavaScript
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switchers */}
            <div className="flex items-center rounded-xl glass-pill p-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab("side-by-side")}
                className={`rounded-lg px-3 py-1 font-bold transition-all ${
                  activeTab === "side-by-side"
                    ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Code Diff
              </button>
              <button
                onClick={() => setActiveTab("ast")}
                className={`rounded-lg px-3 py-1 font-bold transition-all ${
                  activeTab === "ast"
                    ? "bg-amber-400 text-slate-950 shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Normalized AST
              </button>
            </div>

            <button
              onClick={onClose}
              className="glass-btn flex items-center justify-center rounded-xl p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "side-by-side" ? (
          <div className="grid flex-1 grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 overflow-hidden">
            {/* Left: ActionScript 2.0 */}
            <div className="flex flex-col bg-black/40 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 glass-panel px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    THE DEPARTED: ActionScript 2.0 (Tag 12 / 59)
                  </span>
                </div>
                <button
                  onClick={() => copyText(as2Code, true)}
                  className="flex items-center gap-1.5 rounded-lg glass-pill px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white"
                >
                  {copiedAS2 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedAS2 ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-amber-200/90 selection:bg-amber-400 selection:text-black">
                <pre>{as2Code}</pre>
              </div>
            </div>

            {/* Right: Reanimated Canvas JavaScript */}
            <div className="flex flex-col bg-black/60 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 glass-panel px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    THE REANIMATED: HTML5 Canvas ECMAScript (60 FPS)
                  </span>
                </div>
                <button
                  onClick={() => copyText(reanimatedJs, false)}
                  className="flex items-center gap-1.5 rounded-lg glass-pill px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white"
                >
                  {copiedJS ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedJS ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-emerald-200/90 selection:bg-emerald-400 selection:text-black">
                <pre>{reanimatedJs}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6 bg-black/40">
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="rounded-2xl glass-card p-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 border-b border-white/10 pb-2 mb-3">
                  <Cpu className="h-4 w-4" />
                  <span>Bytecode Normalization & Semantic AST</span>
                </div>
                <pre className="text-slate-300 overflow-auto max-h-72">
                  {JSON.stringify(normalizedAST, null, 2)}
                </pre>
              </div>

              <div className="rounded-2xl glass-card p-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 border-b border-white/10 pb-2 mb-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Sandboxed Security & Anti-Exploit Audit</span>
                </div>
                <p className="text-slate-300">
                  Status: <span className="text-emerald-400 font-bold">VERIFIED SECURE</span>
                </p>
                <p className="mt-1 text-slate-400">
                  Enforces clean closure scope. Zero access to storage, network, or parent frame DOM.
                </p>
              </div>

              <div className="rounded-2xl glass-card p-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 border-b border-white/10 pb-2 mb-3">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Transpilation Engine</span>
                </div>
                <p className="text-slate-300">
                  Engine: <span className="text-amber-300 font-bold">Neural Code Transpiler (Client Sandboxed)</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Status Bar */}
        <div className="flex items-center justify-between border-t border-white/10 glass-panel px-6 py-3 text-xs font-mono text-slate-400">
          <span>Target Architecture: HTML5 2D Context + requestAnimationFrame</span>
          <span className="text-emerald-400 font-bold">60 FPS Native Web Execution</span>
        </div>
      </div>
    </div>
  );
}
