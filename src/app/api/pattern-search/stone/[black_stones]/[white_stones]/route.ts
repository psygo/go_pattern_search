import { NextRequest, NextResponse } from "next/server";

import {
  StonesSearchReqParams,
  StonesSearchReqParamsSchema,
} from "@models/validation/exports";

export type StonesSearchParams = {
  params: StonesSearchReqParams;
};
/**
 * Stone Search
 *
 * `/pattern-search/stone/[black_stones]/[white_stones]`
 */
export async function GET(
  _: NextRequest,
  { params }: StonesSearchParams
) {
  try {
    const { black_stones, white_stones } =
      StonesSearchReqParamsSchema.parse(params);

    return NextResponse.json({});
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
