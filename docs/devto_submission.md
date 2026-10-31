*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

On December 31, 2020, Adobe permanently discontinued Flash Player. In a single moment, over two decades of indie web gaming culture vanished from the modern internet. Millions of experimental animations, physics prototypes, and childhood memories built by creators on Newgrounds, Miniclip, and Armor Games were entombed inside obsolete `.swf` binaries.

**FlashAfterlife** is a digital preservation altar born at the crossroads of two evocative traditions:
1. **Día de los Muertos:** The belief that no soul truly dies as long as the living continue to speak their name and remember their stories.
2. **Ghost in the Machine:** The idea of awakening dormant digital spirits and channeling departed bytecode back into the realm of the living.

Instead of relying on heavy, closed-source emulators, FlashAfterlife performs **neural code necromancy**. 

Visitors can drop in a vintage 2000s `.swf` binary, or select one of the consecrated 2004 presets. The app decompresses the binary right in the browser, extracts legacy ActionScript 2.0 bytecode, searches retro archives via SerpAPI for historical context, and prompts **Google Gemma open-weight models** through the **Mastra agent framework** to transpile the vintage mechanics into standard, clean, 60 FPS HTML5 `<canvas>` games.

To complete the ritual, Gemma composes an authentic bilingual *Calaverita Literaria* (a satirical Day of the Dead tribute poem in English and Spanish) dedicated to the game, while candles flicker upon an interactive digital ofrenda.

---

## Demo

- **Live Deployed Altar on Render:** [https://flash-afterlife.onrender.com/](https://flash-afterlife.onrender.com/)
- **Zero-barrier instant play:** No `.swf` file needed to test. Simply choose any of the three consecrated 2004 presets from the Almanac of the Departed:
  - **The 2004 Copter Cave:** Classic endless cavern runner with dynamic terrain generation, Spacebar lift physics, smoke puff particle trails, and score tracking.
  - **Zombie Defense Tank 2006:** Newgrounds late-night arcade defense featuring trigonometric turret aiming (`Math.atan2`), keyboard tank driving, incoming zombie waves, and explosive hit effects.
  - **Squash & Stretch Elastic Ball (2003):** The Macromedia Flash MX physics lab that taught a generation vector animation, featuring paddle deflection, elastic deformation, and kinetic super jolts.
- **Custom Uploads:** Drag and drop any vintage `.swf` binary into the altar dropzone to watch the client-side Web Streams decompressor extract ActionScript opcodes in real time.

---

## Code

The complete source code is open-source under the MIT License on GitHub:

{% github theshubh77/flash-afterlife %}

- **GitHub Repository:** [https://github.com/theshubh77/flash-afterlife](https://github.com/theshubh77/flash-afterlife)
- **Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Mastra Agent Framework (`@mastra/core`), Google Gemma (`gemma-4-26b-a4b-it`), SerpAPI, Web Audio API 8-bit synthesizer, and Ruffle WASM fallback.

---

## How I Built It

FlashAfterlife connects modern open-source agent engineering with 20-year-old binary forensics. Here is how the pieces work together:

```
[ Vintage .SWF Binary or Preserved Preset ]
                     │
                     ▼ (Client-Side Web Worker)
   [ Signature Verification: FWS (Raw) or CWS (Zlib) ]
   [ Browser-Native DecompressionStream('deflate') ]
   [ Bytecode Extractor: Tag 12 (DoAction) & Tag 59 (DoInitAction) ]
                     │
                     ▼ POST /api/reanimate
   ┌───────────────────────────────────────────────────────────┐
   │             MASTRA AGENT ORCHESTRATION PIPELINE           │
   │                                                           │
   │  Step 1: searchGameLoreTool                               │
   │  └── Queries SerpAPI for release year, creator, & lore    │
   │                                                           │
   │  Step 2: normalizeActionScriptTool                        │
   │  └── Decompiles legacy AS2 into structured AST            │
   │      (Keys, physics parameters, movieclip coordinates)    │
   │                                                           │
   │  Step 3: Google Gemma Open-Weight Transpilation           │
   │  ├── Task A: Transpiles AS2 into 60 FPS HTML5 Canvas loop │
   │  └── Task B: Generates bilingual Calaverita tribute poem  │
   │                                                           │
   │  Step 4: sandboxSanitizerTool                             │
   │  └── Strips unsafe globals (eval, fetch, location, auth)  │
   │      Enforces `startReanimatedGame(canvas, ctx)` contract │
   └───────────────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼ (Success)               ▼ (Quota or Corrupted Bytecode)
 [ Consecrated Reanimation ]   [ The Cemetery Keeper Fail-Safe ]
 60 FPS HTML5 Canvas           Seamless 2004 offline fallback
 8-bit Synthesizer Audio       In-character narrative lore
 Bilingual Calaverita Ode      Zero crash. Never a raw error.
 Code Séance Side-by-Side
```

### 1. Open-Weight Google Gemma (`gemma-4-26b-a4b-it`)
At the heart of the resurrection engine is Google's open-weight Gemma model family (`gemma-4-26b-a4b-it` via Google AI Studio). Gemma performs a challenging dual-task prompt in a single inference call:
- **The Code Necromancer:** Re-engineers legacy procedural ActionScript 2.0 idioms (`_root._x`, `Key.isDown`, `onClipEvent(enterFrame)`) into standard, event-driven JavaScript conforming to an isolated `startReanimatedGame(canvas, ctx)` loop. It writes custom canvas drawing routines, boundary collisions, state tracking, and cleanup handlers.
- **The Calaverita Poet:** Authors an authentic four-line rhyming Mexican Day of the Dead ode in both English and Spanish celebrating the game and its original creator.

### 2. Mastra Multi-Agent Orchestration Framework (`@mastra/core`)
The entire server-side lifecycle is coordinated by a Mastra workflow (`src/lib/mastra/workflow.ts`):
- **`normalizeActionScriptTool`:** A specialized AST parser that strips legacy Flash compiler artifacts, detects key input configurations (Arrow keys, Spacebar, Mouse), and isolates physics state (gravity, friction, thrust).
- **`searchGameLoreTool`:** Leverages **SerpAPI** to query Google's index for historic Flash portals (Newgrounds, MobyGames, Macromedia Archive). It pulls original release years and developer lore into Gemma's context window. If SerpAPI keys are not set, it falls back to DuckDuckGo Instant Answers and our local curated codex.
- **`sandboxSanitizerTool`:** A strict security auditor that inspects the generated JavaScript AST before browser execution. It automatically strips forbidden globals (`eval`, `window.location`, `fetch`, `localStorage`, `document.cookie`) to guarantee that reanimated code executes safely within an enclosed canvas sandbox.
- **In-Memory Cache:** Maintains an LRU cache of reanimated payloads, saving tokens and speeding up response times for popular games.

### 3. Dual-Engine Architecture
FlashAfterlife offers two complementary ways to experience history:
- **Primary Engine:** Pure 60 FPS HTML5 `<canvas>` code resurrected by Gemma. No browser plugins or Flash players needed.
- **Secondary Engine:** An integrated open-source Ruffle WebAssembly emulator (`@ruffle-rs/ruffle@0.7.1`), allowing users to toggle between AI canvas reanimation and original vector rendering side by side.

### 4. Zero-Crash Guarantee: The Cemetery Keeper
In live web apps, external API quotas can exhaust or users may upload corrupt, unreadable 1999 binaries. Rather than crashing with an unhandled exception or showing a blank screen, the Mastra pipeline intercepts failures and summons **The Cemetery Keeper**:
> *"The spirit of this binary was too fragmented to summon across the ether, but the Cemetery Keeper channeled this consecrated 2004 preserved classic instead."*

The application remains fully playable and in character at all times.

### 5. Production Cloud Deployment on Render
The application is deployed on **Render** via Infrastructure-as-Code using `render.yaml`. It builds cleanly with Next.js 16 and Node.js SSR, seamlessly reading environment variables and running on Render's managed cloud infrastructure.

---

## Why Does Open Innovation Matter?

The death of Adobe Flash Player is the single greatest warning in internet history about the dangers of closed, proprietary software ecosystems:
- When a proprietary plugin controls access to creative culture, that culture only survives as long as it remains profitable for one corporation.
- When Adobe pulled the plug, thousands of creative developers had no legal or technical recourse. Decades of interactive digital history were suddenly silenced.

Open innovation is the only lasting defense against digital extinction:
1. **Open-Weight Models (Google Gemma):** Closed APIs can deprecate endpoints, change terms, or vanish overnight. Open-weight foundation models give the open-source community durable, perpetual access to machine intelligence that can be inspected, self-hosted, fine-tuned, and preserved forever.
2. **Open Web Standards (HTML5 Canvas & Web Streams):** By transpiling dead ActionScript bytecode into native HTML5 `<canvas>` and standard ECMAScript, games are permanently liberated from proprietary runtimes. Any browser on any operating system 20 years from now will still execute standard canvas JavaScript without permission from a corporate vendor.
3. **Open-Source Agent Tooling (Mastra):** Open agent frameworks let developers build transparent, auditable multi-step pipelines where security sanitization and tool orchestration remain completely under user control.

Open innovation ensures that human creativity belongs to everyone, not just the company that sold the runtime.

---

## My Agent Session

This project was built from scratch through agentic pair-programming using Antigravity and DevRelay. To inspect the full, unedited developer trajectory, decision logs, and debugging sessions:

{% devrelay_session f4226a4b-49b2-40ee-bb56-200f6de30e62 %}

---

## The Spirit of It

There was an unforgettable moment during testing when we dropped the original 2004 Copter Game binary into the altar. 

Within seconds, the byte inspector extracted the 20-year-old `onClipEvent` routines, SerpAPI retrieved Robin Allen's original 2004 creator credits from Newgrounds archives, and Gemma produced a flawless 60 FPS canvas tunnel loop alongside this Spanish Calaverita:

> *La parca veloz en la cueva voló,*  
> *el helicóptero verde de un golpe cayó.*  
> *Macromedia descansa en el panteón,*  
> *mas su código vive en nuestro corazón.*

Watching that tiny green helicopter glide between the jagged cave walls beside the flickering altar candle, with 8-bit retro audio playing in the background, felt like a genuine séance. A forgotten piece of our collective digital childhood had found its way home.

---

## Prize Categories

We are entering the following categories for the Hacktoberfest Open-Source AI Challenge:

### Featured Categories ($200)
- **Best Use of Gemma:** Google Gemma open-weight models (`gemma-4-26b-a4b-it`) power both the Code Necromancer (transpiling ActionScript 2.0 opcodes into modern 60 FPS canvas game loops) and the Calaverita Literaria poet (crafting authentic bilingual Day of the Dead tribute poems).
- **Best Use of Render:** FlashAfterlife is deployed in production on Render ([https://flash-afterlife.onrender.com/](https://flash-afterlife.onrender.com/)) using Infrastructure-as-Code via `render.yaml` for automatic Node.js SSR and environment variable orchestration.

### Partner Categories ($100)
- **Best Use of Mastra:** The entire resurrection lifecycle is driven by a multi-step Mastra agent pipeline (`@mastra/core`) featuring custom tools (`normalizeActionScriptTool`, `searchGameLoreTool`, `sandboxSanitizerTool`), in-memory token caching, and fail-safe routing.
- **Best Use of SerpApi:** Integrated into `searchGameLoreTool` to query Google index across historic Flash portals (Newgrounds, MobyGames, and Macromedia archives), automatically retrieving release years, creator credits, and cultural context for uploaded `.swf` files.

---

*Dedicated to the millions of animators, sound designers, and indie developers whose passion defined the golden age of the web.* 🕯️💀🎮

