import { useEffect, useRef } from "react";

import {
  BoardEditorProps,
  defaultSize,
} from "./BoardEditor";

type BackgroundCanvasProps = Pick<BoardEditorProps, "size">;
export function BackgroundCanvas({
  size = defaultSize,
}: BackgroundCanvasProps) {
  const backgroundCanvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function setupBackground() {
      const backgroundCanvas = backgroundCanvasRef.current!;
      const backgroundCtx =
        backgroundCanvas.getContext("2d")!;

      backgroundCtx.fillStyle = "#E4B063";
      backgroundCtx.fillRect(0, 0, size, size);
    }

    setupBackground();
  }, [size]);

  return (
    <canvas
      ref={backgroundCanvasRef}
      width={size}
      height={size}
      style={{ zIndex: 0 }}
      id="background"
    ></canvas>
  );
}
