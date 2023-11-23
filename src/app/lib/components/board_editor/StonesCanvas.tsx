import {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Player } from "@models/exports";

import {
  boardGridArray,
  findWhereToPutStoneOnGrid,
  setupGridWidthHeightAndScale,
} from "./board_utils";
import { GridCanvasProps } from "./GridCanvas";

type StonesCanvasProps = GridCanvasProps;
export function StonesCanvas({
  size,
  boardSize = 19,
  padding = 15,
}: StonesCanvasProps) {
  const boardGrid = boardGridArray(
    size,
    boardSize,
    padding
  );

  const [currentPlayer, setCurrentPlayer] = useState(
    Player.Black
  );

  const toggleCurrentPlayer = useCallback(() => {
    setCurrentPlayer(
      currentPlayer === Player.Black
        ? Player.White
        : Player.Black
    );
  }, [currentPlayer]);

  const stonesCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stonesCanvas = stonesCanvasRef.current!;
    setupGridWidthHeightAndScale(size, stonesCanvas);
  }, [size]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    const stonesCanvas = stonesCanvasRef.current!;
    const stonesCtx = stonesCanvas.getContext("2d")!;
    const rect = stonesCanvas.getBoundingClientRect();

    const [x, y] = [
      e.clientX - rect.left,
      e.clientY - rect.top,
    ];

    const [centerX, centerY] = findWhereToPutStoneOnGrid(
      boardGrid,
      x,
      y
    );

    stonesCtx.beginPath();
    stonesCtx.arc(centerX, centerY, 12, 0, 2 * Math.PI);

    stonesCtx.fillStyle =
      currentPlayer === Player.Black ? "black" : "white";
    stonesCtx.fill();
    stonesCtx.lineWidth = 1.5;
    stonesCtx.strokeStyle =
      currentPlayer === Player.Black ? "white" : "black";
    stonesCtx.stroke();

    toggleCurrentPlayer();
  }

  return (
    <canvas
      ref={stonesCanvasRef}
      onClick={handleClick}
      style={{
        position: "absolute",
        zIndex: 2,
      }}
      id="stones"
    ></canvas>
  );
}
