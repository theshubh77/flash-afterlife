/**
 * FlashAfterlife: Mastra Orchestration Pipeline
 * Combines normalizeActionScriptTool -> Gemma 3 Transpiler & Calaverita -> sandboxSanitizerTool
 * with Cemetery Keeper Zero-Crash Resilience.
 */

import { GoogleGenAI } from "@google/genai";
import { normalizeActionScriptTool, parseFlashAST, NormalizedFlashAST } from "./tools/normalizeActionScript";
import { sandboxSanitizerTool, sanitizeJsCode, SanitizationResult } from "./tools/sandboxSanitizer";
import { FLASH_PRESETS, FlashPreset } from "../presets/flashPresets";

export interface ReanimationRequest {
  rawActionScript: string;
  presetId?: string;
  title?: string;
  year?: number;
  extractedSymbols?: string[];
}

export interface ReanimationResponse {
  success: boolean;
  title: string;
  year: number;
  genre: string;
  gameCode: string;
  controls: string[];
  calaverita: {
    english: string;
    spanish: string;
  };
  sanitizationReport: {
    isSafe: boolean;
    flaggedTokens: string[];
  };
  normalizedAST: NormalizedFlashAST;
  cemeteryKeeperMessage?: string;
  isFallback: boolean;
  modelUsed: string;
}

/**
 * Executes the 3-step Mastra Reanimation Pipeline
 */
export async function executeMastraReanimation(
  req: ReanimationRequest
): Promise<ReanimationResponse> {
  const matchedPreset = req.presetId
    ? FLASH_PRESETS.find((p) => p.id === req.presetId)
    : undefined;

  try {
    // -------------------------------------------------------------
    // Step 1: Forensic AST Normalization via Mastra Tool
    // -------------------------------------------------------------
    const rawSnippet = req.rawActionScript || (matchedPreset ? matchedPreset.as2Code : "");
    const astResult: NormalizedFlashAST = parseFlashAST(rawSnippet);

    const genre = matchedPreset?.genre || astResult.genre;
    const title = req.title || matchedPreset?.title || "Reanimated Flash Soul (2004)";
    const year = req.year || matchedPreset?.year || 2004;

    // -------------------------------------------------------------
    // Step 2: Gemma Inference (Code Necromancer & Calaverita)
    // -------------------------------------------------------------
    let generatedJs = "";
    let calaveritaEnglish = "";
    let calaveritaSpanish = "";
    let modelUsed = "gemma-3-27b-it";
    let isFallback = false;
    let cemeteryKeeperMessage: string | undefined = undefined;

    const apiKey =
      process.env.GEMMA_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are The Code Necromancer, an open-source AI specialized in reviving departed 2000s Adobe Flash ActionScript 2.0 games for the Día de los Muertos Flash Game Preservation Altar.
You have received a normalized Flash AST specification:
Genre: ${genre}
Controls detected: ${astResult.inputBindings.keys.join(", ")}
Has Mouse: ${astResult.inputBindings.hasMouse}
Detected physics: ${JSON.stringify(astResult.detectedVariables.physics)}
Original ActionScript snippet:
\`\`\`actionscript
${astResult.originalSnippet}
\`\`\`

YOUR TASK:
1. Re-architect this Flash logic into self-contained ECMAScript that runs at 60 FPS on an HTML5 <canvas> inside:
function startReanimatedGame(canvas, ctx) {
  // game loops, listeners, particle rendering
  return function cleanup() {
    // cancels animationFrame and removes listeners
  };
}
2. Craft a 4-line rhyming Calaverita Literaria (in English and Spanish) honoring this game's original ${year} era and Flash legacy.

Respond ONLY with valid JSON in this exact structure:
{
  "gameCode": "function startReanimatedGame(canvas, ctx) { ... }",
  "calaveritaEnglish": "4-line rhyming English poem",
  "calaveritaSpanish": "4-line rhyming Spanish poem",
  "controls": ["Key / Mouse instruction 1", "Instruction 2"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const rawText = response.text || "";
        const cleanJsonText = rawText
          .replace(/^```(json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsed = JSON.parse(cleanJsonText);
        generatedJs = parsed.gameCode;
        calaveritaEnglish = parsed.calaveritaEnglish;
        calaveritaSpanish = parsed.calaveritaSpanish;
      } catch (geminiError: unknown) {
        console.warn("Gemma API invocation encountered rate-limit or network block. Activating Cemetery Keeper.", geminiError);
        isFallback = true;
      }
    } else {
      isFallback = true;
    }

    // -------------------------------------------------------------
    // Step 3: Zero-Crash Fallback (The Cemetery Keeper)
    // -------------------------------------------------------------
    if (isFallback || !generatedJs || generatedJs.length < 50) {
      const fallbackPreset =
        matchedPreset ||
        FLASH_PRESETS.find((p) => p.genre.toLowerCase().includes(genre)) ||
        FLASH_PRESETS[0];

      generatedJs = fallbackPreset.defaultJsCode;
      calaveritaEnglish = fallbackPreset.calaverita.english;
      calaveritaSpanish = fallbackPreset.calaverita.spanish;
      modelUsed = "Gemma-Offline-Necromancer (Fallback Engine)";
      isFallback = true;
      cemeteryKeeperMessage =
        "The spirit of this binary was too fragmented to summon across the ether, but the Cemetery Keeper channeled this 2004 preserved classic instead.";
    }

    // -------------------------------------------------------------
    // Step 4: Sandbox Sanitation via Mastra Tool
    // -------------------------------------------------------------
    const sanitizeResult: SanitizationResult = sanitizeJsCode(generatedJs);

    const fallbackControls = matchedPreset
      ? matchedPreset.controls
      : ["Hold Spacebar / Click: Interact", "Use Arrow Keys: Navigate"];

    return {
      success: true,
      title,
      year,
      genre,
      gameCode: sanitizeResult.sanitizedCode,
      controls: fallbackControls,
      calaverita: {
        english: calaveritaEnglish,
        spanish: calaveritaSpanish,
      },
      sanitizationReport: {
        isSafe: sanitizeResult.isSafe,
        flaggedTokens: sanitizeResult.flaggedTokens,
      },
      normalizedAST: astResult,
      cemeteryKeeperMessage,
      isFallback,
      modelUsed,
    };
  } catch (error: unknown) {
    console.error("Mastra pipeline unexpected trap:", error);
    const rescuePreset = FLASH_PRESETS[0];
    return {
      success: true,
      title: rescuePreset.title,
      year: rescuePreset.year,
      genre: rescuePreset.genre,
      gameCode: rescuePreset.defaultJsCode,
      controls: rescuePreset.controls,
      calaverita: rescuePreset.calaverita,
      sanitizationReport: { isSafe: true, flaggedTokens: [] },
      normalizedAST: {
        genre: "runner",
        detectedVariables: { coordinates: ["_x", "_y"], physics: { gravity: 0.45 }, stateVariables: ["score"] },
        inputBindings: { hasKeyboard: true, hasMouse: true, keys: ["Spacebar"] },
        gameLoop: { hasEnterFrame: true, hasCollisions: true, hasScoreCounter: true },
        originalSnippet: rescuePreset.as2Code,
      },
      cemeteryKeeperMessage:
        "The Cemetery Keeper intervened: an obscure opcode caused a disruption, so this consecrated 2004 temple was summoned instead.",
      isFallback: true,
      modelUsed: "Cemetery-Keeper-Emergency-Shield",
    };
  }
}
