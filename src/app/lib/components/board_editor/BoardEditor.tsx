import { Box } from "@mui/material";

import { BoardCoordinates } from "@models/board_coordinates";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";
import { StonesCanvas } from "./StonesCanvas";

export const defaultSize = 500;
export const defaultPadding = 15;
export const defaultBoardSize = 19;
export const defaultShowControls = true;
export const defaultDisableInteraction = false;

// TODO: Add initial moves setup
export type BoardEditorProps = {
  initialMoves?: BoardCoordinates[];
  onMovesChanged?: (moves: BoardCoordinates[]) => {};
  size?: number;
  boardSize?: number;
  showControls?: boolean;
  disableEditing?: boolean;
};
export function BoardEditor({
  initialMoves,
  onMovesChanged,
  size = defaultSize,
  boardSize = defaultBoardSize,
  showControls = defaultShowControls,
  disableEditing = defaultDisableInteraction,
}: BoardEditorProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <StonesCanvas
        initialMoves={initialMoves}
        onMovesChanged={onMovesChanged}
        size={size}
        boardSize={boardSize}
        showControls={showControls}
        disableEditing={disableEditing}
      />
      <GridCanvas size={size} boardSize={boardSize} />
      <BackgroundCanvas size={size} />
    </Box>
  );
}
