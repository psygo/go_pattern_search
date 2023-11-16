// @ts-ignore
import GameTree from "@sabaki/immutable-gametree";

export type GameTrees = GameTree[];

export type TreeNodeId = number;
export type ParentId = TreeNodeId | null;

export type WithTreeNodeId = {
  id: TreeNodeId;
};
export type WithParentId = {
  parentId: ParentId;
};
