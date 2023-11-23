import { useEffect, useRef } from "react";

import { BoardEditorProps } from "./BoardEditor";

type GridCanvasProps = BoardEditorProps;
export function GridCanvas({
  width,
  height,
}: GridCanvasProps) {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current!;
    const gridCtx = gridCanvas.getContext("2d")!;
    const p = 10;

    function setupGridWidthHeightAndScale() {
      gridCanvas.style.width = width + "px";
      gridCanvas.style.height = height + "px";

      // Otherwise we get blurry lines
      // Referenece: [Stack Overflow - Canvas drawings, like lines, are blurry](https://stackoverflow.com/a/59143499/4756173)
      const scale = window.devicePixelRatio;

      gridCanvas.width = width * scale;
      gridCanvas.height = height * scale;

      gridCtx.scale(scale, scale);
    }

    function drawGrid() {
      const step = width / 19;
      for (let x = 0; x <= width; x += step) {
        gridCtx.moveTo(0.5 + x + p, p);
        gridCtx.fillText("A", x + p - 2.5, p - 2.5);
        gridCtx.lineTo(0.5 + x + p, height + p);
      }

      for (let x = 0; x <= height; x += step) {
        gridCtx.moveTo(p, 0.5 + x + p);
        gridCtx.fillText("A", p - 10, x + p + 5);
        gridCtx.lineTo(width + p, 0.5 + x + p);
      }

      gridCtx.strokeStyle = "black";
      gridCtx.stroke();
    }

    function setupGrid() {
      setupGridWidthHeightAndScale();
      drawGrid();
    }

    setupGrid();
  }, [width, height]);

  return (
    <canvas
      ref={gridCanvasRef}
      style={{
        position: "absolute",
        zIndex: 1,
      }}
      id="grid"
    ></canvas>
  );
}
