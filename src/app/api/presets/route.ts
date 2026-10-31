import { NextResponse } from "next/server";
import { FLASH_PRESETS } from "@/lib/presets/flashPresets";

export async function GET() {
  return NextResponse.json({
    presets: FLASH_PRESETS,
    totalCount: FLASH_PRESETS.length,
  });
}
