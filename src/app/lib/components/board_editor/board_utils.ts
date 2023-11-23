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
