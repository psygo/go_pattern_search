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
