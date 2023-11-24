import {
  BoardCoordinateValues,
  BoardCoordinates,
  Player,
} from "@models/exports";

//----------------------------------------------------------
// 1. Constants

export const TwoPI = 2 * Math.PI;
export const stoneRadius = 12;
export const borderStrokeWidth = 1.5;
export const stoneFullRadius =
  stoneRadius + borderStrokeWidth;
export const stoneFullDiameter = 2 * stoneFullRadius;

//----------------------------------------------------------
// 2. Type Utils

export type WithPadding = {
  padding?: number;
};

//----------------------------------------------------------
// 3. Board-Coord Utils

export function* boardGridIterator(
  length: number,
  boardSize: number,
  padding: number = 15
) {
  const step = length / boardSize;

  for (let x = 0; x <= length; x += step) {
    yield x + padding;
  }
}

export function boardGridArray(
  length: number,
  boardSize: number,
  padding: number = 15
) {
  return [...boardGridIterator(length, boardSize, padding)];
}

function findClosest(array: number[], goal: number) {
  return array.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal)
      ? curr
      : prev
  );
}

export function coordsToMove(
  grid: number[],
  x: number,
  y: number
) {
  const idxX = grid.findIndex((coord) => coord === x);
  const idxY = grid.findIndex((coord) => coord === y);

  const coordX = BoardCoordinateValues[idxX + 1];
  const coordY = BoardCoordinateValues[idxY + 1];

  const move = `${coordX}${coordY}` as BoardCoordinates;

  return move;
}

export function moveToCoords(
  grid: number[],
  move: BoardCoordinates
) {
  const idxX = BoardCoordinateValues.findIndex(
    (bc) => bc === move[0]
  );
  const idxY = BoardCoordinateValues.findIndex(
    (bc) => bc === move[1]
  );

  return [grid[idxX - 1], grid[idxY - 1]];
}

export function findWhereToPutStoneOnGrid(
  grid: number[],
  x: number,
  y: number
) {
  const closestX = findClosest(grid, x);
  const closestY = findClosest(grid, y);

  return [closestX, closestY];
}

export function setupGridWidthHeightAndScale(
  size: number,
  canvas: HTMLCanvasElement
) {
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";

  // Otherwise we get blurry lines
  // Referenece: [Stack Overflow - Canvas drawings, like lines, are blurry](https://stackoverflow.com/a/59143499/4756173)
  const scale = window.devicePixelRatio;

  canvas.width = size * scale;
  canvas.height = size * scale;

  const canvasCtx = canvas.getContext("2d")!;
  canvasCtx.scale(scale, scale);
}

//----------------------------------------------------------
// 4. Drawing

export function drawStoneOnCtx(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  player: Player
) {
  const ctx = canvas.getContext("2d")!;

  // 1. Circle
  ctx.beginPath();
  ctx.arc(x, y, stoneRadius, 0, TwoPI);

  // 2. Fill the Circle
  ctx.fillStyle =
    player === Player.Black ? "black" : "white";
  ctx.fill();

  // 3. Border Stroke
  ctx.lineWidth = borderStrokeWidth;
  ctx.strokeStyle =
    player === Player.Black ? "white" : "black";
  ctx.stroke();
}

export function drawMoveNumberOnCtx(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  player: Player,
  number: number
) {
  const ctx = canvas.getContext("2d")!;

  ctx.textAlign = "center";
  ctx.fillStyle =
    player === Player.Black ? "white" : "black";
  ctx.font = "10pt sans-serif";

  ctx.fillText(number.toString(), x, y + 4.5);
}

//----------------------------------------------------------
