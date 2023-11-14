import {
  BoardCoordinate,
  BoardNodeProperties,
} from "./game_node_models";

export interface MoveToMoveProperties {
  from:
    | BoardNodeProperties
    | BoardCoordinate.BEGINNING_OF_GAME;
  to: BoardNodeProperties;
}
