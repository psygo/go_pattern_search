import { useEffect, useRef } from "react";

import { boardGridIterator } from "./board_utils";
import { BoardEditorProps } from "./BoardEditor";
import { boardCoordinatesIterator } from "../../models/board_coordinates";

type GridCanvasProps = BoardEditorProps;
export function GridCanvas({
  width,
  height,
  boardSize = 19,
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
      const xCoordLegendIterator =
        boardCoordinatesIterator();
      for (const x of boardGridIterator(width, boardSize)) {
        const legend = (
          xCoordLegendIterator.next().value as string
        ).toUpperCase();

        gridCtx.moveTo(0.5 + x + p, p);
        gridCtx.fillText(legend, x + p - 2.5, p - 2.5);
        gridCtx.lineTo(0.5 + x + p, height + p);
      }

      const yCoordLegendIterator =
        boardCoordinatesIterator();
      for (const y of boardGridIterator(
        height,
        boardSize
      )) {
        const legend = (
          yCoordLegendIterator.next().value as string
        ).toUpperCase();

        gridCtx.moveTo(p, 0.5 + y + p);
        gridCtx.fillText(legend, p - 10, y + p + 5);
        gridCtx.lineTo(width + p, 0.5 + y + p);
      }

      gridCtx.strokeStyle = "black";
      gridCtx.stroke();
    }

    function setupGrid() {
      setupGridWidthHeightAndScale();
      drawGrid();
    }

    setupGrid();
  }, [width, height, boardSize]);

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
