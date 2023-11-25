import {} from "@utils/string";

import {
  BoardCoordinateValues,
  BoardCoordinates,
  Player,
} from "@models/exports";

//----------------------------------------------------------
// 1. Type Utils

export type WithPadding = {
  padding?: number;
};

//----------------------------------------------------------
// 2. Board-Coord Utils

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

function findClosestInGrid(array: number[], goal: number) {
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
    (bc) => bc === move.first()
  );
  const idxY = BoardCoordinateValues.findIndex(
    (bc) => bc === move.second()
  );

  return [grid[idxX - 1], grid[idxY - 1]];
}

export function findWhereToPutStoneOnGrid(
  grid: number[],
  x: number,
  y: number
) {
  const closestX = findClosestInGrid(grid, x);
  const closestY = findClosestInGrid(grid, y);

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

export function moveCoordsFromGridArray(
  grid: number[],
  move: BoardCoordinates
) {
  const idxX = BoardCoordinateValues.findIndex(
    (bc) => bc === move[0]
  );
  const idxY = BoardCoordinateValues.findIndex(
    (bc) => bc === move[1]
  );

  const x = grid[idxX - 1];
  const y = grid[idxY - 1];

  return [x, y];
}

//----------------------------------------------------------
// 4. Drawing

// TODO: Use an object like this instead of the current
//       options
export type GobanOptions = {
  dimensions?: {
    size?: number;
    boardSize?: number;
    padding?: number;
  };
  stones?: {
    stoneRadius?: number;
    stoneBorderStroke?: number;
    moveNumberFont: string;
    moveNumberFontsize: string;
  };
  coordinates?: {
    coordFont?: string;
    coordFontsize?: number;
  };
  interactivity?: {
    showControls?: boolean;
    disableEditing?: boolean;
  };
};

export const TwoPI = 2 * Math.PI;

export const defaultStoneRadius = 11;
export const defaultBorderStrokeWidth = 1.5;
export const stoneFullRadius =
  defaultStoneRadius + defaultBorderStrokeWidth;
export const stoneFullDiameter = 2 * stoneFullRadius;

export function drawStone(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  player: Player,
  stoneRadius: number = defaultStoneRadius,
  borderStrokeWidth: number = defaultBorderStrokeWidth
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

export const defaultMoveNumberFontSize = 10;
export const defaultMoveNumberFont = "sans-serif";

export function drawMoveNumber(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  player: Player,
  number: number,
  fontSize: number = defaultMoveNumberFontSize,
  font: string = defaultMoveNumberFont
) {
  const ctx = canvas.getContext("2d")!;

  ctx.textAlign = "center";
  ctx.fillStyle =
    player === Player.Black ? "white" : "black";
  ctx.font = `${fontSize}pt ${font}`;

  const verticalOffset =
    4.5 * (fontSize / defaultMoveNumberFontSize);

  ctx.fillText(number.toString(), x, y + verticalOffset);
}

export function drawInitialMoves(
  grid: number[],
  stonesCanvas: HTMLCanvasElement,
  numberingCanvas: HTMLCanvasElement,
  initialMoves: BoardCoordinates[],
  scale: number
) {
  for (const [i, move] of initialMoves.entries()) {
    const [x, y] = moveCoordsFromGridArray(grid, move);

    const whichPlayer =
      i % 2 === 0 ? Player.Black : Player.White;

    drawStone(
      stonesCanvas,
      x,
      y,
      whichPlayer,
      defaultStoneRadius * scale,
      defaultBorderStrokeWidth * scale
    );
    drawMoveNumber(
      numberingCanvas,
      x,
      y,
      whichPlayer,
      i + 1,
      defaultMoveNumberFontSize * scale
    );
  }
}

//----------------------------------------------------------
