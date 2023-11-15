import { Id } from "./utils/exports";

import {
  BoardCoordinate,
  BoardNodeProperties,
} from "./game_node_models";

export type MoveToMoveProperties = {
  from:
    | BoardNodeProperties
    | BoardCoordinate.BEGINNING_OF_GAME;
  to: BoardNodeProperties;
};

export type PLAYS_FIRST = {
  game_id: Id;
};
export type PLAYS_NEXT = PLAYS_FIRST;
