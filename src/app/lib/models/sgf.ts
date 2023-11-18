import { readFileSync } from "fs";
import { join } from "path";

// @ts-ignore
import { parseFile } from "@sabaki/sgf";
// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";

import { Filename } from "@models/utils/exports";

import { TreeNodeId } from "./game_tree";
import { BoardCoordinates } from "./board_coordinates";

//----------------------------------------------------------
// SGF

export type Sgf = string;

export type WithSgf = { sgf: Sgf };

export enum Player {
  Black = "B",
  White = "W",
}

/**
 * Only the more or less useful SGF fields.
 *
 * References:
 *
 * - [Red Bean - SGF's Official Documentation](https://www.red-bean.com/sgf/)
 * - [Alternative SGF's Documentation](https://homepages.cwi.nl/~aeb/go/misc/sgf.html)
 */
export type SgfData = {
  // 1. Metadata
  GM?: ["1"]; // Game Type (GM = '1' is Go)
  FF?: [string]; // File Format
  CA?: [string]; // Character Set
  AP?: [string]; // Application used to produce the file
  // 2. Game Info
  KM?: [string]; // Komi
  SZ?: [string]; // Board Size
  DT?: [string]; // Date
  HA?: [string]; // Number of Handicap Stones
  RU?: [string]; // Rules Set in Use
  GN?: [string]; // Game Name
  EV?: [string]; // Event
  // 3. Players
  PB?: [string]; // Black Player
  BR?: [string]; // Black's Rating
  PW?: [string]; // White Player
  WR?: [string]; // White's Rating
  // 4. Comments
  C?: [string]; // (Move) Comments
  GC?: [string]; // Game Comment
  // 5. Editing the Goban
  PL?: [Player]; // Who plays next
  AB?: BoardCoordinates[]; // Add Black stones
  AW?: BoardCoordinates[]; // Add White stones
  // 6. Moves
  B?: [BoardCoordinates]; // What Black plays
  W?: [BoardCoordinates]; // What White Plays
};

//----------------------------------------------------------
// Parsing

/**
 * The first suggestion on Sabaki's SGF Parser
 * documentation.
 */
export const getId = (
  (id: TreeNodeId) => () =>
    id++
)(0);

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

//----------------------------------------------------------
