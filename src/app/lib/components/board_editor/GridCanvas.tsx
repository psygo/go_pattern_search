import { useEffect, useRef } from "react";

import {} from "@utils/array";

import { boardCoordinatesIterator } from "@models/board_coordinates";

import {
  boardGridArray,
  boardGridIterator,
} from "./board_utils";
import { BoardEditorProps } from "./BoardEditor";

type GridCanvasProps = BoardEditorProps;
export function GridCanvas({
  size,
  boardSize = 19,
}: GridCanvasProps) {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current!;
    const gridCtx = gridCanvas.getContext("2d")!;

    function setupGridWidthHeightAndScale() {
      gridCanvas.style.width = size + "px";
      gridCanvas.style.height = size + "px";

      // Otherwise we get blurry lines
      // Referenece: [Stack Overflow - Canvas drawings, like lines, are blurry](https://stackoverflow.com/a/59143499/4756173)
      const scale = window.devicePixelRatio;

      gridCanvas.width = size * scale;
      gridCanvas.height = size * scale;

      gridCtx.scale(scale, scale);
    }

    function drawGrid() {
      const p = 15;
      const grid = boardGridArray(size, boardSize, p);

      const lastGridLineCoord = grid.last();

      function drawXGrid() {
        const xCoordLegendIterator =
          boardCoordinatesIterator();

        for (const x of grid) {
          const legendX = (
            xCoordLegendIterator.next().value as string
          ).toUpperCase();

          gridCtx.moveTo(x, p);
          gridCtx.fillText(legendX, x - 2.5, p - 2.5);
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

          gridCtx.moveTo(p, y);
          gridCtx.fillText(legendY, p - 10, y + 5);
          gridCtx.lineTo(lastGridLineCoord, y);
        }
      }

      drawXGrid();
      drawYGrid();

      gridCtx.strokeStyle = "black";
      gridCtx.stroke();
    }

    function setupGrid() {
      setupGridWidthHeightAndScale();
      drawGrid();
    }

    setupGrid();
  }, [size, boardSize]);

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
