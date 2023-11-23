import {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Player } from "@models/exports";

import { BoardEditorProps } from "./BoardEditor";

type StonesCanvasProps = BoardEditorProps;
export function StonesCanvas({
  width,
  height,
  boardSize = 19,
}: StonesCanvasProps) {
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
    const stonesCtx = stonesCanvas.getContext("2d")!;

    function setupGridWidthHeightAndScale() {
      stonesCanvas.style.width = width + "px";
      stonesCanvas.style.height = height + "px";

      // Otherwise we get blurry lines
      // Referenece: [Stack Overflow - Canvas drawings, like lines, are blurry](https://stackoverflow.com/a/59143499/4756173)
      const scale = window.devicePixelRatio;

      stonesCanvas.width = width * scale;
      stonesCanvas.height = height * scale;

      stonesCtx.scale(scale, scale);
    }

    setupGridWidthHeightAndScale();
  }, [width, height]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    const stonesCanvas = stonesCanvasRef.current!;
    const stonesCtx = stonesCanvas.getContext("2d")!;
    const rect = stonesCanvas.getBoundingClientRect();

    stonesCtx.beginPath();
    stonesCtx.arc(
      e.clientX - rect.left,
      e.clientY - rect.top,
      12,
      0,
      2 * Math.PI
    );

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
      width={width}
      height={height}
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
