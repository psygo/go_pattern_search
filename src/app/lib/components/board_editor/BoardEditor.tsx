import { Box } from "@mui/material";

import { BoardCoordinates } from "@models/board_coordinates";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";
import { StonesCanvas } from "./StonesCanvas";

export type BoardEditorProps = {
  size: number;
  boardSize?: number;
  onMovesChanged?: (moves: BoardCoordinates[]) => {};
};
export function BoardEditor({
  size,
  boardSize = 19,
}: BoardEditorProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <StonesCanvas size={size} boardSize={boardSize} />
      <GridCanvas size={size} boardSize={boardSize} />
      <BackgroundCanvas size={size} />
    </Box>
  );
}
