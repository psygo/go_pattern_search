import { useEffect, useRef } from "react";

export type BackgroundCanvasProps = {
  width: number;
  height: number;
};
export function BackgroundCanvas({
  width,
  height,
}: BackgroundCanvasProps) {
  const backgroundCanvasRef = useRef(
    document.createElement("canvas")
  );

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
