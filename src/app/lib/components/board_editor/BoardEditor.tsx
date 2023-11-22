import { useEffect, useRef } from "react";

import { Box } from "@mui/material";

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
    const gridCtx = gridCanvas.getContext("2d")!;
    const p = 10;

    gridCanvas.style.width = width + "px";
    gridCanvas.style.height = height + "px";

    // Otherwise we get blurry lines
    // Referenece: [Stack Overflow - Canvas drawings, like lines, are blurry](https://stackoverflow.com/a/59143499/4756173)
    const scale = window.devicePixelRatio;

    gridCanvas.width = width * scale;
    gridCanvas.height = height * scale;

    gridCtx.scale(scale, scale);

    const step = width / 19;
    for (let x = 0; x <= width; x += step) {
      gridCtx.moveTo(0.5 + x + p, p);
      gridCtx.lineTo(0.5 + x + p, height + p);
    }

    for (let x = 0; x <= height; x += step) {
      gridCtx.moveTo(p, 0.5 + x + p);
      gridCtx.lineTo(width + p, 0.5 + x + p);
    }

    gridCtx.strokeStyle = "black";
    gridCtx.stroke();
  }

  useEffect(() => {
    setupBackground();
    setupGrid();
  }, []);

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
      <canvas
        ref={gridCanvasRef}
        style={{
          position: "absolute",
          zIndex: 1,
        }}
        id="grid"
      ></canvas>
      <canvas
        ref={backgroundCanvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          zIndex: 0,
        }}
        id="background"
      ></canvas>
    </Box>
  );
}
