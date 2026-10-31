import { NextRequest, NextResponse } from "next/server";
import { executeMastraReanimation, ReanimationRequest } from "@/lib/mastra/workflow";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReanimationRequest;
    const response = await executeMastraReanimation(body);
    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to reanimate entity: ${message}`,
      },
      { status: 500 }
    );
  }
}
