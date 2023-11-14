import { join } from "path";

// @ts-ignore
import { parseFile } from "@sabaki/sgf";
// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";

import { Filename } from "./files";

export type Sgf = string;

export const getId = (
  (id) => () =>
    id++
)(0);

export type GameTrees = GameTree[];
export function sgfFileToGameTrees(filename: Filename) {
  const gamePath = join(
    __dirname,
    "../../../../..",
    "games",
    filename
  );

  const rootNodes = parseFile(gamePath);

  const gameTrees: GameTree[] = rootNodes.map(
    (rootNode: any) => {
      return new GameTree({ getId, root: rootNode });
    }
  );

  return gameTrees;
}
