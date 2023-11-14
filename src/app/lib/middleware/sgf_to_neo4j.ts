import { join } from "path";

import { nanoid } from "nanoid";

// @ts-ignore
import { parseFile } from "@sabaki/sgf";
const GameTree = require("@sabaki/immutable-gametree");

import { NANOID_SIZE } from "../config/db";

import { getId } from "@utils/sgf";

import {
  BoardCoordinate,
  GameNodeProperties,
  MoveToMoveProperties,
  stringToDoubleBoardCoordinate,
} from "@models/exports";

import {
  createGameNode,
  createGamePaths,
} from "@middleware/exports";

export async function sgfToNeo4j() {
  try {
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

    await createGamePaths(moveToMoveLinks);
  } catch (e) {
    console.error(e);
  }
}
