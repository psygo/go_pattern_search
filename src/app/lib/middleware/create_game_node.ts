import { neo4jSession } from "@config/db";

import { GameNodeProperties, Id } from "@models/exports";

export async function createGameNode(
  gameNodeProperties: GameNodeProperties,
  customGameId: Id
) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          WITH properties($gameNodeProps) AS props

          CREATE (:GameNode{
            player_black: props.player_black,
            player_white: props.player_white,
            id:           $customGameId
          })
        `,
        { gameNodeProperties, customGameId }
      )
    );
  } catch (e) {
    console.error(e);
  }
}
