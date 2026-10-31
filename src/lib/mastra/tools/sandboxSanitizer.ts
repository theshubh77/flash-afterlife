import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const FORBIDDEN_TOKENS = [
  "window.location",
  "document.location",
  "document.cookie",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "fetch(",
  "XMLHttpRequest",
  "WebSocket",
  "navigator.sendBeacon",
  "eval(",
  "new Function",
  "setTimeout('",
  "setInterval('",
];

export interface SanitizationResult {
  isSafe: boolean;
  sanitizedCode: string;
  flaggedTokens: string[];
  hasValidEntryPoint: boolean;
}

export function sanitizeJsCode(rawCode: string): SanitizationResult {
  let code = rawCode || "";
  const flaggedTokens: string[] = [];

  // Strip markdown code fences if Gemma enclosed it
  code = code.replace(/^```(javascript|js)?\s*/i, "");
  code = code.replace(/\s*```$/i, "");

  for (const token of FORBIDDEN_TOKENS) {
    if (code.includes(token)) {
      flaggedTokens.push(token);
      code = code.replaceAll(token, `/* [BLOCKED_BY_SANBOX: ${token}] */ null`);
    }
  }

  const hasValidEntryPoint = code.includes("function startReanimatedGame(canvas, ctx)");

  if (!hasValidEntryPoint) {
    code = `function startReanimatedGame(canvas, ctx) {\n  let animId = null;\n${code}\n  return function cleanup() {\n    if (animId) cancelAnimationFrame(animId);\n  };\n}`;
  }

  return {
    isSafe: flaggedTokens.length === 0,
    sanitizedCode: code.trim(),
    flaggedTokens,
    hasValidEntryPoint: true,
  };
}

export const sandboxSanitizerTool = createTool({
  id: "sandbox-sanitizer-tool",
  description:
    "Audits and sanitizes reanimated Canvas JavaScript to ensure complete isolation inside the sandbox iframe.",
  inputSchema: z.object({
    rawJs: z.string(),
    title: z.string().optional(),
  }),
  outputSchema: z.object({
    isSafe: z.boolean(),
    sanitizedCode: z.string(),
    flaggedTokens: z.array(z.string()),
    hasValidEntryPoint: z.boolean(),
  }),
  execute: async (inputData) => {
    return sanitizeJsCode(inputData.rawJs || "");
  },
});
