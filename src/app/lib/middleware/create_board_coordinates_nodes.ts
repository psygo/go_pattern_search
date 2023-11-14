import { neo4jSession } from "@config/db";

import { allCoords } from "@models/exports";

export async function createBoardCoordinatesNodes() {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          UNWIND $allCoords AS coord

          WITH properties(coord) AS coordProps

          CREATE (:BoardNode{
            x: coordProps.x,
            y: coordProps.y
          })
        `,
        { allCoords }
      )
    );
  } catch (e) {
    console.error(e);
  }
}
