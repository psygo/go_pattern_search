import {
  Sgf,
  SgfData,
  TreeNodeId,
  WithGameId,
} from "./utils/exports";

export type GameNode = WithGameId & {
  sgf: Sgf;
  data: SgfData;
};

export type MoveNode = Omit<GameNode, "sgf"> & {
  parentId: TreeNodeId;
};

export enum BoardCoordinate {
  BEGINNING_OF_GAME = "Beginning of the Game",
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
  H = "h",
  I = "i",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  O = "o",
  P = "p",
  Q = "q",
  R = "r",
  S = "s",
  T = "t",
  U = "u",
  V = "v",
  W = "w",
  X = "x",
  Y = "y",
  Z = "z",
}

export const allCoords: BoardNodeProperties[] = [];
Object.values(BoardCoordinate).forEach((b1) => {
  Object.values(BoardCoordinate).forEach((b2) => {
    allCoords.push({ x: b1, y: b2 });
  });
});

export type BoardNodeProperties = {
  x: BoardCoordinate;
  y: BoardCoordinate;
};

export function stringToBoardCoordinate(
  s: string
): BoardCoordinate {
  return Object.values(BoardCoordinate).find(
    (linkLabel) => linkLabel === s.toLowerCase()
  )!;
}

export function stringToDoubleBoardCoordinate(
  s: string
): BoardNodeProperties {
  return {
    x: stringToBoardCoordinate(s[0]),
    y: stringToBoardCoordinate(s[1]),
  };
}
