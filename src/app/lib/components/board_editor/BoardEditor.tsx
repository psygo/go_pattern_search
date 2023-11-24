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
  onMovesChanged?: (moves: BoardCoordinates[]) => {};
  size?: number;
  boardSize?: number;
  showControls?: boolean;
  disableEditing?: boolean;
};
export function BoardEditor({
  onMovesChanged,
  size = defaultSize,
  boardSize = defaultBoardSize,
  showControls = defaultShowControls,
  disableEditing = defaultDisableInteraction,
}: BoardEditorProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <StonesCanvas
        size={size}
        boardSize={boardSize}
        onMovesChanged={onMovesChanged}
        showControls={showControls}
        disableEditing={disableEditing}
      />
      <GridCanvas size={size} boardSize={boardSize} />
      <BackgroundCanvas size={size} />
    </Box>
  );
}
