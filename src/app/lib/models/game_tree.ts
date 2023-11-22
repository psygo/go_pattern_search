// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";

import {
  NeoNodeLabel,
  WithId,
} from "@models/utils/exports";

import { SgfData, WithSgf } from "./sgf";
import { BoardCoordinates } from "./board_coordinates";

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

export type GameTreeNodeObj = WithTreeNodeId & {
  data: SgfData;
  parentId: TreeNodeId | null;
  children: GameTreeNodeObj[];
};

//----------------------------------------------------------
// 2. Common to Game and Move Nodes

/**
 * All the stones added up to the move.
 *
 * Useful for when doing the stone-based pattern-search.
 */
export type WithAddedStones = {
  all_black_stones?: string;
  all_white_stones?: string;
};

//----------------------------------------------------------
// 3. Game Node

export type GameNodeData = Pick<SgfData, "AB" | "AW"> &
  WithAddedStones;

export type GameNode = WithGameId &
  WithTreeNodeId &
  WithSgf & {
    data: GameNodeData;
  };

export type NeoGameNode = WithId & {
  type: NeoNodeLabel.GameNode;
  properties: GameNode;
};

//----------------------------------------------------------
// 4. Move Node

export type MoveNodeData = Pick<
  SgfData,
  "AB" | "AW" | "B" | "W"
> & {
  move: BoardCoordinates;
} & WithAddedStones;

export type MoveNode = WithGameId &
  WithTreeNodeId &
  WithParentId & { data: MoveNodeData };

export type NeoMoveNove = WithId & {
  type: NeoNodeLabel.MoveNode;
  properties: MoveNode;
};

//----------------------------------------------------------
