import { useRef } from "react";

import { Box } from "@mui/material";

import { BackgroundCanvas } from "./BackgroundCanvas";
import { GridCanvas } from "./GridCanvas";

export type BoardEditorProps = {
  width: number;
  height: number;
};
export function BoardEditor({width, height}: BoardEditorProps) {
  const stonesCanvasRef = useRef(
    document.createElement("canvas")
  );

  return (
    <Box sx={{ position: "relative" }}>
      <canvas
        width={width}
        height={height}
        ref={stonesCanvasRef}
        style={{
          position: "absolute",
          zIndex: 2,
        }}
        id="stones"
      ></canvas>
      <GridCanvas width={width} height={height} />
      <BackgroundCanvas width={width} height={height} />
    </Box>
  );
}
