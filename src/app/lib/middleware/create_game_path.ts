import { neo4jSession } from "@config/db";

import { MoveToMoveProperties } from "@models/sgf_link_models";

export async function createGamePaths(
  moveToMoveLinks: MoveToMoveProperties[]
) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          UNWIND $moveToMoveLinks AS mtml

          WITH properties(mtml) AS mtm

          CREATE   (:BoardNode{
                     x: mtm.from.x,
                     y: mtm.from.y
                   })
                  -[:PLAYS_NEXT]
                 ->(:BoardNode{
                     x: mtm.to.x,
                     y: mtm.to.y
                   })
        `,
        { moveToMoveLinks }
      )
    );
  } catch (e) {
    console.error(e);
  }
}
