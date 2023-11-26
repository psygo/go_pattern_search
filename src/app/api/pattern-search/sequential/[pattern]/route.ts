import { NextRequest, NextResponse } from "next/server";

import {
  SequentialSearchReqParams,
  SequentialSearchReqParamsSchema,
} from "@models/validation/exports";

import { sequentialPatternSearch } from "@middleware/pattern_search/exports";

export type PatternSearchParams = {
  params: SequentialSearchReqParams;
};
/**
 * Sequential Search
 * 
 * `/pattern-search/sequential/[pattern]`
 */
export async function GET(
  _: NextRequest,
  { params }: PatternSearchParams
) {
  try {
    const { pattern } =
      SequentialSearchReqParamsSchema.parse(params);

    const gameNodes = await sequentialPatternSearch(
      pattern
    );

    return NextResponse.json(gameNodes);
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
