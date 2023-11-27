import { NextRequest, NextResponse } from "next/server";

import {
  StonesSearchReqParams,
  StonesSearchReqParamsSchema,
  StonesSearchReqSearchParamsSchema,
} from "@models/validation/exports";

import {
  stonesContainsSearch,
  stonesEqualsSearch,
} from "@middleware/pattern_search/exports";

export type StonesSearchParams = {
  params: StonesSearchReqParams;
};
/**
 * Stone Search
 *
 * `/pattern-search/stone/[black_stones]/[white_stones]?equals`
 */
export async function GET(
  req: NextRequest,
  { params }: StonesSearchParams
) {
  try {
    const {
      black_stones: blackStones,
      white_stones: whiteStones,
    } = StonesSearchReqParamsSchema.parse(params);

    const { searchParams } = new URL(req.url);

    const { equals } =
      StonesSearchReqSearchParamsSchema.parse(
        Object.fromEntries(searchParams)
      );

    const gameNodes = equals
      ? await stonesEqualsSearch(blackStones, whiteStones)
      : await stonesContainsSearch(
          blackStones,
          whiteStones
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
