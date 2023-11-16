import { nanoid } from "nanoid";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  Filename,
  GameId,
  GameNode,
  GameNodeData,
  GameTreeNodeObj,
  MoveNode,
  MoveNodeData,
  ParentId,
  Sgf,
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
          // 1. Create All The Move Nodes

          UNWIND $moveNodes AS move
          
          CREATE (:MoveNode{
                   game_id: move.game_id,
                   id:      move.id,
                   AB:      move.data.AB,
                   AW:      move.data.AW,
                   B:       move.data.B,
                   W:       move.data.W
                 })
          
          // 2. Tie them to their Parents

          WITH move

          MATCH (parent{
                  game_id: move.game_id,
                  id:      move.parentId
                }),
                (m:MoveNode{
                  game_id: move.game_id,
                  id:      move.id
                })

          WHERE parent:GameNode
             OR parent:MoveNode
            
          CREATE (parent)-[:NEXT_MOVE]->(m)
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

  const rawMoveNoves = allNodes.slice(1);
  const moveNoves = rawMoveNoves.map<MoveNode>((m) => ({
    game_id: gameId,
    id: m.id as TreeNodeId,
    // @ts-ignore
    parentId: m.parentId as ParentId,
    data: {
      AB: m.data.AB ?? [],
      AW: m.data.AW ?? [],
      B: m.data.B ?? [],
      W: m.data.W ?? [],
    },
  }));

  await createMoveNodes(moveNoves);

  //--------------------------------------------------------
}
