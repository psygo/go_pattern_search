import { Box } from "@mui/material";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";
import { StonesCanvas } from "./StonesCanvas";

export type BoardEditorProps = {
  width: number;
  height: number;
  boardSize?: number;
};
export function BoardEditor({
  width,
  height,
  boardSize = 19,
}: BoardEditorProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <StonesCanvas
        width={width}
        height={height}
        boardSize={boardSize}
      />
      <GridCanvas
        width={width}
        height={height}
        boardSize={boardSize}
      />
      <BackgroundCanvas width={width} height={height} />
    </Box>
  );
}
