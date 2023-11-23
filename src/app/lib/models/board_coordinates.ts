/**
 * Goes up to 26x26 with this alphabet (A-Z).
 */
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

/**
 * Source [Stack Overflow - *How do I declare a string that is of a specific length using typescript?*](https://stackoverflow.com/a/77232369/4756173)
 */
export type BoardCoordinates = {
  0: string;
  length: 2;
} & string;

export function stringToBoardCoordinate(
  s: string
): BoardCoordinate {
  return Object.values(BoardCoordinate).find(
    (bc) => bc === s.toLowerCase()
  )!;
}

export function boardCoordinatesIterator() {
  return Object.values(BoardCoordinate).slice(1).values();
}

export function coordinateComplement(
  bc: BoardCoordinate,
  boardSize: number = 19
) {
  const boardCoordinatesArray =
    Object.values(BoardCoordinate);

  const bcIdx = boardCoordinatesArray.indexOf(bc);

  // `+ 1` because of `BoardCoordinate.BEGINNING_OF_GAME`
  const bcComplementIdx = boardSize - bcIdx + 1;

  return stringToBoardCoordinate(
    boardCoordinatesArray[bcComplementIdx]
  );
}
