import { readFileSync } from "fs";
import { join } from "path";

// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";
// @ts-ignore
import { parseFile } from "@sabaki/sgf";

import { nanoid } from "nanoid";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  Directory,
  Filename,
  GameId,
  GameNode,
  GameNodeData,
  GameTreeNodeObj,
  getId,
  MoveNode,
  ParentId,
  Sgf,
  SgfData,
  TreeNodeId,
} from "@models/exports";

export async function createGameAndMoveNodesIndexes() {
  try {
    // 1. Game Id
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX game_node_game_id_idx
           FOR (m:GameNode)
            ON (m.game_id)
      `)
    );
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_game_id_idx
           FOR (m:MoveNode)
            ON (m.game_id)
      `)
    );

    // 2. Move Node - move
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_move_idx
           FOR (m:MoveNode)
            ON (m.move)
      `)
    );

    // 3. All Stones
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX game_node_all_black_stones_idx
           FOR (m:GameNode)
            ON (m.all_black_stones)
      `)
    );
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_all_black_stones_idx
           FOR (m:MoveNode)
            ON (m.all_black_stones)
      `)
    );
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX game_node_all_white_stones_idx
           FOR (m:GameNode)
            ON (m.all_white_stones)
      `)
    );
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CREATE INDEX move_node_all_white_stones_idx
           FOR (m:MoveNode)
            ON (m.all_white_stones)
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
            game_id:          $gameNode.game_id,
            id:               $gameNode.id,
            sgf:              $gameNode.sgf,
            AB:               $gameNode.data.AB,
            AW:               $gameNode.data.AW,
            all_black_stones: $gameNode.data.AB,
            all_white_stones: $gameNode.data.AW
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
                       game_id:          move.game_id,
                       id:               move.id,
                       AB:               move.data.AB,
                       AW:               move.data.AW,
                       B:                move.data.B,
                       W:                move.data.W,
                       move:             move.data.move,
                       all_black_stones: parent.all_black_stones + move.data.AB + move.data.B,
                       all_white_stones: parent.all_white_stones + move.data.AW + move.data.W
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
    "test1.sgf",
    "test2.sgf",
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
  };
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

  const moveNodes = rawMoveNodes.map((m) => {
    return <MoveNode>{
      game_id: gameId,
      id: m.id as TreeNodeId,
      parentId: m.parentId as ParentId,
      data: {
        AB: m.data.AB ?? [],
        AW: m.data.AW ?? [],
        B: m.data.B ?? [],
        W: m.data.W ?? [],
        move: currentMove(m.data),
      },
    };
  });

  await createMoveNodes(moveNodes);

  //--------------------------------------------------------
}

function currentMove(sgfData: SgfData) {
  return sgfData.B?.first() ?? sgfData.W?.first() ?? "";
}

export function sgfAsString(filename: Filename): Sgf {
  const gamePath = join(
    __dirname,
    "../../../../..",
    "games",
    filename
  );

  const sgfString = readFileSync(gamePath).toString();

  return sgfString;
}

export function sgfFileToGameTrees(filename: Filename) {
  const gamePath = join(
    __dirname,
    "../../../../..",
    "games",
    filename
  );

  const rootNodes = parseFile(gamePath, { getId });

  const gameTrees: GameTree[] = rootNodes.map(
    (rootNode: any) => {
      return new GameTree({ getId, root: rootNode });
    }
  );

  return gameTrees;
}
