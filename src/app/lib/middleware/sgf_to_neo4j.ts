import { nanoid } from "nanoid";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  Filename,
  GameId,
  GameNode,
  GameNodeData,
  Sgf,
  SgfData,
  sgfAsString,
  sgfFileToGameTrees,
} from "@models/exports";

export async function createGameNode(
  gameId: GameId,
  sgfString: Sgf,
  gameNodeData: GameNodeData
) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          WITH properties($gameNodeData) AS props

          CREATE (:GameNode{
            game_id: $gameId,
            id:      0,
            sgf:     $sgfString,
            AB:      props.AB,
            AW:      props.AW
          })
        `,
        { gameId, sgfString, gameNodeData }
      )
    );
  } catch (e) {
    console.error(e);
  }
}

export async function sgfToNeo4j(filename: Filename) {
  const customGameId: GameId = nanoid(NANOID_SIZE);

  const sgfString = sgfAsString(filename);

  const gameTrees = sgfFileToGameTrees(filename);
  const firstGameTree = gameTrees.first();

  const allNodes = [...firstGameTree.listNodes()];

  //--------------------------------------------------------
  // 1. Game Node

  const gameNodeData: SgfData = allNodes.first().data;
  const usefulGameNodeData: GameNodeData = {
    AB: gameNodeData.AB,
    AW: gameNodeData.AW,
  };

  await createGameNode(
    customGameId,
    sgfString,
    usefulGameNodeData
  );

  //--------------------------------------------------------
  // 2. Move Nodes

  const moves = allNodes.slice(1);

  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          UNWIND moves AS move

          CREATE (:MoveNode{
            game_id: $gameId,
            sgf:     $sgfString,
            AB:      props.AB,
            AW:      props.AW
          })
        `,
        {}
      )
    );
  } catch (e) {
    console.error(e);
  }

  //--------------------------------------------------------
}
