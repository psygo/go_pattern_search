import { Box } from "@mui/material";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";
import { StonesCanvas } from "./StonesCanvas";

export type BoardEditorProps = {
  width: number;
  height: number;
};
export function BoardEditor({
  width,
  height,
}: BoardEditorProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <StonesCanvas width={width} height={height} />
      <GridCanvas width={width} height={height} />
      <BackgroundCanvas width={width} height={height} />
    </Box>
  );
}
