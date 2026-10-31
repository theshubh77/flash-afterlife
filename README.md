# 🪦 FlashAfterlife: The Flash Game Preservation Altar

> **Hacktoberfest 2026 Open-Source AI Challenge: Week 4 "Ghost in the Machine"**  
> *Where departed 2000s Macromedia & Adobe Flash binaries ascend into native HTML5 through open-weight neural necromancy.*  
> 
> 🎮 **Live Altar:** [https://flash-afterlife.onrender.com/](https://flash-afterlife.onrender.com/)

---

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Week%204%3A%20Ghost%20in%20the%20Machine-ff7a00?style=for-the-badge&logo=hacktoberfest&logoColor=white)](https://dev.to/t/hf26challenge)
[![Google Gemma](https://img.shields.io/badge/Google%20Gemma-Open--Weights%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/gemma)
[![Mastra Agent Framework](https://img.shields.io/badge/Mastra-Multi--Step%20Agentic%20Workflow-8b5cf6?style=for-the-badge&logo=typescript&logoColor=white)](https://mastra.ai)
[![SerpAPI](https://img.shields.io/badge/SerpAPI-Retro%20Gaming%20Lore%20Search-34A853?style=for-the-badge&logo=google-search&logoColor=white)](https://serpapi.com)
[![Deployed on Render](https://img.shields.io/badge/Render-Deployed%20Live-46e3b7?style=for-the-badge&logo=render&logoColor=black)](https://flash-afterlife.onrender.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js%2016-React%2019%20%2B%20Tailwind%20v4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🕯️ The Mission: Why Open Innovation Matters

On December 31, 2020, Adobe pulled the plug on Flash Player. Overnight, over **two decades of human internet culture**, hundreds of thousands of handcrafted browser games, interactive animations, and creative experiments forged on Newgrounds, Miniclip, and Armor Games, vanished from the living web.

### The Tragedy of Closed, Proprietary Systems
When software depends on a closed corporate vendor's proprietary runtime, it lives on borrowed time. When maintenance becomes unprofitable, the plug is pulled, entombing historic art and gameplay mechanics in unplayable `.swf` binary graveyards.

### The Open-Source Resurrection
**FlashAfterlife** marries the Mexican tradition of **Día de los Muertos** (*where spirits live on as long as the living speak their names*) with the spooky ethos of **Ghost in the Machine**. 

Instead of relying on heavy, closed-source emulators, FlashAfterlife uses **Open-Weight AI (Google Gemma)** orchestrated by the **Mastra Agent Framework** to perform neural code necromancy:
1. Decompresses raw `.swf` binaries right in your browser.
2. Extracts legacy ActionScript 2.0 bytecode (Tag 12 & Tag 59).
3. Queries retro gaming archives via **SerpAPI** for cultural context and creator credits.
4. Normalizes legacy ActionScript idioms (`_root`, `Key.isDown`, `onClipEvent`) via Mastra tools into a structured Abstract Syntax Tree (AST).
5. Prompts **open-weight Gemma** to re-architect dead bytecode into modern, clean, sandboxed 60 FPS HTML5 `<canvas>` JavaScript.
6. Crafts authentic bilingual *Calaveritas Literarias* (satirical Day of the Dead poems in English and Spanish) honoring the game's cultural legacy.

---

## 🧠 Core Technologies Explained

### 1. 🔮 Open-Weight Google Gemma (`gemma-4-26b-a4b-it`)
We deliberately employ **open-weight foundation models** (`gemma-4-26b-a4b-it` accessible via Google AI Studio API) rather than closed, opaque APIs. Open weights embody the very essence of software preservation: transparent, modifiable, and democratized AI.

Gemma serves a dual function in the resurrection pipeline:
- **The Code Necromancer:** Translates obsolete procedural ActionScript 2.0 paradigms into modern, event-driven `requestAnimationFrame` game loops. It reproduces core mechanics, coordinate boundaries, user controls, and retro graphics drawing routines on HTML5 Canvas.
- **The Calaverita Poet:** Composes an authentic 4-line rhyming Mexican *Calaverita Literaria* in both English and Spanish, celebrating the game's year of release and memorializing its creators.

### 2. ⚡ Mastra Multi-Agent Framework (`@mastra/core`)
The entire resurrection pipeline is orchestrated through a robust multi-step Mastra agent workflow (`src/lib/mastra/workflow.ts`):
- **`normalizeActionScriptTool`**: Parses raw AS2 opcodes, identifies key input bindings (Arrow Keys, Spacebar, Mouse), physics parameters (gravity, thrust, friction), and variable state, compiling them into a structured AST.
- **`searchGameLoreTool`**: Discovers the game's historical context, release year, and original developer by integrating with **SerpAPI** and retro web archives.
- **`sandboxSanitizerTool`**: Performs automated AST code auditing before execution. It strips dangerous browser globals (`eval`, `window.location`, `fetch`, `localStorage`, cookie manipulation) and verifies that the output conforms strictly to the `startReanimatedGame(canvas, ctx)` execution closure.
- **In-Memory LRU Cache & Rate-Limit Resilience:** Caches reanimation responses in memory to prevent duplicate token consumption when visitors re-play or test popular games.

### 3. 🌐 SerpAPI: Live Retro Gaming Lore Scraping
When users upload custom or obscure `.swf` files, **SerpAPI** (`src/lib/mastra/tools/searchGameLore.ts`) dynamically searches Google index for classic Flash portals (Newgrounds, MobyGames, Macromedia Archive, AddictingGames).
- Automatically parses historical release years, original animator handles, and cultural reviews.
- Provides context directly to Gemma, enabling the AI to generate accurate historical Calaveritas and game mechanics.
- **Zero-Config Fallback:** If SerpAPI keys are not set, the workflow seamlessly falls back to DuckDuckGo Instant Answers and a curated local almanac archive.

### 4. 🚀 Production Deployment on Render
FlashAfterlife is deployed live on **Render** at [https://flash-afterlife.onrender.com/](https://flash-afterlife.onrender.com/):
- Fully configured via Infrastructure-as-Code with [`render.yaml`](file:///d:/All%20Data/Work/Projects/flash-afterlife/render.yaml) describing the Node.js web service, build steps, and environment variable bindings.
- Automatic server-side rendering (SSR) and API routes with zero server overhead.

---

## 🏛️ System Architecture

```
[ User Drops Vintage .SWF or Selects 2004 Preset ]
                         │
                         ▼ (Browser Client-Side Web Worker)
   [ Byte Header Inspection: FWS (Uncompressed) or CWS (Zlib-Compressed) ]
   [ In-Browser Decompression via Native DecompressionStream('deflate') ]
   [ Bytecode Scraper: Extracts Tag 12 (DoAction) & Tag 59 (DoInitAction) ]
                         │
                         ▼ POST /api/reanimate
   ┌───────────────────────────────────────────────────────────┐
   │             MASTRA AGENT ORCHESTRATION PIPELINE           │
   │                                                           │
   │  Step 1: searchGameLoreTool                               │
   │  └── Queries SerpAPI / Web Archive for creator & lore     │
   │                                                           │
   │  Step 2: normalizeActionScriptTool                        │
   │  └── Decompiles legacy AS2 into structured AST            │
   │      (Key bindings, physics variables, movieclips)        │
   │                                                           │
   │  Step 3: Google Gemma Open-Weight Transpilation           │
   │  ├── Task A: Translates AS2 into 60 FPS HTML5 Canvas loop │
   │  └── Task B: Bilingual Calaverita Literaria composition   │
   │                                                           │
   │  Step 4: sandboxSanitizerTool                             │
   │  └── Strips unsafe globals (eval, fetch, location, auth)  │
   │      Enforces `startReanimatedGame(canvas, ctx)` closure  │
   └───────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼ (Success)                       ▼ (API Quota or Corrupt Bytecode)
 [ Consecrated Reanimation ]      [ The Cemetery Keeper Fail-Safe ]
 60 FPS HTML5 Canvas              Channels offline 2004 classic fallback
 8-bit Synthesizer Audio          Narrative lore: "Keeper protected the altar"
 Bilingual Calaverita Ode         Zero crash. Never a white screen.
 Code Séance Side-by-Side
```

---

## 🎮 Dual-Engine Architecture & Presets

FlashAfterlife features a **Dual-Engine System**:
1. **Primary Engine (Neural Canvas):** 60 FPS native modern HTML5 `<canvas>` transpiled by Gemma. No external plugins, no Flash runtime required.
2. **Secondary Engine (Ruffle WASM Fallback):** Integrated with the open-source Ruffle WebAssembly emulator (`@ruffle-rs/ruffle@0.7.1`), allowing users to toggle and compare original vector rendering against modern canvas output side-by-side.

### Consecrated 2000s Presets (Instant Play)
For testing and hackathon judging without requiring a `.swf` file on hand, the altar comes pre-loaded with three iconic preserved titles:

| Preset Game | Original Era | Genre & Mechanics |
|---|---|---|
| **🚁 The 2004 Copter Cave** | 2004 (Robin Allen / See-Saw) | The grand ancestor of Flappy Bird & endless runners. Dynamic cavern generation, smoke puff particle physics, Spacebar lift, and collision detection. |
| **🧟 Zombie Defense Tank 2006** | 2006 (Newgrounds Arena) | Late-night arcade defense. Trigonometric turret mouse aiming (`Math.atan2`), keyboard tank driving, zombie swarm waves, and kinetic particle bursts. |
| **🔮 Squash & Stretch Elastic Ball** | 2003 (Macromedia Flash MX Lab) | The classic vector animation tutorial that taught a generation. Interactive paddle control, elastic squash/stretch deformation, and kinetic super jolts. |

---

## 🛡️ The Zero-Crash Guarantee (The Cemetery Keeper)

During live judging or peak hackathon traffic, external API quotas may temporarily exhaust, or users may upload corrupt, unreadable 90s binaries.

**In FlashAfterlife, users and judges will never see a blank screen, an unhandled exception, or a raw JSON error.**

If Gemma's API quota is exceeded or an uploaded file contains missing opcodes, the **Cemetery Keeper fail-safe** activates automatically:
> *"The spirit of this binary was too fragmented to summon across the ether, but the Cemetery Keeper channeled this consecrated 2004 preserved classic instead."*

The altar remains fully functional, playable, and in character at all times.

---

## ✨ Features at a Glance

- **Digital Ofrenda:** Interactive altar with flickering candles, pan de muerto, copal incense, marigold petals, and sugar skulls.
- **In-Browser SWF Decompressor:** Client-side zlib decompression using Web Streams API with zero binary uploads required to external servers.
- **The Code Séance Inspector:** Side-by-side modal displaying the original raw ActionScript 2.0 bytecode alongside Gemma's sanitized, modern JavaScript transpilation.
- **Ghost Séance Wall:** Community memorial board where visitors can leave heartfelt epitaphs and remembrances for dead games.
- **8-Bit Retro Synthesizer:** Built-in Web Audio API sound generator producing authentic arcade sound effects (jump, laser, hit, explosion, coin).
- **Typography & Aesthetics:** Styled in Google Font **Quicksand** with dark aesthetic accents (cempasúchil orange `#f97316`, candle gold `#eab308`, spirit purple `#a855f7`).

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) (v18.18.0 or newer recommended)
- `npm` or `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/theshubh77/flash-afterlife.git
cd flash-afterlife
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template configuration:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your free-tier keys:
```env
# Google AI Studio API Key (Free Tier)
# Get yours at: https://aistudio.google.com/app/apikey
GEMMA_API_KEY=your_google_ai_studio_api_key_here

# Open-Weight Gemma Model Name
GEMMA_MODEL_NAME=gemma-4-26b-a4b-it

# SerpAPI Key (Free Tier: 100 free searches/month)
# Get yours at: https://serpapi.com
SERPAPI_API_KEY=your_serpapi_key_here
```

> **Note:** If API keys are omitted, the application runs gracefully using the Cemetery Keeper offline engine and curated lore archives!

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🚢 Deploying to Render

This project is ready to deploy directly to **Render** using the included [`render.yaml`](file:///d:/All%20Data/Work/Projects/flash-afterlife/render.yaml).

### Step-by-Step Deployment:
1. Fork or push this repository to your GitHub account.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Blueprint**.
4. Connect your `flash-afterlife` repository.
5. Render will automatically parse `render.yaml` and configure the Web Service:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
6. Under **Environment Variables**, add:
   - `GEMMA_API_KEY`: Your Google AI Studio API key.
   - `GEMMA_MODEL_NAME`: `gemma-4-26b-a4b-it`
   - `SERPAPI_API_KEY`: Your SerpAPI key (optional).
7. Click **Apply**. Your Altar will be live on Render in minutes!

Live Production URL: [https://flash-afterlife.onrender.com/](https://flash-afterlife.onrender.com/)

---

## 🎃 Hacktoberfest 2026 Contributing Guide

We welcome contributions from open-source developers worldwide during **Hacktoberfest 2026**!

### How You Can Contribute:
- **Add Preserved Presets:** Add classic 2000s ActionScript game loops to [`src/lib/presets/flashPresets.ts`](file:///d:/All%20Data/Work/Projects/flash-afterlife/src/lib/presets/flashPresets.ts).
- **Expand AS2 AST Rules:** Enhance [`src/lib/mastra/tools/normalizeActionScript.ts`](file:///d:/All%20Data/Work/Projects/flash-afterlife/src/lib/mastra/tools/normalizeActionScript.ts) to recognize more complex ActionScript 2.0 tags (`MovieClipLoader`, `Sound.attachSound`, matrix math).
- **Improve Gemma Prompts:** Refine the prompt engineering in [`src/lib/mastra/workflow.ts`](file:///d:/All%20Data/Work/Projects/flash-afterlife/src/lib/mastra/workflow.ts) to generate even tighter, higher-FPS canvas routines.
- **Accessibility & Mobile Touch Controls:** Add on-screen virtual d-pad controls for mobile and tablet browsers.

### Submission Guidelines:
1. Fork the repo and create your branch: `git checkout -b feature/amazing-feature`.
2. Ensure TypeScript compiles without errors: `npx tsc --noEmit`.
3. Commit your changes: `git commit -m 'feat: add Alien Hominid preset'`.
4. Push to your fork and submit a Pull Request!

---

## 📜 DevRelay Session & Agentic Development

This project was developed with agentic pair-programming via **Antigravity** and **DevRelay**. To inspect the preserved development session transcript:

```liquid
{% devrelay_session f4226a4b-49b2-40ee-bb56-200f6de30e62 %}
```

---

## ⚖️ License

Distributed under the **MIT License**. See [`LICENSE`](file:///d:/All%20Data/Work/Projects/flash-afterlife/LICENSE) for more information.

---

## 💐 Acknowledgments & Dedication

- **To the Early Web Creators:** Dedicated to the millions of animators, indie developers, and musicians on Newgrounds, Miniclip, Armor Games, Kongregate, and DeviantArt whose passion defined a golden era of digital creativity.
- **Hacktoberfest 2026 & DEV Community:** For fostering the spirit of open-source innovation and challenging developers to revive the "Ghost in the Machine".
- **Google Gemma Team:** For empowering open-source AI with world-class open-weight foundation models.
- **Mastra AI Team:** For creating an intuitive, TypeScript-first agent orchestration framework.
- **The Ruffle Project:** For fighting tirelessly to preserve Flash heritage through open-source WebAssembly.

---

*“No game is truly dead while candles burn upon the altar of remembrance.”* 🕯️🎮💀
