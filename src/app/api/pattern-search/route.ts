import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import {
  BoardCoordinates,
  allGlobalRotations,
  allGlobalRotationsAndPermutations,
  permute,
} from "@models/board_coordinates";

// TODO: Move this to params so the URL tracks it as well
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

    const patternLength = pattern.length;
    const allRotations = allGlobalRotations(pattern);

    console.log(allRotations);

    // console.log(permute(pattern));
    console.log(allGlobalRotationsAndPermutations(pattern));

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          // An adaptation of [@cybersam's answer on Stack Overflow](https://stackoverflow.com/a/77499034/4756173)
        
          MATCH p =   (mFirst:MoveNode)
                     -[:NEXT_MOVE*${patternLength - 1}]
                    ->(:MoveNode)

          WHERE (
                      mFirst.move = HEAD($patterns[0]) 
                  AND [m IN NODES(p) | m.move] = $patterns[0]
                )
             OR (
                      mFirst.move = HEAD($patterns[1]) 
                  AND [m IN NODES(p) | m.move] = $patterns[1]
                )
             OR (
                      mFirst.move = HEAD($patterns[2]) 
                  AND [m IN NODES(p) | m.move] = $patterns[2]
                )
             OR (
                      mFirst.move = HEAD($patterns[3]) 
                  AND [m IN NODES(p) | m.move] = $patterns[3]
                )

          MATCH (g:GameNode)-[:NEXT_MOVE*]->(mFirst)

          RETURN g
        `,
        { patterns: allRotations }
      )
    );

    results.records.map((r) => {
      console.log(r.get("g"));
    });

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
