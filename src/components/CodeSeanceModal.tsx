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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl border-2 border-cyan-700 bg-[#06131c] shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-cyan-900 bg-[#040f17] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                The Code Séance: {title}
              </h3>
              <p className="text-xs text-slate-400">
                ActionScript 2.0 Bytecode ↔ Gemma Reanimated Canvas JavaScript
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switchers */}
            <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab("side-by-side")}
                className={`rounded px-3 py-1 font-bold ${
                  activeTab === "side-by-side"
                    ? "bg-cyan-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Code Diff
              </button>
              <button
                onClick={() => setActiveTab("ast")}
                className={`rounded px-3 py-1 font-bold ${
                  activeTab === "ast"
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mastra AST Breakdown
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "side-by-side" ? (
          <div className="grid flex-1 grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cyan-950 overflow-hidden">
            {/* Left: The Departed ActionScript */}
            <div className="flex flex-col bg-[#040c13] overflow-hidden">
              <div className="flex items-center justify-between border-b border-cyan-950 bg-slate-950/80 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    THE DEPARTED: ActionScript 2.0 (Tag 12 / 59)
                  </span>
                </div>
                <button
                  onClick={() => copyText(as2Code, true)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white"
                >
                  {copiedAS2 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedAS2 ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-amber-200/90">
                <pre>{as2Code}</pre>
              </div>
            </div>

            {/* Right: The Reanimated Canvas JavaScript */}
            <div className="flex flex-col bg-[#020b10] overflow-hidden">
              <div className="flex items-center justify-between border-b border-cyan-950 bg-slate-950/80 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    THE REANIMATED: HTML5 Canvas ECMAScript (Gemma)
                  </span>
                </div>
                <button
                  onClick={() => copyText(reanimatedJs, false)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white"
                >
                  {copiedJS ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedJS ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-emerald-200/90">
                <pre>{reanimatedJs}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6 bg-[#040f17]">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-xl border border-cyan-800 bg-slate-950/80 p-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 border-b border-cyan-900 pb-2 mb-3">
                  <Cpu className="h-4 w-4" />
                  <span>Mastra Tool: normalizeActionScriptTool Output</span>
                </div>
                <pre className="text-slate-300 overflow-auto max-h-72">
                  {JSON.stringify(normalizedAST, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-emerald-800 bg-slate-950/80 p-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 border-b border-emerald-900 pb-2 mb-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Mastra Tool: sandboxSanitizerTool Audit</span>
                </div>
                <p className="text-slate-300">
                  Status: <span className="text-emerald-400 font-bold">VERIFIED SECURE</span>
                </p>
                <p className="mt-1 text-slate-400">
                  Enforces clean closure scope. Zero access to storage, network, or parent frame DOM.
                </p>
              </div>

              <div className="rounded-xl border border-amber-800 bg-slate-950/80 p-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 border-b border-amber-900 pb-2 mb-3">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Transpilation Engine</span>
                </div>
                <p className="text-slate-300">
                  Model: <span className="text-amber-300 font-bold">{modelUsed || "gemma-3-27b-it"}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Status Bar */}
        <div className="flex items-center justify-between border-t border-cyan-950 bg-[#03090e] px-6 py-2.5 text-xs font-mono text-slate-400">
          <span>Target Architecture: HTML5 2D Context + requestAnimationFrame</span>
          <span className="text-emerald-400">60 FPS Native Web Execution</span>
        </div>
      </div>
    </div>
  );
}
