import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export function BoardEditor() {
  const width = 500;
  const height = 500;

  const backgroundCanvasRef = useRef(
    document.createElement("canvas")
  );
  const gridCanvasRef = useRef(
    document.createElement("canvas")
  );
  const stonesCanvasRef = useRef(
    document.createElement("canvas")
  );

  function setupBackground() {
    const backgroundCanvas = backgroundCanvasRef.current!;
    const backgroundCtx =
      backgroundCanvas.getContext("2d")!;

    backgroundCtx.fillStyle = "#E4B063";
    backgroundCtx.fillRect(0, 0, width, height);
  }

  function setupGrid() {
    const gridCanvas = gridCanvasRef.current!;
    const gridCtx = gridCanvas.getContext("2d");
  }

  useEffect(() => {
    setupBackground();
    setupGrid();
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <canvas
        ref={stonesCanvasRef}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
        id="stones"
      ></canvas>
      <canvas
        ref={gridCanvasRef}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        id="grid"
      ></canvas>
      <canvas
        ref={backgroundCanvasRef}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        id="background"
      ></canvas>
    </Box>
  );
}
