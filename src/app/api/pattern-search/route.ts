import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodes } from "@utils/neo4j_utils";

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
        // MATCH game_paths =   (:GameNode)
        //                     -[:PLAYS_NEXT*1..]
        //                    ->(:BoardNode)

        MATCH   (g1:GameNode)
               -[:PLAYS_FIRST]
              ->(:BoardNode{ x: 'q', y: 'd' })
        MATCH   (g2:GameNode)
               -[:PLAYS_FIRST]
              ->(:BoardNode)
               -[:PLAYS_NEXT] 
              ->(:BoardNode{ x: 'q', y: 'd' })
           
        RETURN g1, g2
      `)
    );

    console.log(results);

    const nodes = getAllNodes(results);

    return NextResponse.json({ nodes });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to Pattern-Search",
      { status: 500 }
    );
  }
}
