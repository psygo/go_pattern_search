import { readFileSync } from "fs";
import { join } from "path";

// @ts-ignore
import { parseFile } from "@sabaki/sgf";
// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";

import { Filename } from "./files";

//----------------------------------------------------------
// Game Tree and SGF

export type Sgf = string;

export enum Players {
  Black = "B",
  White = "W",
}

/**
 * Only the necessary data for pattern search, the rest will
 * come from reparsing the SGF string again on the frontend.
 */
export type GameNodeData = Pick<SgfData, "AB" | "AW">;
export type MoveNodeData = Pick<
  SgfData,
  "AB" | "AW" | "B" | "W"
>;

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
  PL?: [Players]; // Who plays next
  AB?: string[]; // Add Black stones
  AW?: string[]; // Add White stones
  // 6. Moves
  B?: [string]; // What Black plays
  W?: [string]; // What White Plays
};

export type GameTreeNodeId = number;

export type GameTreeNodeObj = {
  id: GameTreeNodeId;
  data: SgfData;
  parentId: GameTreeNodeId | null;
  children: GameTreeNodeObj[];
};

export type GameTreeNodeObjOnNeo4j = Omit<
  GameTreeNodeObj,
  "children"
>;

//----------------------------------------------------------
// Parsing

export const getId = (
  (id: GameTreeNodeId) => () =>
    id++
)(0);

export function sgfAsString(filename: Filename) {
  const gamePath = join(
    __dirname,
    "../../../../..",
    "games",
    filename
  );

  const sgfString = readFileSync(gamePath).toString();

  return sgfString;
}

export type GameTrees = GameTree[];

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
