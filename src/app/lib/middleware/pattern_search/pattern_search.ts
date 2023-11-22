import { neo4jSession } from "@config/db";

import { getAllNodes } from "@utils/neo4j_utils";

import { Pattern } from "@models/validation/exports";
import {
  BoardCoordinates,
  NeoGameNode,
} from "@models/exports";

import { allIsomorphisms, permute } from "./isomorphism";

export async function patternSearch(
  pattern: Pattern,
  isStoneSearch: boolean = false
) {
  return isStoneSearch
    ? await stoneEqualsSearch(pattern)
    : await sequentialPatternSearch(pattern);
}

/**
 * An adaptation of [@cybersam's answer on Stack Overflow](https://stackoverflow.com/a/77499034/4756173).
 */
async function sequentialPatternSearch(pattern: Pattern) {
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

    return getAllNodes<NeoGameNode>(results);
  } catch (e) {
    console.error(e);
  }
}

async function stoneEqualsSearch(pattern: Pattern) {
  try {
    const allBlackStones = [
      "qc",
      "pc",
      "oc",
    ] as BoardCoordinates[];
    const allWhiteStones = [
      "od",
      "pd",
      "qd",
    ] as BoardCoordinates[];

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (gm:GameNode|MoveNode)
          
          WHERE (
                      apoc.coll.isEqualCollection(
                        $allBlackStones, 
                        gm.all_black_stones
                      )
                  AND
                      apoc.coll.isEqualCollection(
                        $allWhiteStones, 
                        gm.all_white_stones
                      )
                )
             OR (
                      apoc.coll.isEqualCollection(
                        $allWhiteStones, 
                        gm.all_black_stones
                      )
                  AND
                      apoc.coll.isEqualCollection(
                        $allWhiteStones, 
                        gm.all_white_stones
                      )
                )
                
          WITH COLLECT(gm) AS n
          WITH [node IN n WHERE (node:GameNode) | node] AS gs

          RETURN DISTINCT(gs)
        `,
        { allBlackStones, allWhiteStones }
      )
    );

    return getAllNodes<NeoGameNode>(results);
  } catch (e) {
    console.error(e);
  }
}

async function stoneContainsSearch(pattern: Pattern) {
  try {
    const allBlackStones = [
      "qc",
      "pc",
      "oc",
    ] as BoardCoordinates[];
    const allWhiteStones = [
      "od",
      "pd",
      "qd",
    ] as BoardCoordinates[];

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (gm:GameNode|MoveNode)

          WHERE (
                      SIZE(apoc.coll.intersection(
                        $allBlackStones, 
                        gm.all_black_stones
                      )) > 0
                  AND
                      SIZE(apoc.coll.intersection(
                        $allWhiteStones, 
                        gm.all_white_stones
                      )) > 0
                )
             OR (
                      SIZE(apoc.coll.intersection(
                        $allWhiteStones, 
                        gm.all_black_stones
                      )) > 0
                  AND
                      SIZE(apoc.coll.intersection(
                        $allWhiteStones, 
                        gm.all_white_stones
                      )) > 0
                )
          
          WITH COLLECT(gm) AS n
          WITH [node IN n WHERE (node:GameNode) | node] AS gs

          RETURN DISTINCT(gs)
        `,
        { allBlackStones, allWhiteStones }
      )
    );

    return getAllNodes<NeoGameNode>(results);
  } catch (e) {
    console.error(e);
  }
}
