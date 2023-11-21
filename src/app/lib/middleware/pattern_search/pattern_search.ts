import { neo4jSession } from "@config/db";

import { getAllNodes } from "@utils/neo4j_utils";

import { Pattern } from "@models/validation/exports";
import { NeoGameNode } from "@models/exports";

import { allIsomorphisms } from "./isomorphism";

export async function patternSearch(
  pattern: Pattern,
  isStoneSearch: boolean = false
) {
  return isStoneSearch
    ? await stoneSearch(pattern)
    : await sequentialPatternSearch(pattern);
}

/**
 * An adaptation of [@cybersam's answer on Stack Overflow](https://stackoverflow.com/a/77499034/4756173).
 */
async function sequentialPatternSearch(pattern: Pattern) {
  try {
    const patternLength = pattern.length;
    const allPatterns = allIsomorphisms(pattern);

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

          RETURN DISTINCT(g)
        `,
        { patterns: allPatterns }
      )
    );

    return getAllNodes<NeoGameNode>(results);
  } catch (e) {
    console.error(e);
  }
}

async function stoneSearch(pattern: Pattern) {
  try {
    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
        `,
        {}
      )
    );

    return getAllNodes<NeoGameNode>(results);
  } catch (e) {
    console.error(e);
  }
}
