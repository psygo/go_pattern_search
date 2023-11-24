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
  moveToCoords,
  setupGridWidthHeightAndScale,
} from "./board_utils";
import { GridCanvasProps } from "./GridCanvas";

type StonesCanvasProps = GridCanvasProps;
export function StonesCanvas({
  size,
  boardSize = 19,
  padding = 15,
  onMovesChanged,
}: StonesCanvasProps) {
  const stoneRadius = 12;
  const borderStrokeWidth = 1.5;

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
  const numberingCanvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stonesCanvas = stonesCanvasRef.current!;
    setupGridWidthHeightAndScale(size, stonesCanvas);
    const numberingCanvas = numberingCanvasRef.current!;
    setupGridWidthHeightAndScale(size, numberingCanvas);
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
    const nextMove = coordsToMove(
      boardGrid,
      centerX,
      centerY
    );

    if (!currentMoves.includes(nextMove)) {
      updateAllMovesOnClick(nextMove);
      const newCurrentMoves = currentMoves.concat(nextMove);
      setCurrentMoves(newCurrentMoves);

      if (onMovesChanged) onMovesChanged(newCurrentMoves);

      drawStone(centerX, centerY);
      drawMoveNumber(centerX, centerY);

      toggleCurrentPlayer();
    }
  }

  // Only overwrite all moves if the next move is different.
  function updateAllMovesOnClick(
    nextMove: BoardCoordinates
  ) {
    const lastMove = currentMoves.last();

    const lastMoveIdxOnAllMoves = allMoves.findIndex(
      (m) => m === lastMove
    );
    const nextMoveOnAllMoves =
      allMoves[lastMoveIdxOnAllMoves + 1];

    if (nextMove !== nextMoveOnAllMoves)
      setAllMoves(currentMoves.concat(nextMove));
  }

  function drawStone(x: number, y: number) {
    const stonesCanvas = stonesCanvasRef.current!;
    const stonesCtx = stonesCanvas.getContext("2d")!;

    // 1. Circle
    stonesCtx.beginPath();
    stonesCtx.arc(x, y, stoneRadius, 0, 2 * Math.PI);

    // 2. Fill the Circle
    stonesCtx.fillStyle =
      currentPlayer === Player.Black ? "black" : "white";
    stonesCtx.fill();

    // 3. Border Stroke
    stonesCtx.lineWidth = borderStrokeWidth;
    stonesCtx.strokeStyle =
      currentPlayer === Player.Black ? "white" : "black";
    stonesCtx.stroke();
  }

  function drawMoveNumber(x: number, y: number) {
    const numberingCanvas = numberingCanvasRef.current!;
    const numberingCtx = numberingCanvas.getContext("2d")!;

    const moveNumber = currentMoves.length + 1;

    numberingCtx.textAlign = "center";
    numberingCtx.fillStyle =
      currentPlayer === Player.Black ? "white" : "black";
    numberingCtx.font = "10pt sans-serif";

    numberingCtx.fillText(
      moveNumber.toString(),
      x,
      y + 4.5
    );
  }

  function handleUndo() {
    if (currentMoves.length > 0) {
      // 1. Find Last Move
      const lastMove = currentMoves.last();

      // 2. Find the Stone Coordinates
      const [x, y] = moveToCoords(boardGrid, lastMove);

      // 3. Clear the Stone and the Move Number
      clearStone(x, y);
      clearMoveNumber(x, y);

      // 4. Update Moves
      setCurrentMoves(currentMoves.slice(0, -1));

      if (onMovesChanged) onMovesChanged(currentMoves);
    }
  }

  function clearStone(x: number, y: number) {
    const stonesCanvas = stonesCanvasRef.current!;
    const stonesCtx = stonesCanvas.getContext("2d")!;

    stonesCtx.clearRect(
      x - stoneRadius - borderStrokeWidth,
      y - stoneRadius - borderStrokeWidth,
      2 * (stoneRadius + borderStrokeWidth),
      2 * (stoneRadius + borderStrokeWidth)
    );
  }

  function clearMoveNumber(x: number, y: number) {
    const numberingCanvas = numberingCanvasRef.current!;
    const numberingCtx = numberingCanvas.getContext("2d")!;

    numberingCtx.clearRect(
      x - stoneRadius - borderStrokeWidth,
      y - stoneRadius - borderStrokeWidth,
      2 * (stoneRadius + borderStrokeWidth),
      2 * (stoneRadius + borderStrokeWidth)
    );
  }

  function handleRedo() {
    // 1. Find Next Move
    const nextMoveIdx = currentMoves.length;

    if (nextMoveIdx === allMoves.length) return;

    const nextMove = allMoves[nextMoveIdx];

    // 2. Draw Next Move
    const [x, y] = moveToCoords(boardGrid, nextMove);

    drawStone(x, y);
    drawMoveNumber(x, y);

    // 3. Update Moves and Player
    toggleCurrentPlayer();
    setCurrentMoves(currentMoves.concat(nextMove));

    if (onMovesChanged) onMovesChanged(currentMoves);
  }

  return (
    <Stack position="absolute" spacing={1}>
      <Stack id="canvases">
        <canvas
          id="numbering"
          style={{
            zIndex: 3,
            position: "absolute",
            pointerEvents: "none",
          }}
          ref={numberingCanvasRef}
        ></canvas>
        <canvas
          id="stones"
          style={{ zIndex: 2 }}
          ref={stonesCanvasRef}
          onClick={handleClick}
        ></canvas>
      </Stack>

      <Stack
        id="board-controls"
        direction="row"
        justifyContent="center"
      >
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
