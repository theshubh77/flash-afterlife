"use client";

import React from "react";
import { X, Flame, Shield, Unlock, HeartHandshake } from "lucide-react";

interface WhyOpenSourceManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyOpenSourceManifesto({ isOpen, onClose }: WhyOpenSourceManifestoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-xl">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl glass-panel-gold shadow-2xl overflow-hidden backdrop-blur-2xl border border-amber-500/30">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 glass-panel px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl glass-pill text-amber-300">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-300">
                Why Open Innovation Matters
              </h3>
              <p className="text-xs text-slate-400">
                The Open Source Manifesto for Digital Heritage Preservation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="glass-btn flex items-center justify-center rounded-xl p-2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-5 text-sm text-slate-200 leading-relaxed">
          {/* Section 1: Proprietary Gatekeeping */}
          <div className="rounded-2xl glass-card bg-red-500/[0.08] border-red-500/25 p-4.5">
            <h4 className="font-bold text-red-300 uppercase tracking-wide text-xs mb-1.5">
              The Tragedy of Proprietary Gatekeeping
            </h4>
            <p className="text-xs text-red-200/90 leading-relaxed">
              On December 31, 2020, Adobe pulled the plug on Flash Player. Over two decades of human
              creativity—indie games created by teenagers in their bedrooms, revolutionary web animations,
              and educational software—vanished overnight. When closed proprietary platforms decide cultural
              heritage is no longer profitable, they delete it.
            </p>
          </div>

          {/* Section 2: How Open AI Solves This */}
          <div>
            <h4 className="font-bold text-amber-300 uppercase tracking-wide text-xs mb-3">
              How Open Innovation Solves This
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl glass-card p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-300 mb-1.5">
                  <Unlock className="h-4 w-4" /> Open Weights
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed">
                  Gemma open weights ensure that code necromancy can run locally or anywhere without corporate license gatekeeping.
                </p>
              </div>

              <div className="rounded-2xl glass-card p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 mb-1.5">
                  <Shield className="h-4 w-4" /> Mastra Agents
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed">
                  Open-source agent orchestration normalizes undocumented bytecode into open web standards.
                </p>
              </div>

              <div className="rounded-2xl glass-card p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-300 mb-1.5">
                  <HeartHandshake className="h-4 w-4" /> Open Web
                </div>
                <p className="text-xs text-slate-300/90 leading-relaxed">
                  HTML5 Canvas and WebAssembly will never expire, ensuring games remain playable across generations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: The Día de los Muertos Philosophy */}
          <div className="rounded-2xl glass-card bg-amber-500/[0.05] border-amber-500/20 p-4.5">
            <h4 className="font-bold text-amber-300 uppercase tracking-wide text-xs mb-1.5">
              The Philosophy of the Digital Ofrenda
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Mexican tradition, Día de los Muertos teaches us that souls do not die when their bodies perish;
              they only die when they are forgotten. FlashAfterlife preserves early web creators&apos; legacies by honoring
              their original bytecode, paying tribute through Calaveritas, and reanimating their spirits into living,
              playable HTML5 code.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 glass-panel px-6 py-3.5 text-xs font-mono text-slate-400">
          <span>Hacktoberfest 2026: Week 4 Challenge</span>
          <span className="text-amber-300 font-bold">Built for Preservation</span>
        </div>
      </div>
    </div>
  );
}
