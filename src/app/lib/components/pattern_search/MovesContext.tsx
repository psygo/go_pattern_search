import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { BoardCoordinates } from "@models/board_coordinates";

export type MovesAndStones = {
  moves: BoardCoordinates[];
  blackStones: BoardCoordinates[];
  whiteStones: BoardCoordinates[];
};

export type MovesContextType = {
  movesAndStones: MovesAndStones;
  setMovesAndStones: React.Dispatch<
    React.SetStateAction<MovesAndStones>
  >;
};
export const MovesContext =
  createContext<MovesContextType | null>(null);

type MovesContextProviderProps = {
  children: React.ReactNode;
};
export function MovesContextProvider({
  children,
}: MovesContextProviderProps) {
  const [movesAndStones, setMovesAndStones] =
    useState<MovesAndStones>({
      moves: [],
      blackStones: [],
      whiteStones: [],
    });

  return (
    <MovesContext.Provider
      value={{
        movesAndStones,
        setMovesAndStones,
      }}
    >
      {children}
    </MovesContext.Provider>
  );
}

export function useMovesContext() {
  const ctx = useContext(MovesContext);

  if (!ctx)
    throw new Error("Can't use the MovesContext here");

  return ctx;
}
