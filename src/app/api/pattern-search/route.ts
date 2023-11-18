import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import {
  BoardCoordinate,
  BoardCoordinates,
  allGlobalRoations,
} from "@models/board_coordinates";

const patternSearchReqBodySchema = z.object({
  pattern: z.array(
    z.string().transform((s) => s as BoardCoordinates)
  ),
});

/**
 * Pattern Search
 */
export async function POST(req: NextRequest) {
  try {
    const { pattern } = patternSearchReqBodySchema.parse(
      await req.json()
    );

    const allRotations = allGlobalRoations(pattern);

    console.log(allRotations);

    // const results = await neo4jSession.executeWrite((tx) =>
    //   tx.run(/* cypher */ `
    //   `)
    // );

    return new NextResponse("ok");
    // return NextResponse.json({ nodes });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
