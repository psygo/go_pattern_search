import {} from "@utils/array";

import { writeFileSync } from "fs";

import { join } from "path";

// @ts-ignore
import { parseFile, stringify } from "@sabaki/sgf";
const GameTree = require("@sabaki/immutable-gametree");

import { NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getId } from "@utils/sgf";

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
    // 2. SGF

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

    while (true) {
      const currentNode = gameTree;
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
