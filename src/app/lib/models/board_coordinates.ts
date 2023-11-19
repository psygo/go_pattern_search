import _ from "lodash";

//----------------------------------------------------------
// Board Coordinates

/**
 * Goes up to 26x26 with this alphabet (A-Z)
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

//----------------------------------------------------------
// Isomorphisms

// TODO: Are these all the isomorphisms?
export function allIsomorphisms(
  pattern: BoardCoordinates[]
) {
  return _.uniqBy(
    allReflections(pattern)
      .flatMap(allGlobalRotations)
      .flatMap(permute),
    (pattern) => pattern.join("")
  );
}

//----------------------------------------------------------
// Reflections

export function allReflections(
  pattern: BoardCoordinates[]
) {
  return [
    pattern,
    pattern.map(reflectHorizontally),
    pattern.map(reflectVertically),
  ];
}

/**
 * Reflection over a horizontal line in the middle, e.g.
 * 'ab' ---> 'ar'
 */
export function reflectHorizontally(
  coordinates: BoardCoordinates
) {
  const x = coordinates[0];
  const y = coordinateComplement(
    stringToBoardCoordinate(coordinates[1])
  );

  return `${x}${y}` as BoardCoordinates;
}

/**
 * Reflection over a vertical line in the middle, e.g.
 * 'ab' -|-> 'sb'
 */
export function reflectVertically(
  coordinates: BoardCoordinates
) {
  const x = coordinateComplement(
    stringToBoardCoordinate(coordinates[0])
  );
  const y = coordinates[1];

  return `${x}${y}` as BoardCoordinates;
}

//----------------------------------------------------------
// Permutations

// TODO: This might be better off on the frontend instead of
//       annoying the backend.
/**
 * A seemingly very performant way of generating all
 * permutations.
 *
 * Source: [Stack Overflow - *Permutations in JavaScript?*](https://stackoverflow.com/a/37580979/4756173)
 */
export function permute(initialArray: BoardCoordinates[]) {
  const length = initialArray.length;

  let result = [initialArray.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k,
    p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = initialArray[i];
      initialArray[i] = initialArray[k];
      initialArray[k] = p;
      ++c[i];
      i = 1;
      result.push(initialArray.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }

  return result;
}

//----------------------------------------------------------
// Global Rotations

export function allGlobalRotations(
  pattern: BoardCoordinates[]
) {
  return [
    pattern,
    pattern.map(globalRotate90),
    pattern.map(globalRotate180),
    pattern.map(globalRotate270),
  ];
}

/**
 * E.g. 'bc' -90-> 'qb'
 */
export function globalRotate90(
  coordinates: BoardCoordinates
) {
  const x = coordinateComplement(
    stringToBoardCoordinate(coordinates[1])
  );
  const y = coordinates[0];

  return `${x}${y}` as BoardCoordinates;
}

/**
 * E.g. 'bc' -90-> 'qb' -90-> 'rq'
 */
export function globalRotate180(
  coordinates: BoardCoordinates
) {
  const x = coordinateComplement(
    stringToBoardCoordinate(coordinates[0])
  );
  const y = coordinateComplement(
    stringToBoardCoordinate(coordinates[1])
  );

  return `${x}${y}` as BoardCoordinates;
}

/**
 * E.g. 'bc' -90-> 'qb' -90-> 'rq' -90-> 'cr'
 */
export function globalRotate270(
  coordinates: BoardCoordinates
) {
  const x = coordinates[1];
  const y = coordinateComplement(
    stringToBoardCoordinate(coordinates[0])
  );

  return `${x}${y}` as BoardCoordinates;
}

//----------------------------------------------------------
