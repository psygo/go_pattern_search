import { nanoid } from "nanoid";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  Filename,
  GameId,
  GameNode,
  GameNodeData,
  GameTreeNodeObj,
  MoveNode,
  ParentId,
  SgfData,
  TreeNodeId,
  sgfAsString,
  sgfFileToGameTrees,
} from "@models/exports";

async function createGameNode(gameNode: GameNode) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          CREATE (:GameNode{
            game_id: $gameNode.game_id,
            id:      0,
            sgf:     $gameNode.sgf,
            AB:      $gameNode.data.AB,
            AW:      $gameNode.data.AW
          })
        `,
        { gameNode }
      )
    );
  } catch (e) {
    console.error(e);
  }
}

async function createMoveNodes(moveNodes: MoveNode[]) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          UNWIND $moveNodes AS move

          CALL {
            WITH move

            MATCH (parent:GameNode|MoveNode{
              game_id: move.game_id, 
              id:      move.parentId
            })

            CREATE   (parent)
                    -[:NEXT_MOVE]
                   ->(m:MoveNode{
                       game_id: move.game_id,
                       id:      move.id,
                       AB:      move.data.AB,
                       AW:      move.data.AW,
                       B:       move.data.B,
                       W:       move.data.W,
                       move:    move.data.move
                     })
          }
        `,
        { moveNodes }
      )
    );
  } catch (e) {
    console.error(e);
  }
}

export async function sgfToNeo4j(filename: Filename) {
  const gameId: GameId = nanoid(NANOID_SIZE);

  const sgf = sgfAsString(filename);

  const gameTrees = sgfFileToGameTrees(filename);
  const firstGameTree = gameTrees.first();
  const allNodes: GameTreeNodeObj[] = [
    ...firstGameTree.listNodes(),
  ];

  //--------------------------------------------------------
  // 1. Game Node

  const rawGameNodeData: SgfData = allNodes.first().data;
  const gameNodeData: GameNodeData = {
    AB: rawGameNodeData.AB ?? [],
    AW: rawGameNodeData.AW ?? [],
  };
  const gameNode: GameNode = {
    id: 0,
    game_id: gameId,
    sgf: sgf,
    data: gameNodeData,
  };
  await createGameNode(gameNode);

  //--------------------------------------------------------
  // 2. Move Nodes

  const rawMoveNodes = allNodes.slice(1);
  // @ts-ignore
  const moveNodes = rawMoveNodes.map<MoveNode>((m) => ({
    game_id: gameId,
    id: m.id as TreeNodeId,
    parentId: m.parentId as ParentId,
    data: {
      AB: m.data.AB ?? [],
      AW: m.data.AW ?? [],
      B: m.data.B ?? [],
      W: m.data.W ?? [],
      // TODO: Create index on `move`
      move: m.data.B?.first() ?? m.data.W?.first() ?? "",
      // TODO: Add a field with the full path as a string,
      //       so we can match as regexes directly (also
      //       create an index).
    },
  }));

  await createMoveNodes(moveNodes);

  //--------------------------------------------------------
}
