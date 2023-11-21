import { NextRequest, NextResponse } from "next/server";

import {
  PatternSearchReqParams,
  PatternSearchReqParamsSchema,
  PatternSearchReqSearchParamsSchema,
} from "@models/validation/exports";

import { patternSearch } from "@middleware/pattern_search/pattern_search";

export type PatternSearchParams = {
  params: PatternSearchReqParams;
};
/**
 * Pattern Search
 */
export async function GET(
  req: NextRequest,
  { params }: PatternSearchParams
) {
  try {
    const { searchParams } = new URL(req.url);
    const { "stone-search": isStoneSearch } =
      PatternSearchReqSearchParamsSchema.parse(
        Object.fromEntries(searchParams)
      );
    const { pattern } =
      PatternSearchReqParamsSchema.parse(params);

    const results = await patternSearch(
      pattern,
      isStoneSearch
    );

    // results?.records.map((r) => {
    //   console.log(r.get("g"));
    // });

    return new NextResponse("Ok");
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
