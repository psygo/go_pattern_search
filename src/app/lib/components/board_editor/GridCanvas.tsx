import { useEffect, useRef } from "react";

import {} from "@utils/array";

import { boardCoordinatesIterator } from "@models/board_coordinates";

import {
  boardGridArray,
  defaultMoveNumberFontSize,
  setupGridWidthHeightAndScale,
  WithPadding,
} from "./board_utils";
import {
  BoardEditorProps,
  defaultBoardSize,
  defaultPadding,
  defaultSize,
} from "./BoardEditor";

export type GridCanvasProps = Pick<
  BoardEditorProps,
  "size" | "boardSize"
> &
  WithPadding;
export function GridCanvas({
  size = defaultSize,
  boardSize = defaultBoardSize,
  padding = defaultPadding,
}: GridCanvasProps) {
  const scale = size / defaultSize;

  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current!;
    const gridCtx = gridCanvas.getContext("2d")!;

    function drawGrid() {
      const grid = boardGridArray(
        size - padding,
        boardSize,
        padding * scale
      );

      const lastGridLineCoord = grid.last();

      function drawXGrid() {
        const xCoordLegendIterator =
          boardCoordinatesIterator();

        for (const x of grid) {
          const legendX = (
            xCoordLegendIterator.next().value as string
          ).toUpperCase();

          gridCtx.moveTo(x, padding * scale);

          gridCtx.font = `${
            defaultMoveNumberFontSize * scale
          }pt sans-serif`;
          gridCtx.fillText(
            legendX,
            x - 2 * scale,
            padding * scale - 2.5
          );

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

          gridCtx.moveTo(padding * scale, y);

          gridCtx.fillText(
            legendY,
            padding * scale - 10,
            y + 4 * scale
          );
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
  }, [size, boardSize, padding, scale]);

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
