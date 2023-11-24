import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { BoardCoordinates } from "@models/board_coordinates";

export type CurrentMoveContext = {
  currentMoves: BoardCoordinates[];
  setCurrentMoves: React.Dispatch<
    React.SetStateAction<BoardCoordinates[]>
  >;
};
export const CurrentMovesContext =
  createContext<CurrentMoveContext | null>(null);

type CurrentMovesProviderProps = {
  children: React.ReactNode;
};
export function CurrentMovesProvider({
  children,
}: CurrentMovesProviderProps) {
  const [currentMoves, setCurrentMoves] = useState<
    BoardCoordinates[]
  >([]);

  return (
    <CurrentMovesContext.Provider
      value={{ currentMoves, setCurrentMoves }}
    >
      {children}
    </CurrentMovesContext.Provider>
  );
}

export function useCurrentMovesContext() {
  const currentMovesContext = useContext(
    CurrentMovesContext
  );

  if (!currentMovesContext)
    throw new Error(
      "useCurrentMovesContext can only be used within a CurrentMovesProvider"
    );

  return currentMovesContext;
}
