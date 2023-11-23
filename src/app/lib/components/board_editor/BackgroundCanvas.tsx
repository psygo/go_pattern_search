import { useEffect, useRef } from "react";

import { BoardEditorProps } from "./BoardEditor";

type BackgroundCanvasProps = Omit<
  BoardEditorProps,
  "boardSize"
>;
export function BackgroundCanvas({
  width,
  height,
}: BackgroundCanvasProps) {
  const backgroundCanvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function setupBackground() {
      const backgroundCanvas = backgroundCanvasRef.current!;
      const backgroundCtx =
        backgroundCanvas.getContext("2d")!;

      backgroundCtx.fillStyle = "#E4B063";
      backgroundCtx.fillRect(0, 0, width, height);
    }

    setupBackground();
  }, [width, height]);

  return (
    <canvas
      ref={backgroundCanvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        zIndex: 0,
      }}
      id="background"
    ></canvas>
  );
}
