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
  defaultBorderStrokeWidth,
  defaultMoveNumberFontSize,
  defaultStoneRadius,
  drawInitialMoves,
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

export type MovesCanvasProps = BoardEditorProps &
  WithPadding;
export function MovesCanvas({
  initialMoves,
  onMovesChanged,
  size = defaultSize,
  boardSize = defaultBoardSize,
  padding = defaultPadding,
  showControls = defaultShowControls,
  disableEditing = defaultDisableInteraction,
  disableInteraction = defaultDisableInteraction,
}: MovesCanvasProps) {
  const scale = size / defaultSize;

  const boardGrid = boardGridArray(
    size - padding * scale,
    boardSize,
    padding * scale
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

  // TODO: Create contexts and separate each subcanvas into
  //       a different component.
  const stonesCanvasRef = useRef<HTMLCanvasElement>(null);
  const numberingCanvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stonesCanvas = stonesCanvasRef.current!;
    const numberingCanvas = numberingCanvasRef.current!;

    setupGridWidthHeightAndScale(size, stonesCanvas);
    setupGridWidthHeightAndScale(size, numberingCanvas);

    if (initialMoves) {
      drawInitialMoves(
        boardGrid,
        stonesCanvas,
        numberingCanvas,
        initialMoves,
        scale
      );
    }
    // Don't include `boardGrid`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, initialMoves]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    if (disableEditing) return;
    if (disableInteraction) return;

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
      onMovesChangedHook(newCurrentMoves, currentPlayer);

      drawStone(
        stonesCanvas,
        centerX,
        centerY,
        currentPlayer,
        defaultStoneRadius * scale,
        defaultBorderStrokeWidth * scale
      );
      drawMoveNumber(
        numberingCanvasRef.current!,
        centerX,
        centerY,
        currentPlayer,
        currentMoves.length + 1,
        defaultMoveNumberFontSize * scale
      );

      toggleCurrentPlayer();
    }
  }

  function onMovesChangedHook(
    moves: BoardCoordinates[],
    player: Player
  ) {
    if (onMovesChanged)
      onMovesChanged(moves.last(), player);
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
    if (disableInteraction) return;

    if (currentMoves.length > 0) {
      // 1. Find Last Move
      const lastMove = currentMoves.last();

      // 2. Find the Stone Coordinates
      const [x, y] = moveToCoords(boardGrid, lastMove);

      // 3. Clear the Stone and the Move Number
      clearStone(x, y);
      clearMoveNumber(x, y);

      // 4. Update Moves and Player
      const updatedMoves = currentMoves.slice(0, -1);

      onMovesChangedHook(updatedMoves, currentPlayer);

      toggleCurrentPlayer();
      setCurrentMoves(updatedMoves);
    }
  }

  function clearStone(x: number, y: number) {
    const stonesCanvas = stonesCanvasRef.current!;
    const stonesCtx = stonesCanvas.getContext("2d")!;

    stonesCtx.clearRect(
      x - stoneFullRadius * scale,
      y - stoneFullRadius * scale,
      stoneFullDiameter * scale,
      stoneFullDiameter * scale
    );
  }

  function clearMoveNumber(x: number, y: number) {
    const numberingCanvas = numberingCanvasRef.current!;
    const numberingCtx = numberingCanvas.getContext("2d")!;

    numberingCtx.clearRect(
      x - stoneFullRadius * scale,
      y - stoneFullRadius * scale,
      stoneFullDiameter * scale,
      stoneFullDiameter * scale
    );
  }

  function handleRedo() {
    if (disableInteraction) return;

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
      currentPlayer,
      defaultStoneRadius * scale,
      defaultBorderStrokeWidth * scale
    );
    drawMoveNumber(
      numberingCanvasRef.current!,
      x,
      y,
      currentPlayer,
      currentMoves.length + 1,
      defaultMoveNumberFontSize * scale
    );

    // 3. Update Moves and Player
    const updatedMoves = currentMoves.concat(nextMove);

    onMovesChangedHook(updatedMoves, currentPlayer);

    toggleCurrentPlayer();
    setCurrentMoves(updatedMoves);
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

      {!disableInteraction && showControls && (
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
