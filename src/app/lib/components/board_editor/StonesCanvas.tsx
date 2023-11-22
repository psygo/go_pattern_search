import { useRef } from "react";

import { BoardEditorProps } from "./BoardEditor";

type StonesCanvasProps = BoardEditorProps;
export function StonesCanvas({
  width,
  height,
}: StonesCanvasProps) {
  const stonesCanvasRef = useRef(
    document.createElement("canvas")
  );

  return (
    <canvas
      width={width}
      height={height}
      ref={stonesCanvasRef}
      style={{
        position: "absolute",
        zIndex: 2,
      }}
      id="stones"
    ></canvas>
  );
}
