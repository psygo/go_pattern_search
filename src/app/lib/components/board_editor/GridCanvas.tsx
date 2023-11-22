import { useEffect, useRef } from "react";

import { BoardEditorProps } from "./BoardEditor";

type GridCanvasProps = BoardEditorProps;
export function GridCanvas({
  width,
  height,
}: GridCanvasProps) {
  const gridCanvasRef = useRef(
    document.createElement("canvas")
  );

  useEffect(() => {
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
