import { neo4jSession } from "@config/db";

import { Pattern } from "@models/validation/exports";

import { allIsomorphisms } from "./isomorphism";

/**
 * An adaptation of [@cybersam's answer on Stack Overflow](https://stackoverflow.com/a/77499034/4756173)
 */
export async function patternSearch(pattern: Pattern) {
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

    console.log(results.records);

    return results;
  } catch (e) {
    console.log(e);
  }
}
