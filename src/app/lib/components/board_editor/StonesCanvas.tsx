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
  drawMoveNumberOnCtx,
  drawStoneOnCtx,
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

  // function whichPlayer() {
  //   return initialMoves
  //     ? initialMoves.length % 2 === 0
  //       ? Player.Black
  //       : Player.White
  //     : Player.White;
  // }

  const [currentPlayer, setCurrentPlayer] = useState(
    // whichPlayer()
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

    // if (initialMoves) {
    //   const stonesCtx = stonesCanvas.getContext("2d")!;
    //   const numberingCtx =
    //     numberingCanvas.getContext("2d")!;

    //   for (const [i, move] of initialMoves.entries()) {
    //     const idxX = BoardCoordinateValues.findIndex(
    //       (bc) => bc === move[0]
    //     );
    //     const idxY = BoardCoordinateValues.findIndex(
    //       (bc) => bc === move[1]
    //     );

    //     const x = boardGrid[idxX - 1];
    //     const y = boardGrid[idxY - 1];

    //     const whichPlayer =
    //       i % 2 === 0 ? Player.Black : Player.White;

    //     drawStoneOnCtx(stonesCtx, x, y, whichPlayer);
    //     drawMoveNumberOnCtx(
    //       numberingCtx,
    //       x,
    //       y,
    //       whichPlayer,
    //       i + 1
    //     );
    //   }
    // }
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

    drawStoneOnCtx(stonesCtx, x, y, currentPlayer);
  }

  function drawMoveNumber(x: number, y: number) {
    const numberingCanvas = numberingCanvasRef.current!;
    const numberingCtx = numberingCanvas.getContext("2d")!;

    const moveNumber = currentMoves.length + 1;

    drawMoveNumberOnCtx(
      numberingCtx,
      x,
      y,
      currentPlayer,
      moveNumber
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
