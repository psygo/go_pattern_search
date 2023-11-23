import {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { IconButton, Stack } from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

import { BoardCoordinates, Player } from "@models/exports";

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
  const [currentMoves, setCurrentMoves] = useState<
    BoardCoordinates[]
  >([]);
  const [allMoves, setAllMoves] = useState<
    BoardCoordinates[]
  >([]);

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

    if (!currentMoves.includes(move)) {
      setCurrentMoves(currentMoves.concat(move));
      setAllMoves(currentMoves.concat(move));

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
      const moveNumber = currentMoves.length + 1;
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

  function handleUndo() {
    // 1. Find Last Move
    const lastMove = currentMoves.last();

    // 2. Find the Stone Coordinates

    // 3. Clear the Stone

    // 4. Update Moves
  }

  function handleRedo() {
    // 1. Find Next Move
    // 2. Draw Next Move
    //    Probably the same as clicking
    // 3. Update Moves
  }

  return (
    <Stack position="absolute" spacing={1}>
      <canvas
        ref={stonesCanvasRef}
        onClick={handleClick}
        style={{
          position: "relative",
          zIndex: 2,
        }}
        id="stones"
      ></canvas>
      <Stack direction="row" justifyContent="center">
        <IconButton onClick={handleUndo}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={handleRedo}>
          <ArrowForward />
        </IconButton>
      </Stack>
    </Stack>
  );
}
