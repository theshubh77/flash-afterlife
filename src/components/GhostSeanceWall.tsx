"use client";

import React, { useState } from "react";
import { Send, Heart, Sparkles, MessageSquare, Flame } from "lucide-react";
import confetti from "canvas-confetti";
import { playBlip, playCalaveritaBell } from "@/lib/audio/retroSynth";
import { LottieAnimation } from "./LottieAnimation";

interface Tribute {
  id: string;
  game: string;
  message: string;
  user: string;
  date: string;
  likes: number;
}

const INITIAL_TRIBUTES: Tribute[] = [
  {
    id: "1",
    game: "Helicopter Game (2004)",
    message: "Playing in the middle school computer lab during lunch break! The smoke particle physics were mesmerizing.",
    user: "retro_pilot***@flash.org",
    date: "2026.10.31",
    likes: 42,
  },
  {
    id: "2",
    game: "Tank Blaster (2005)",
    message: "The 56k dial-up days on Miniclip. Waiting 10 minutes for the .swf preload bar to finish!",
    user: "tank_commander***@web.net",
    date: "2026.10.31",
    likes: 38,
  },
  {
    id: "3",
    game: "Alien Hominid (2002)",
    message: "Tom Fulp & Dan Paladin on Newgrounds. That was the game that proved indie Flash games could rival consoles.",
    user: "ng_veteran***@newgrounds.com",
    date: "2026.10.31",
    likes: 56,
  },
  {
    id: "4",
    game: "Fancy Pants Adventures",
    message: "Smooth ActionScript vector curve physics! Nothing on modern web canvas ever felt quite as responsive until now.",
    user: "brad_borne_fan***@gmail.com",
    date: "2026.10.30",
    likes: 29,
  },
  {
    id: "5",
    game: "Interactive Smash-the-Ghost",
    message: "ActionScript 2 on(release) sound effects were pure dopamine. Happy Día de los Muertos to all Flash souls!",
    user: "spooky_dev***@afterlife.ai",
    date: "2026.10.30",
    likes: 35,
  },
  {
    id: "6",
    game: "Macromedia Flash MX 2004",
    message: "Thank you for bringing these childhood games back to life! Playing these in 60 FPS without installing sketchy plugins feels like pure digital magic.",
    user: "cemetery_keeper***@muertos.dev",
    date: "2026.10.29",
    likes: 64,
  },
];

export function GhostSeanceWall() {
  const [tributes, setTributes] = useState<Tribute[]>(INITIAL_TRIBUTES);
  const [inputGame, setInputGame] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [page, setPage] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    playCalaveritaBell();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#ff7e00", "#ffd000", "#a855f7", "#ffffff"],
    });

    const newTribute: Tribute = {
      id: String(Date.now()),
      game: inputGame.trim() || "Lost Flash Classic",
      message: inputMessage.trim(),
      user: "ghost_traveler***@web.org",
      date: "2026.10.31",
      likes: 1,
    };

    setTributes([newTribute, ...tributes]);
    setInputMessage("");
    setInputGame("");
  };

  const handleLike = (id: string) => {
    playBlip();
    setTributes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  return (
    <section className="relative w-full rounded-3xl glass-panel p-6 sm:p-10 shadow-2xl overflow-hidden mt-12 border border-purple-500/20">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl -z-10" />

      {/* Floating Stars and Bats decoration */}
      <div className="pointer-events-none absolute top-4 left-8 text-amber-300/40 text-lg">✦</div>
      <div className="pointer-events-none absolute top-12 right-12 text-purple-300/40 text-sm">★</div>
      <div className="pointer-events-none absolute bottom-8 left-16 text-amber-400/30 text-xs">✦</div>

      {/* Ghost & Jack-o'-Lantern Mascot Header */}
      <div className="flex flex-col items-center text-center">
        {/* Floating Ghost popping out of Pumpkin */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Cute Speech Bubble */}
          <div className="speech-bubble px-4 py-2 mb-2 text-xs font-bold flex items-center gap-1.5 shadow-lg border border-purple-200">
            <span>Trick or Treat! Tell us your Flash memory!</span>
            <span className="text-amber-500 font-extrabold">🍬</span>
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Jack-o'-Lantern Base */}
            <div className="absolute -bottom-2 w-28 h-18 bg-gradient-to-t from-orange-600 to-amber-500 rounded-[50%_50%_45%_45%] border-2 border-amber-300 shadow-[0_0_30px_rgba(255,106,0,0.5)] flex items-center justify-center overflow-hidden z-10">
              {/* Carved Face Glow */}
              <div className="flex flex-col items-center gap-1 mt-3">
                <div className="flex gap-4">
                  <div className="w-2.5 h-2.5 bg-yellow-200 rotate-45 shadow-[0_0_8px_#ffd000]" />
                  <div className="w-2.5 h-2.5 bg-yellow-200 rotate-45 shadow-[0_0_8px_#ffd000]" />
                </div>
                <div className="w-6 h-2 bg-yellow-200 rounded-b-full shadow-[0_0_8px_#ffd000]" />
              </div>
            </div>

            {/* Ghost popping out */}
            <div className="relative -top-4 z-20 hover:scale-110 transition-transform cursor-pointer">
              <LottieAnimation type="ghost" className="w-28 h-28" />
            </div>
          </div>
        </div>

        {/* Candy Ribbon Badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
          <Flame className="h-3.5 w-3.5 text-slate-950 fill-slate-950" />
          <span>Community Séance • Ghost in the Machine</span>
        </div>

        <h3 className="mt-3 text-xl sm:text-2xl font-black text-white tracking-tight">
          Echoes from the Web Graveyard: <span className="text-amber-300">What Was Your Most Cherished Flash Memory?</span>
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-purple-200/80 max-w-xl">
          Leave a prayer or retro gaming recollection on the Eternal Flash Ofrenda. Preserved forever in modern canvas code.
        </p>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch rounded-2xl bg-[#1d0b38] border-2 border-orange-500/60 shadow-[0_0_25px_rgba(255,106,0,0.25)] overflow-hidden">
          <div className="flex-1 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-purple-500/20">
            <input
              type="text"
              value={inputGame}
              onChange={(e) => setInputGame(e.target.value)}
              placeholder="Flash Game / Studio (e.g. Helicopter 2004)"
              className="w-full sm:w-1/3 bg-transparent px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none"
            />
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tell your story... (Newgrounds, Miniclip, Kongregate)"
              className="w-full sm:w-2/3 bg-transparent px-4 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="candy-orange-btn px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Post Tribute</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Tributes Grid (Matching the 6 cards in inspiration image) */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-5xl mx-auto">
        {tributes.slice((page - 1) * 6, page * 6).map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl p-4 bg-[#230f3f]/80 border border-purple-500/20 hover:border-orange-500/40 transition-all hover:-translate-y-0.5 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 mb-1.5">
                <span className="font-bold truncate max-w-[150px]">{item.game}</span>
                <span className="text-[10px] text-purple-300/60">{item.date}</span>
              </div>
              <p className="text-xs text-purple-100/90 leading-relaxed font-sans line-clamp-3">
                &ldquo;{item.message}&rdquo;
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-purple-500/15 flex items-center justify-between text-[10px] text-purple-300/60 font-mono">
              <span className="truncate max-w-[130px]">{item.user}</span>
              <button
                type="button"
                onClick={() => handleLike(item.id)}
                className="flex items-center gap-1 text-orange-400 hover:text-amber-300 transition-colors"
              >
                <Heart className="h-3 w-3 fill-orange-400" />
                <span>{item.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar (Matching `< 1 2 3 4 5 >` in inspiration image) */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-purple-300/70">
        <button
          onClick={() => {
            playBlip();
            setPage(Math.max(1, page - 1));
          }}
          className="hover:text-white px-1.5 py-0.5 rounded"
        >
          &lt;
        </button>
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            onClick={() => {
              playBlip();
              setPage(p);
            }}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              page === p
                ? "bg-orange-500 text-slate-950 shadow-sm"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => {
            playBlip();
            setPage(Math.min(5, page + 1));
          }}
          className="hover:text-white px-1.5 py-0.5 rounded"
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

