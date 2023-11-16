import { NextResponse } from "next/server";

import {
  deleteEverything,
  sgfToNeo4j,
} from "@middleware/reset/exports";

/**
 * Reset Dev DB
 */
export async function POST() {
  try {
    await deleteEverything();
    await sgfToNeo4j("test1.sgf");

    return new NextResponse("Reset DB Successfully", {
      status: 201,
    });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to reset the DB",
      { status: 500 }
    );
  }
}
