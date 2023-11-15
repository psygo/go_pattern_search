import { neo4jSession } from "@config/db";

import { Id, MoveToMoveProperties } from "@models/exports";

export async function createGamePaths(
  moveToMoveLinks: MoveToMoveProperties[],
  gameNodeId: Id
) {
  try {
    const firstMove = moveToMoveLinks.first();
    const restOfTheMoves = moveToMoveLinks.slice(1);

    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (g:GameNode{ id: $gameNodeId })

          WITH g, properties($firstMove) AS props
          
          MATCH (bTo:BoardNode{
                  x: props.to.x,
                  y: props.to.y
                })
                
          WITH g, bTo

          CREATE (g)-[:PLAYS_NEXT] ->(bTo),
                 (g)-[:PLAYS_FIRST]->(bTo)
        `,
        { firstMove, gameNodeId }
      )
    );

    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          UNWIND $restOfTheMoves AS mtml

          WITH properties(mtml) AS mtm
          
          MATCH (bFrom:BoardNode{
                  x: mtm.from.x,
                  y: mtm.from.y
                }),
                (bTo:BoardNode{
                  x: mtm.to.x,
                  y: mtm.to.y
                })
                
          WITH bFrom, bTo

          CREATE (bFrom)-[:PLAYS_NEXT]->(bTo)
        `,
        { restOfTheMoves }
      )
    );
  } catch (e) {
    console.error(e);
  }
}
