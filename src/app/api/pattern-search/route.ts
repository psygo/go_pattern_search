import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";


import { PatternSchema } from "@models/validation/exports";

import { patternSearch } from "@middleware/pattern_search/exports";

// TODO: Move this to params so the URL tracks it as well
const patternSearchReqBodySchema = z.object({
  pattern: PatternSchema,
});

/**
 * Pattern Search
 */
export async function POST(req: NextRequest) {
  try {
    const { pattern } = patternSearchReqBodySchema.parse(
      await req.json()
    );

    const results = await patternSearch(pattern);

    results?.records.map((r) => {
      console.log(r.get("g"));
    });

    return new NextResponse("Ok");
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
