import {} from "@utils/array";

import { join } from "path";

import { nanoid } from "nanoid";

// @ts-ignore
import { parseFile } from "@sabaki/sgf";
const GameTree = require("@sabaki/immutable-gametree");

import { NextResponse } from "next/server";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import { getId } from "@utils/sgf";

import {
  BoardCoordinate,
  GameNodeProperties,
  MoveToMoveProperties,
  allCoords,
  stringToDoubleBoardCoordinate,
} from "@models/exports";

import { createGameNode } from "@middleware/create_game_node";

/**
 * Reset Dev DB
 */
export async function POST() {
  try {
    //------------------------------------------------------
    // 1. Delete Everything

    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        MATCH (n)
        DETACH DELETE n
      `)
    );

    //------------------------------------------------------
    // 2. Create Board Coordinates Nodes

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

    //------------------------------------------------------
    // 3. SGF

    const gameFilename =
      "ai-sensei_20231108_aaron12345_vs_psygo.sgf";
    const gamePath = join(
      __dirname,
      "../../../../..",
      "games",
      gameFilename
    );
    const customGameId = nanoid(NANOID_SIZE);

    const rootNodes = parseFile(gamePath);
    const gameTrees = rootNodes.map((rootNode: any) => {
      return new GameTree({ getId, root: rootNode });
    });
    const firstGameTree = gameTrees.first();

    const moveToMoveLinks: MoveToMoveProperties[] = [];
    let currentCoords = "";
    let nextCoords = "";
    for (const node of firstGameTree.listNodes()) {
      currentCoords = nextCoords;
      if (node.data.B) {
        nextCoords = node.data.B.toString();
      } else if (node.data.W) {
        nextCoords = node.data.W.toString();
      }

      if (node.data.PB || node.data.PW) {
        const gameNodeProps: GameNodeProperties = {
          player_black: node.data.PB.toString(),
          player_white: node.data.PW.toString(),
        };

        await createGameNode(gameNodeProps, customGameId);
      }

      if (nextCoords) {
        const moveToMoveProperties: MoveToMoveProperties = {
          from:
            currentCoords === ""
              ? BoardCoordinate.BEGINNING_OF_GAME
              : stringToDoubleBoardCoordinate(
                  currentCoords
                ),
          to: stringToDoubleBoardCoordinate(nextCoords),
        };

        moveToMoveLinks.push(moveToMoveProperties);
      }
    }

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

    //------------------------------------------------------

    return new NextResponse("Reset DB Successfully", {
      status: 201,
    });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to reset the DB",
      { status: 500 }
    );
  }
}
