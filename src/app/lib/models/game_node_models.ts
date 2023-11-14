export interface GameNodeProperties {
  player_white: string;
  player_black: string;
}

export enum BoardCoordinate {
  A = "a",
  B = "b",
  C = "c",
}

export const allCoords: BoardNodeProperties[] = [];
Object.values(BoardCoordinate).forEach((b1) => {
  Object.values(BoardCoordinate).forEach((b2) => {
    allCoords.push({ x: b1, y: b2 });
  });
});

export interface BoardNodeProperties {
  x: BoardCoordinate;
  y: BoardCoordinate;
}
