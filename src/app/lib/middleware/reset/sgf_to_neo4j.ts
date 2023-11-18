import { join } from "path";
import { readdirSync } from "fs";

import { nanoid } from "nanoid";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  Directory,
  Filename,
  GameId,
  GameNode,
  GameNodeData,
  GameTreeNodeObj,
  MoveNode,
  ParentId,
  Player,
  SgfData,
  TreeNodeId,
  sgfAsString,
  sgfFileToGameTrees,
} from "@models/exports";

export async function createGameAndMoveNodesIndexes() {
  try {
    // 1. Game Node - Game Id
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        // 1. Game Id
        CREATE INDEX game_node_game_id_idx
           FOR (m:GameNode)
            ON (m.game_id)
      `)
    );
    // 2. Move Node - Game Id
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_game_id_idx
           FOR (m:MoveNode)
            ON (m.game_id)
      `)
    );
    // 3. Move Node - move
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_move_idx
           FOR (m:MoveNode)
            ON (m.move)
      `)
    );
    // 4. Move Node - stones
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_stones_idx
           FOR (m:MoveNode)
            ON (m.stones)
      `)
    );
  } catch (e) {
    console.error(e);
  }
}

async function createGameNode(gameNode: GameNode) {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          CREATE (:GameNode{
            game_id: $gameNode.game_id,
            id:      $gameNode.id,
            sgf:     $gameNode.sgf,
            AB:      $gameNode.data.AB,
            AW:      $gameNode.data.AW,
            ab:      $gameNode.data.ab,
            aw:      $gameNode.data.aw
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
                       ab:      move.data.ab,
                       aw:      move.data.aw,
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

export async function sgfsToNeo4j(
  directory: Directory = "games"
) {
  const gamesDir = join(
    __dirname,
    "../../../../..",
    directory
  );

  // const filenames = readdirSync(gamesDir);
  const filenames = [
    "test3.sgf",
    "test4.sgf",
    "test5.sgf",
    "test6.sgf",
  ];

  for (const filename of filenames) {
    await sgfToNeo4j(filename);
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

  const rawGameNode = allNodes.first();
  const rawGameNodeData: SgfData = rawGameNode.data;
  const gameNodeData: GameNodeData = {
    AB: rawGameNodeData.AB ?? [],
    AW: rawGameNodeData.AW ?? [],
    // @ts-ignore
    ab: addedStonesToString(rawGameNodeData, Player.Black),
    aw: addedStonesToString(rawGameNodeData, Player.White),
  };
  // @ts-ignore
  const gameNode: GameNode = {
    id: rawGameNode.id,
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
      ab: addedStonesToString(m.data, Player.Black),
      aw: addedStonesToString(m.data, Player.White),
      move: currentMove(m.data),
    },
  }));

  await createMoveNodes(moveNodes);

  //--------------------------------------------------------
}

function currentMove(sgfData: SgfData) {
  return sgfData.B?.first() ?? sgfData.W?.first() ?? "";
}

function addedStonesToString(
  sgfData: SgfData,
  player: Player
) {
  const addedStones =
    (player === Player.Black ? sgfData.AB : sgfData.AW) ??
    [];
  return addedStones.join("");
}
