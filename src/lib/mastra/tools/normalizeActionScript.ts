import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export interface NormalizedFlashAST {
  genre: "runner" | "shooter" | "physics" | "arcade";
  detectedVariables: {
    coordinates: string[];
    physics: Record<string, number | string>;
    stateVariables: string[];
  };
  inputBindings: {
    hasKeyboard: boolean;
    hasMouse: boolean;
    keys: string[];
  };
  gameLoop: {
    hasEnterFrame: boolean;
    hasCollisions: boolean;
    hasScoreCounter: boolean;
  };
  originalSnippet: string;
}

export function parseFlashAST(code: string): NormalizedFlashAST {
  const lower = code.toLowerCase();

  // Detect Keys & Inputs
  const hasSpace = lower.includes("key.space") || lower.includes("space");
  const hasArrows = lower.includes("key.left") || lower.includes("key.up") || lower.includes("arrow");
  const hasWasd = lower.includes("key.isdown(65)") || lower.includes("key.isdown(87)");
  const hasMouse = lower.includes("_xmouse") || lower.includes("_ymouse") || lower.includes("mousedown");

  const keys: string[] = [];
  if (hasSpace) keys.push("Spacebar");
  if (hasArrows) keys.push("Arrow Keys");
  if (hasWasd) keys.push("W/A/S/D");

  // Detect Coordinates & Motion
  const coordinates: string[] = [];
  if (lower.includes("_x") || lower.includes("_y")) coordinates.push("_x", "_y");
  if (lower.includes("_rotation")) coordinates.push("_rotation");
  if (lower.includes("_xscale") || lower.includes("_yscale")) coordinates.push("_scale");

  // Detect Genre
  let genre: "runner" | "shooter" | "physics" | "arcade" = "arcade";
  if (lower.includes("copter") || (hasSpace && lower.includes("gravity") && lower.includes("thrust"))) {
    genre = "runner";
  } else if (lower.includes("tank") || lower.includes("bullet") || lower.includes("zombie")) {
    genre = "shooter";
  } else if (lower.includes("elastic") || lower.includes("squash") || lower.includes("bounce")) {
    genre = "physics";
  }

  const physics: Record<string, number | string> = {};
  if (lower.includes("gravity")) physics.gravity = "detected";
  if (lower.includes("thrust") || lower.includes("speed")) physics.speed = "detected";
  if (lower.includes("elasticity")) physics.elasticity = "detected";

  const stateVariables: string[] = [];
  if (lower.includes("score")) stateVariables.push("score");
  if (lower.includes("health") || lower.includes("lives")) stateVariables.push("health");
  if (lower.includes("isalive") || lower.includes("gameover")) stateVariables.push("gameState");

  return {
    genre,
    detectedVariables: {
      coordinates,
      physics,
      stateVariables,
    },
    inputBindings: {
      hasKeyboard: keys.length > 0,
      hasMouse,
      keys,
    },
    gameLoop: {
      hasEnterFrame: lower.includes("enterframe"),
      hasCollisions: lower.includes("hittest") || lower.includes("collision") || lower.includes("ceiling"),
      hasScoreCounter: lower.includes("score"),
    },
    originalSnippet: code.slice(0, 1500),
  };
}

export const normalizeActionScriptTool = createTool({
  id: "normalize-actionscript-tool",
  description:
    "Parses vintage ActionScript 1/2 idioms (_root._x, Key.isDown, onClipEvent, attachMovie) into a structured game specification.",
  inputSchema: z.object({
    rawCode: z.string(),
    symbols: z.array(z.string()).optional(),
  }),
  outputSchema: z.object({
    genre: z.enum(["runner", "shooter", "physics", "arcade"]),
    detectedVariables: z.object({
      coordinates: z.array(z.string()),
      physics: z.record(z.string(), z.union([z.number(), z.string()])),
      stateVariables: z.array(z.string()),
    }),
    inputBindings: z.object({
      hasKeyboard: z.boolean(),
      hasMouse: z.boolean(),
      keys: z.array(z.string()),
    }),
    gameLoop: z.object({
      hasEnterFrame: z.boolean(),
      hasCollisions: z.boolean(),
      hasScoreCounter: z.boolean(),
    }),
    originalSnippet: z.string(),
  }),
  execute: async (inputData) => {
    return parseFlashAST(inputData.rawCode || "");
  },
});
