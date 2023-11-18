// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";

import { SgfData, WithSgf } from "./sgf";

//----------------------------------------------------------
// 1. Game Tree Models from Sabaki's SGF Parser

export type GameTrees = GameTree[];

export type TreeNodeId = number;
export type ParentId = TreeNodeId | null;

export type WithTreeNodeId = {
  id: TreeNodeId;
};
export type WithParentId = {
  parentId: ParentId;
};

export type GameId = string;

export type WithGameId = {
  game_id: GameId;
};

//----------------------------------------------------------
// 2. Game Tree on Neo4j

/**
 * Only the necessary data for pattern search, the rest will
 * come from reparsing the SGF string again on the frontend.
 */
export type GameNodeData = Pick<SgfData, "AB" | "AW">;
export type GameNode = WithGameId &
  WithTreeNodeId &
  WithSgf & {
    id: number;
    data: GameNodeData;
  };

export type MoveNodeData = Pick<
  SgfData,
  "AB" | "AW" | "B" | "W"
> & {
  move: string;
};

export type MoveNode = WithGameId &
  WithTreeNodeId &
  WithParentId &
  MoveNodeData;

export type GameTreeNodeObj = WithTreeNodeId & {
  data: SgfData;
  parentId: TreeNodeId | null;
  children: GameTreeNodeObj[];
};

//----------------------------------------------------------
