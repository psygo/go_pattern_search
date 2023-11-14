import {} from "@utils/array";

import { NextResponse } from "next/server";

import {
  createBoardCoordinatesNodes,
  deleteEverything,
  sgfToNeo4j,
} from "@middleware/exports";

/**
 * Reset Dev DB
 */
export async function POST() {
  try {
    await deleteEverything();
    await createBoardCoordinatesNodes();
    await sgfToNeo4j();

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
