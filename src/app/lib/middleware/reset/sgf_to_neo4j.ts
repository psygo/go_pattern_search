import { nanoid } from "nanoid";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  Filename,
  GameId,
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

async function createGameNode(
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

async function createMoveNodes(
  gameId: GameId,
  moveNodes: MoveNode[]
) {}

export async function sgfToNeo4j(filename: Filename) {
  const gameId: GameId = nanoid(NANOID_SIZE);

  const sgfString = sgfAsString(filename);

  const gameTrees = sgfFileToGameTrees(filename);
  const firstGameTree = gameTrees.first();

  const allNodes: GameTreeNodeObj[] = [
    ...firstGameTree.listNodes(),
  ];

  //--------------------------------------------------------
  // 1. Game Node

  const gameNodeData: SgfData = allNodes.first().data;
  const usefulGameNodeData: GameNodeData = {
    AB: gameNodeData.AB ?? [],
    AW: gameNodeData.AW ?? [],
  };

  await createGameNode(
    gameId,
    sgfString,
    usefulGameNodeData
  );

  //--------------------------------------------------------
  // 2. Move Nodes

  const moves = allNodes.slice(1);
  const usefulMoveNodes = moves.map<MoveNode>((m) => ({
    id: m.id as TreeNodeId,
    // @ts-ignore
    parentId: m.parentId as ParentId,
    data: <MoveNodeData>{
      AB: m.data.AB ?? [],
      AW: m.data.AW ?? [],
      B: m.data.B ?? [],
      W: m.data.W ?? [],
    },
  }));

  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          // 1. Create All The Move Nodes

          UNWIND $usefulMoveNodes AS move
          
          CREATE (:MoveNode{
                   game_id: $gameId,
                   id:      move.id,
                   AB:      move.data.AB,
                   AW:      move.data.AW,
                   B:       move.data.B,
                   W:       move.data.W
                 })
          
          // 2. Tie them to their Parents

          WITH move

          MATCH (parent{
                  game_id: $gameId,
                  id:      move.parentId
                }),
                (m:MoveNode{
                  game_id: $gameId,
                  id:      move.id
                })

          WHERE parent:GameNode
             OR parent:MoveNode
            
          CREATE (parent)-[:NEXT_MOVE]->(m)
        `,
        { gameId, usefulMoveNodes }
      )
    );
  } catch (e) {
    console.error(e);
  }

  //--------------------------------------------------------
}
