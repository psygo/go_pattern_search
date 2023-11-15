import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

const patternSearchReqBodySchema = z.object({
  pattern: z.array(z.string()),
});

/**
 * Pattern Search
 */
export async function POST(req: NextRequest) {
  try {
    const { pattern } = patternSearchReqBodySchema.parse(
      await req.json()
    );

    return new NextResponse("Healthy", { status: 200 });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
