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

import {
  BoardCoordinates,
  BoardCoordinateValues,
  Player,
} from "@models/exports";

import {
  boardGridArray,
  coordsToMove,
  drawMoveNumber,
  drawStone,
  findWhereToPutStoneOnGrid,
  moveToCoords,
  setupGridWidthHeightAndScale,
  stoneFullDiameter,
  stoneFullRadius,
  WithPadding,
} from "./board_utils";
import {
  BoardEditorProps,
  defaultBoardSize,
  defaultDisableInteraction,
  defaultPadding,
  defaultShowControls,
  defaultSize,
} from "./BoardEditor";

export type StonesCanvasProps = BoardEditorProps &
  WithPadding;
export function StonesCanvas({
  initialMoves,
  onMovesChanged,
  size = defaultSize,
  boardSize = defaultBoardSize,
  padding = defaultPadding,
  showControls = defaultShowControls,
  disableEditing = defaultDisableInteraction,
}: StonesCanvasProps) {
  const boardGrid = boardGridArray(
    size,
    boardSize,
    padding
  );

  const whichInitialPlayer = initialMoves
    ? initialMoves.length % 2 === 0
      ? Player.Black
      : Player.White
    : Player.White;
  const [currentPlayer, setCurrentPlayer] = useState(
    whichInitialPlayer
  );

  const [currentMoves, setCurrentMoves] = useState<
    BoardCoordinates[]
  >(initialMoves || []);
  const [allMoves, setAllMoves] = useState<
    BoardCoordinates[]
  >(initialMoves || []);

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

    if (initialMoves) {
      for (const [i, move] of initialMoves.entries()) {
        const idxX = BoardCoordinateValues.findIndex(
          (bc) => bc === move[0]
        );
        const idxY = BoardCoordinateValues.findIndex(
          (bc) => bc === move[1]
        );

        const x = boardGrid[idxX - 1];
        const y = boardGrid[idxY - 1];

        const whichPlayer =
          i % 2 === 0 ? Player.Black : Player.White;

        drawStone(stonesCanvas, x, y, whichPlayer);
        drawMoveNumber(
          numberingCanvas,
          x,
          y,
          whichPlayer,
          i + 1
        );
      }
    }
    // Don't include `boardGrid`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, initialMoves]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    if (disableEditing) return;

    const stonesCanvas = stonesCanvasRef.current!;
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

      drawStone(
        stonesCanvas,
        centerX,
        centerY,
        currentPlayer
      );
      drawMoveNumber(
        numberingCanvasRef.current!,
        centerX,
        centerY,
        currentPlayer,
        currentMoves.length + 1
      );

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

  function handleUndo() {
    if (currentMoves.length > 0) {
      // 1. Find Last Move
      const lastMove = currentMoves.last();

      // 2. Find the Stone Coordinates
      const [x, y] = moveToCoords(boardGrid, lastMove);

      // 3. Clear the Stone and the Move Number
      clearStone(x, y);
      clearMoveNumber(x, y);

      // 4. Update Moves and Player
      toggleCurrentPlayer();
      setCurrentMoves(currentMoves.slice(0, -1));

      if (onMovesChanged) onMovesChanged(currentMoves);
    }
  }

  function clearStone(x: number, y: number) {
    const stonesCanvas = stonesCanvasRef.current!;
    const stonesCtx = stonesCanvas.getContext("2d")!;

    stonesCtx.clearRect(
      x - stoneFullRadius,
      y - stoneFullRadius,
      stoneFullDiameter,
      stoneFullDiameter
    );
  }

  function clearMoveNumber(x: number, y: number) {
    const numberingCanvas = numberingCanvasRef.current!;
    const numberingCtx = numberingCanvas.getContext("2d")!;

    numberingCtx.clearRect(
      x - stoneFullRadius,
      y - stoneFullRadius,
      stoneFullDiameter,
      stoneFullDiameter
    );
  }

  function handleRedo() {
    // 1. Find Next Move
    const nextMoveIdx = currentMoves.length;

    if (nextMoveIdx === allMoves.length) return;

    const nextMove = allMoves[nextMoveIdx];

    // 2. Draw Next Move
    const [x, y] = moveToCoords(boardGrid, nextMove);

    drawStone(
      stonesCanvasRef.current!,
      x,
      y,
      currentPlayer
    );
    drawMoveNumber(
      numberingCanvasRef.current!,
      x,
      y,
      currentPlayer,
      currentMoves.length + 1
    );

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

      {showControls && (
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
      )}
    </Stack>
  );
}
