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

//----------------------------------------------------------
// 2. Game Tree on Neo4j

export type WithAddedStones = {
  ab: string;
  aw: string;
};

export type GameNodeData = Pick<SgfData, "AB" | "AW">;

export type GameNode = WithGameId &
  WithTreeNodeId &
  WithSgf & {
    id: number;
    data: GameNodeData;
  } & WithAddedStones;

export type NeoGameNode = WithId & {
  type: NeoNodeLabel.GameNode;
  properties: GameNode;
};

export type MoveNodeData = Pick<
  SgfData,
  "AB" | "AW" | "B" | "W"
> & {
  move: BoardCoordinates;
} & WithAddedStones;

export type MoveNode = WithGameId &
  WithTreeNodeId &
  WithParentId &
  MoveNodeData;

export type NeoMoveNove = WithId & {
  type: NeoNodeLabel.MoveNode;
  properties: MoveNode;
};

export type GameTreeNodeObj = WithTreeNodeId & {
  data: SgfData;
  parentId: TreeNodeId | null;
  children: GameTreeNodeObj[];
};

//----------------------------------------------------------
