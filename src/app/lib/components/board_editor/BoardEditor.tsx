import { Box, Paper } from "@mui/material";

import { BoardCoordinates } from "@models/board_coordinates";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";
import { MovesCanvas } from "./MovesCanvas";

export const defaultSize = 500;
export const defaultPadding = 20;
export const defaultBoardSize = 19;
export const defaultShowControls = true;
export const defaultShowCoords = true;
export const defaultDisableInteraction = false;

// TODO: Add toggle numbering
export type BoardEditorProps = {
  initialMoves?: BoardCoordinates[];
  onMovesChanged?: (moves: BoardCoordinates[]) => {};
  size?: number;
  boardSize?: number;
  showControls?: boolean;
  showCoords?: boolean;
  disableEditing?: boolean;
  disableInteraction?: boolean;
};
export function BoardEditor({
  initialMoves,
  onMovesChanged,
  size = defaultSize,
  boardSize = defaultBoardSize,
  showControls = defaultShowControls,
  showCoords = defaultShowCoords,
  disableEditing = defaultDisableInteraction,
  disableInteraction = defaultDisableInteraction,
}: BoardEditorProps) {
  return (
    <Box
      sx={{
        p: 2,
        pb: 6,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <MovesCanvas
        initialMoves={initialMoves}
        onMovesChanged={onMovesChanged}
        size={size}
        boardSize={boardSize}
        showControls={showControls}
        disableEditing={disableEditing}
        disableInteraction={disableInteraction}
      />
      <GridCanvas
        size={size}
        boardSize={boardSize}
        showCoords={showCoords}
      />
      <BackgroundCanvas size={size} />
    </Box>
  );
}
