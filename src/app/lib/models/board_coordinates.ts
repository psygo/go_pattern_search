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

export type BoardCoordinates = {
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
): BoardCoordinates {
  return {
    x: stringToBoardCoordinate(s[0]),
    y: stringToBoardCoordinate(s[1]),
  };
}
