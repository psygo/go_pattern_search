import _ from "lodash";

import {
  BoardCoordinates,
  coordinateComplement,
  stringToBoardCoordinate,
} from "@models/exports";
import { Pattern } from "../../models/validation/pattern";

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
// 1. Reflections

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
function reflectHorizontally(
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
function reflectVertically(coordinates: BoardCoordinates) {
  const x = coordinateComplement(
    stringToBoardCoordinate(coordinates[0])
  );
  const y = coordinates[1];

  return `${x}${y}` as BoardCoordinates;
}

//----------------------------------------------------------
// 2. Permutations

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
// 3. Global Rotations

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
function globalRotate90(coordinates: BoardCoordinates) {
  const x = coordinateComplement(
    stringToBoardCoordinate(coordinates[1])
  );
  const y = coordinates[0];

  return `${x}${y}` as BoardCoordinates;
}

/**
 * E.g. 'bc' -90-> 'qb' -90-> 'rq'
 */
function globalRotate180(coordinates: BoardCoordinates) {
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
function globalRotate270(coordinates: BoardCoordinates) {
  const x = coordinates[1];
  const y = coordinateComplement(
    stringToBoardCoordinate(coordinates[0])
  );

  return `${x}${y}` as BoardCoordinates;
}

//----------------------------------------------------------
