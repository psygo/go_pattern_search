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

export const BoardCoordinateValues =
  Object.values(BoardCoordinate);

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
  return BoardCoordinateValues.find(
    (bc) => bc === s.toLowerCase()
  )!;
}

export function boardCoordinatesIterator() {
  return BoardCoordinateValues.slice(1).values();
}

export function coordinateComplement(
  bc: BoardCoordinate,
  boardSize: number = 19
) {
  const bcIdx = BoardCoordinateValues.indexOf(bc);

  // `+ 1` because of `BoardCoordinate.BEGINNING_OF_GAME`
  const bcComplementIdx = boardSize - bcIdx + 1;

  return stringToBoardCoordinate(
    BoardCoordinateValues[bcComplementIdx]
  );
}
