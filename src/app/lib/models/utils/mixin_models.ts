export type TreeNodeId = number;
export type ParentId = TreeNodeId | null;

export type GameId = string;

export type WithGameId = {
  game_id: GameId;
};

export type WithTreeNodeId = {
  id: TreeNodeId;
};
export type WithParentId = {
  parentId: ParentId
};

export type WithCreatedAt = {
  created_at: number;
};

export type WithExtId = {
  ext_id: string;
};
