import { useEffect, useRef } from "react";

import {} from "@utils/array";

import { boardCoordinatesIterator } from "@models/board_coordinates";

import {
  boardGridArray,
  setupGridWidthHeightAndScale,
} from "./board_utils";
import { BoardEditorProps } from "./BoardEditor";

export type GridCanvasProps = BoardEditorProps & {
  padding?: number;
};
export function GridCanvas({
  size,
  boardSize = 19,
  padding = 15,
}: GridCanvasProps) {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current!;
    const gridCtx = gridCanvas.getContext("2d")!;

    function drawGrid() {
      const grid = boardGridArray(size, boardSize, padding);

      const lastGridLineCoord = grid.last();

      function drawXGrid() {
        const xCoordLegendIterator =
          boardCoordinatesIterator();

        for (const x of grid) {
          const legendX = (
            xCoordLegendIterator.next().value as string
          ).toUpperCase();

          gridCtx.moveTo(x, padding);
          gridCtx.fillText(legendX, x - 3, padding - 2.5);
          gridCtx.lineTo(x, lastGridLineCoord);
        }
      }

      function drawYGrid() {
        const yCoordLegendIterator =
          boardCoordinatesIterator();

        for (const y of grid) {
          const legendY = (
            yCoordLegendIterator.next().value as string
          ).toUpperCase();

          gridCtx.moveTo(padding, y);
          gridCtx.fillText(legendY, padding - 10, y + 4);
          gridCtx.lineTo(lastGridLineCoord, y);
        }
      }

      drawXGrid();
      drawYGrid();

      gridCtx.strokeStyle = "black";
      gridCtx.stroke();
    }

    function setupGrid() {
      const gridCanvas = gridCanvasRef.current!;
      setupGridWidthHeightAndScale(size, gridCanvas);
      drawGrid();
    }

    setupGrid();
  }, [size, boardSize, padding]);

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
