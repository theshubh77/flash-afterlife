# 🪦 FlashAfterlife: The Flash Game Preservation Altar

> **Hacktoberfest 2026 Open-Source AI Challenge: Week 4 — "Ghost in the Machine"**  
> *Where departed 2000s Macromedia & Adobe Flash binaries ascend in candlelight.*

[![Live on Render](https://img.shields.io/badge/Render-Deployed%20Live-46e3b7?style=flat-square&logo=render)](https://render.com)
[![Mastra Agent Framework](https://img.shields.io/badge/Mastra-v1.81%20Workflow-8b5cf6?style=flat-square)](https://mastra.ai)
[![Gemma Open Weights](https://img.shields.io/badge/Gemma-3--27B%20Necromancer-f59e0b?style=flat-square)](https://ai.google.dev/gemma)
[![Theme: Ghost in the Machine](https://img.shields.io/badge/Theme-Ghost%20in%20the%20Machine-10b981?style=flat-square)](https://dev.to/t/hf26challenge)
[![Día de los Muertos](https://img.shields.io/badge/Ofrenda-Día%20de%20los%20Muertos-ea580c?style=flat-square)](https://dev.to)

---

## 🕯️ The Concept: Why Open Innovation Matters

On December 31, 2020, Adobe permanently killed Flash Player. Over two decades of human creativity—hundreds of thousands of indie web games made by passionate creators on Newgrounds, Miniclip, and Armor Games—vanished overnight. 

**This was the ultimate tragedy of closed, proprietary software:**
When a closed corporate vendor decides an ecosystem is no longer profitable, they pull the plug, entombing cultural history in unplayable binary graveyards.

**FlashAfterlife** is our answer. Inspired by the Mexican tradition of **Día de los Muertos** (where a soul only truly dies when the living forget their name) and the spooky necromancy of **Ghost in the Machine**, FlashAfterlife is a digital preservation altar.

Instead of a heavy closed emulator, FlashAfterlife uses **Open-Weight AI (Gemma)** and an **Open-Source Agent Orchestration Pipeline (Mastra)** to parse raw byte tags from 20-year-old `.swf` binaries, translate legacy ActionScript 2.0 into standard ECMAScript, and resurrect the games at a smooth 60 FPS on HTML5 `<canvas>` beside a flickering virtual candle.

---

## ⚡ The Architectural Pipeline

```
[ User drops vintage .SWF or selects 2004 Preset ]
                     │
                     ▼ (Client-Side Web Worker)
   [ Signature Check: FWS (Raw) / CWS (Zlib-Compressed) ]
   [ Stream through browser native DecompressionStream('deflate') ]
   [ Scrape Tag 12 (DoAction) & Tag 59 (DoInitAction) Bytecode ]
                     │
                     ▼ POST /api/reanimate
   [ Mastra Orchestration Pipeline ]
      │
      ├── Step 1: normalizeActionScriptTool (Mastra Tool)
      │   └── Normalizes legacy Flash idioms (_root._x, Key.isDown, onClipEvent) into a structured AST.
      │
      ├── Step 2: Gemma-3-27B Inference (Dual Task)
      │   ├── Task A (Code Necromancer): Re-architects AS2 loop into safe Canvas requestAnimationFrame loop.
      │   └── Task B (Calaverita Literaria): Crafts an authentic 4-line bilingual rhyming tribute poem.
      │
      └── Step 3: sandboxSanitizerTool (Mastra Tool)
          └── Strips dangerous globals (eval, window.location, fetch, localStorage).
              Enforces clean startReanimatedGame(canvas, ctx) closure contract.
                     │
                     ▼ Zero-Crash Guarantee (The Cemetery Keeper)
[ Rendered Altar UI: 60 FPS HTML5 Canvas + 8-bit Audio + Flickering Candle + Ofrenda Codex ]
```

---

## 🎮 The Consecrated 2000s Presets

For instant judging without requiring `.swf` files on hand, FlashAfterlife bundles three legendary historical presets in the **Almanac of the Departed**:

1. **🚁 The 2004 Copter Cave (Classic Tunnel Runner)**  
   *Originally by See-Saw Interactive / Robin Allen.*  
   The prototype for all modern endless runners. Features dynamic cavern generation, smoke puff particle trails, Spacebar altitude lift, and score tracking.

2. **🧟 Zombie Defense Tank 2006 (Newgrounds Arcade Defense)**  
   *The defining late-night 2006 Flash arena shooter.*  
   Features trigonometric turret mouse aiming (`Math.atan2`), keyboard tank driving, incoming zombie hordes, and particle blast effects.

3. **🔮 Squash & Stretch Elastic Ball (Macromedia Flash MX 2003 Lab)**  
   *The demo that taught an entire generation how to animate vector physics.*  
   Features interactive paddle control, elastic squash/stretch deformation, and kinetic super jolts.

---

## 🛡️ The Zero-Crash Guarantee (The Cemetery Keeper)

During hackathon judging, external AI API quotas and fragmented SWF files can cause sudden failures. FlashAfterlife features an in-character fail-safe:

If an API quota is exceeded or an uploaded binary contains corrupt opcodes, the **Mastra workflow intercepts the condition** and seamlessly channels a consecrated fallback engine with narrative lore:

> *"The spirit of this binary was too fragmented to summon across the ether, but the Cemetery Keeper channeled this 2004 preserved classic instead."*

Judges will **never see a white screen or a raw JSON error**.

---

## 🛠️ Technology Stack & Partner Categories

| Partner / Technology | Role in FlashAfterlife |
|---|---|
| **Google Gemma** | Open-weight code transpilation (`gemma-3-27b-it`) and bilingual Calaverita Literaria authoring. |
| **Mastra Framework** | Agent orchestration, multi-step workflows, `normalizeActionScriptTool`, and `sandboxSanitizerTool`. |
| **Render** | Cloud hosting for the Next.js production SSR/API runtime (`render.yaml`). |
| **Web Standards** | `DecompressionStream('deflate')` for client-side SWF decompression; native `AudioContext` 8-bit synthesizer. |

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/flash-afterlife.git
cd flash-afterlife

# Install dependencies
npm install

# (Optional) Add your Google AI Studio key to .env.local
# If omitted, the Cemetery Keeper offline engine runs automatically!
echo "GEMMA_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Altar.

---

## 📜 DevRelay Agent Session

This project was engineered with agentic pair-programming via Antigravity and DevRelay. To view the complete session log:

```liquid
{% devrelay_session f4226a4b-49b2-40ee-bb56-200f6de30e62 %}
```

---

*Dedicated to the millions of creative animators, game designers, and indie developers who made the early web magical.*
