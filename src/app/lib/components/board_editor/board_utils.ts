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

function findClosest(grid: number[], goal: number) {
  return grid.reduce((prev, curr) =>
    Math.abs(curr - goal) < Math.abs(prev - goal)
      ? curr
      : prev
  );
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
