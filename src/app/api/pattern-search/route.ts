import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

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

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
      `)
    );

    console.log(results);

    // return NextResponse.json({ nodes });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
