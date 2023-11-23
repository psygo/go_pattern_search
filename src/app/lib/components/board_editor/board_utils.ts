export function* boardGridIterator(
  length: number,
  boardSize: number
) {
  const step = length / boardSize;

  for (let x = 0; x <= length; x += step) {
    yield 0.5 + x;
  }
}
