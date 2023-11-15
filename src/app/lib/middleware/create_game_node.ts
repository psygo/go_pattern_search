import { neo4jSession } from "@config/db";

import { GameNodeProperties } from "@models/exports";

export async function createGameNode(
  gameNodeProperties: GameNodeProperties
) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          WITH properties($gameNodeProperties) AS props

          CREATE (:GameNode{
            id:           props.id,
            sgf:          props.sgf,
            player_black: props.player_black,
            player_white: props.player_white
          })
        `,
        { gameNodeProperties }
      )
    );
  } catch (e) {
    console.error(e);
  }
}
