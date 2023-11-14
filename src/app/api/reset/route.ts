import {} from "@utils/array";

import { writeFileSync } from "fs";

import { join } from "path";

// @ts-ignore
import { parseFile, stringify } from "@sabaki/sgf";
const GameTree = require("@sabaki/immutable-gametree");

import { NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getId } from "@utils/sgf";

import {
  allCoords,
  BoardCoordinate,
  BoardNodeProperties,
} from "@models/exports";

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

          WITH coord, properties(coord) as coordProps

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

    const rootNodes = parseFile(gamePath);
    const gameTrees = rootNodes.map((rootNode: any) => {
      return new GameTree({ getId, root: rootNode });
    });

    const gameTree = gameTrees.first();

    for (const node of gameTree.listNodes()) {
      // console.log(node);
    }

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
