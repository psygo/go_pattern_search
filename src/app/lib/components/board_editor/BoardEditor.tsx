import { Box } from "@mui/material";

import { BoardCoordinates } from "@models/board_coordinates";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";
import { StonesCanvas } from "./StonesCanvas";

export const defaultSize = 500;
export const defaultPadding = 15;
export const defaultBoardSize = 19;
export const defaultShowControls = true;

// TODO: Add disable interaction
// TODO: Add initial moves setup
export type BoardEditorProps = {
  size?: number;
  boardSize?: number;
  onMovesChanged?: (moves: BoardCoordinates[]) => {};
  showControls?: boolean;
};
export function BoardEditor({
  onMovesChanged,
  size = defaultSize,
  boardSize = defaultBoardSize,
  showControls = defaultShowControls,
}: BoardEditorProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <StonesCanvas
        size={size}
        boardSize={boardSize}
        onMovesChanged={onMovesChanged}
        showControls={showControls}
      />
      <GridCanvas size={size} boardSize={boardSize} />
      <BackgroundCanvas size={size} />
    </Box>
  );
}
