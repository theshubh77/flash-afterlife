"use client";

import React from "react";
import { X, Flame, Shield, Unlock, HeartHandshake, ExternalLink } from "lucide-react";

interface WhyOpenSourceManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyOpenSourceManifesto({ isOpen, onClose }: WhyOpenSourceManifestoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border-2 border-amber-500/60 bg-[#0a1622] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 bg-[#07111c] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-amber-300">
                Why Open Innovation Matters
              </h3>
              <p className="text-xs text-slate-400">
                The Open Source Manifesto for Digital Heritage Preservation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6 text-sm text-slate-200 leading-relaxed">
          {/* Section 1: The Tragedy of Closed Software */}
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
            <h4 className="font-bold text-red-300 uppercase tracking-wide text-xs mb-1">
              The Tragedy of Proprietary Gatekeeping
            </h4>
            <p className="text-xs text-red-200/90">
              On December 31, 2020, Adobe permanently killed Flash Player. Over two decades of human
              creativity—indie games created by teenagers in their bedrooms, revolutionary web animations,
              and educational software—vanished overnight. The reason? Closed corporate ownership.
              When a closed platform decides your culture is no longer profitable, they pull the plug.
            </p>
          </div>

          {/* Section 2: How Open AI Breaks The Chains */}
          <div>
            <h4 className="font-bold text-amber-300 uppercase tracking-wide text-xs mb-2">
              How Open Innovation Solves This
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-cyan-800/60 bg-slate-950/80 p-3.5">
                <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
                  <Unlock className="h-4 w-4" />
                  <span>Open-Weight Models (Gemma)</span>
                </div>
                <p className="text-slate-400">
                  Gemma’s open weights mean anyone can run, fine-tune, or adapt the model locally.
                  No proprietary API vendor can revoke your access or pull the plug on your cultural
                  preservation tools.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-800/60 bg-slate-950/80 p-3.5">
                <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
                  <Shield className="h-4 w-4" />
                  <span>Open Agent Frameworks (Mastra)</span>
                </div>
                <p className="text-slate-400">
                  Mastra’s open-source architecture enables transparent AST normalization,
                  sandboxed security audits, and zero-crash fallbacks. Everything runs visibly
                  without hidden black-box intermediaries.
                </p>
              </div>

              <div className="rounded-xl border border-amber-800/60 bg-slate-950/80 p-3.5">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                  <HeartHandshake className="h-4 w-4" />
                  <span>Open Web Standards (HTML5)</span>
                </div>
                <p className="text-slate-400">
                  By reanimating games to pure Canvas and Web Audio, games run universally on every
                  device—laptops, phones, tablets—with zero plugin downloads and no vendor lock-in.
                </p>
              </div>

              <div className="rounded-xl border border-purple-800/60 bg-slate-950/80 p-3.5">
                <div className="flex items-center gap-2 font-bold text-purple-300 mb-1">
                  <Flame className="h-4 w-4" />
                  <span>Works with Lights Off</span>
                </div>
                <p className="text-slate-400">
                  Because our decompression runs client-side via DecompressionStream, and our
                  engine has offline Gemma fallback, the altar continues glowing even without
                  an internet connection.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: The Día de los Muertos Spirit */}
          <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-[#201504] to-[#120a02] p-4 text-xs">
            <span className="font-bold text-amber-300 uppercase tracking-wide">
              The Spirit of the Ofrenda
            </span>
            <p className="mt-1 text-amber-100/90 italic">
              &ldquo;In Mexican tradition, a soul only truly dies when the living forget to speak their name.
              FlashAfterlife ensures the architects of the early web are remembered, celebrated, and played
              for generations to come.&rdquo;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-amber-500/30 bg-[#07111c] px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Hacktoberfest 2026: Week 4 &ldquo;Ghost in the Machine&rdquo;
          </span>
          <button
            onClick={onClose}
            className="gold-flame-btn rounded-lg px-4 py-1.5 text-xs font-bold text-slate-950 uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

