import { neo4jSession } from "@config/db";

import { getAllNodes } from "@utils/neo4j_utils";

import { Pattern } from "@models/validation/exports";
import {
  BoardCoordinates,
  NeoGameNode,
} from "@models/exports";

import { allIsomorphisms } from "./isomorphism";

/**
 * An adaptation of [@cybersam's answer on Stack Overflow](https://stackoverflow.com/a/77499034/4756173).
 */
export async function sequentialPatternSearch(
  pattern: Pattern
) {
  try {
    const patternLength = pattern.length;
    const allPatterns = allIsomorphisms(pattern);

    // TODO: Maybe there's a more succinct way of doing this
    //       with APOC Collection Similarities?
    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH p =   (mFirst:MoveNode)
                     -[:NEXT_MOVE*${patternLength - 1}]
                    ->(:MoveNode)

          WHERE ANY(
            pattern IN $patterns 

            WHERE mFirst.move = HEAD(pattern) 
              AND [m IN NODES(p) | m.move] = pattern
          )

          MATCH (g:GameNode)-[:NEXT_MOVE*]->(mFirst)

          RETURN DISTINCT(g) AS gd
        `,
        { patterns: allPatterns }
      )
    );

    return getAllNodes<NeoGameNode>(results) ?? [];
  } catch (e) {
    console.error(e);
  }
}

export async function stonesEqualsSearch(
  // TODO: In the case of stone search, the pattern is more
  //       like a set than a list.
  blackStones: Pattern,
  whiteStones: Pattern
) {
  try {
    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (gm:GameNode|MoveNode)
          
          WHERE (
                      apoc.coll.isEqualCollection(
                        $blackStones, 
                        gm.all_black_stones
                      )
                  AND
                      apoc.coll.isEqualCollection(
                        $whiteStones, 
                        gm.all_white_stones
                      )
                )
             OR (
                      apoc.coll.isEqualCollection(
                        $whiteStones, 
                        gm.all_black_stones
                      )
                  AND
                      apoc.coll.isEqualCollection(
                        $whiteStones, 
                        gm.all_white_stones
                      )
                )
                
          WITH COLLECT(gm) AS nodes
          WITH [node IN nodes WHERE node:GameNode | node] AS gs

          RETURN DISTINCT(gs)
        `,
        { blackStones, whiteStones }
      )
    );

    return getAllNodes<NeoGameNode>(results) ?? [];
  } catch (e) {
    console.error(e);
  }
}

export async function stonesContainsSearch(
  blackStones: Pattern,
  whiteStones: Pattern
) {
  try {
    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (gm:GameNode|MoveNode)

          WHERE (
                      SIZE(apoc.coll.intersection(
                        $blackStones, 
                        gm.all_black_stones
                      )) > 0
                  AND
                      SIZE(apoc.coll.intersection(
                        $whiteStones, 
                        gm.all_white_stones
                      )) > 0
                )
             OR (
                      SIZE(apoc.coll.intersection(
                        $whiteStones, 
                        gm.all_black_stones
                      )) > 0
                  AND
                      SIZE(apoc.coll.intersection(
                        $whiteStones, 
                        gm.all_white_stones
                      )) > 0
                )
          
          WITH COLLECT(gm) AS nodes
          WITH [node IN nodes WHERE node:GameNode | node] AS gs

          RETURN DISTINCT(gs)
        `,
        { blackStones, whiteStones }
      )
    );

    return getAllNodes<NeoGameNode>(results) ?? [];
  } catch (e) {
    console.error(e);
  }
}
