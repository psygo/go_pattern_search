import {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BoardCoordinate,
  BoardCoordinates,
  Player,
} from "@models/exports";

import {
  boardGridArray,
  coordsToMove,
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
  const [moves, setMoves] = useState<BoardCoordinates[]>(
    []
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
    const move = coordsToMove(boardGrid, centerX, centerY);

    if (!moves.includes(move)) {
      setMoves(moves.concat(move));

      // 1. Stone
      stonesCtx.beginPath();
      stonesCtx.arc(centerX, centerY, 12, 0, 2 * Math.PI);

      stonesCtx.fillStyle =
        currentPlayer === Player.Black ? "black" : "white";
      stonesCtx.fill();
      stonesCtx.lineWidth = 1.5;
      stonesCtx.strokeStyle =
        currentPlayer === Player.Black ? "white" : "black";
      stonesCtx.stroke();

      // 2. Move Numbering
      const moveNumber = moves.length + 1;
      stonesCtx.textAlign = "center";
      stonesCtx.fillStyle =
        currentPlayer === Player.Black ? "white" : "black";
      stonesCtx.font = "10pt sans-serif";
      stonesCtx.fillText(
        moveNumber.toString(),
        centerX,
        centerY + 4.5
      );

      toggleCurrentPlayer();
    }
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
