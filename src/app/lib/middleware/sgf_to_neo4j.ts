import { nanoid } from "nanoid";

import { NANOID_SIZE } from "@config/db";

import {
  BoardCoordinate,
  Filename,
  GameNodeProperties,
  MoveToMoveProperties,
  sgfAsString,
  sgfFileToGameTrees,
  stringToDoubleBoardCoordinate,
} from "@models/exports";

import { createGameNode } from "./create_game_node";
import { createGamePaths } from "./create_game_paths";

export async function sgfToNeo4j(filename: Filename) {
  try {
    const customGameId = nanoid(NANOID_SIZE);

    const sgfString = sgfAsString(filename);
    const gameTrees = sgfFileToGameTrees(filename);

    const firstGameTree = gameTrees.first();

    const moveToMoveLinks: MoveToMoveProperties[] = [];
    let currentCoords = "";
    let nextCoords = "";

    function updateCoords(node: any) {
      currentCoords = nextCoords;
      if (node.data.B) {
        nextCoords = node.data.B.toString();
      } else if (node.data.W) {
        nextCoords = node.data.W.toString();
      }
    }

    async function createFirstNode(node: any) {
      const gameNodeProps: GameNodeProperties = {
        sgf: sgfString,
        player_black: node.data.PB.toString(),
        player_white: node.data.PW.toString(),
      };

      await createGameNode(gameNodeProps, customGameId);
    }

    function addPath() {
      const moveToMoveProperties: MoveToMoveProperties = {
        from:
          currentCoords === ""
            ? BoardCoordinate.BEGINNING_OF_GAME
            : stringToDoubleBoardCoordinate(currentCoords),
        to: stringToDoubleBoardCoordinate(nextCoords),
      };

      moveToMoveLinks.push(moveToMoveProperties);
    }

    for (const node of firstGameTree.listNodes()) {
      updateCoords(node);

      if (node.data.PB || node.data.PW) {
        await createFirstNode(node);
      } else if (nextCoords) {
        addPath();
      }
    }

    await createGamePaths(moveToMoveLinks, customGameId);
  } catch (e) {
    console.error(e);
  }
}