"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import { BoardCoordinates } from "@models/board_coordinates";

import { BoardEditor } from "@components/board_editor/exports";

import { useMovesContext } from "./MovesContext";

export function PatternSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pattern = searchParams.get("pattern") ?? "";
  const isStoneSearch =
    searchParams.get("stone-search") === "true";

  const { movesAndStones, setMovesAndStones } =
    useMovesContext();

  return (
    <form id="pattern-search">
      <Stack spacing={2} direction="row">
        <Stack id="filters" spacing={2}>
          <ToggleButton
            sx={{ maxWidth: "max-content" }}
            value="check"
            selected={isStoneSearch}
            onChange={() => {
              router.push(
                `/pattern-search/stones/${pattern}/`,
                {
                  scroll: false,
                }
              );
            }}
          >
            <Typography variant="caption">
              Stone Search
            </Typography>
          </ToggleButton>
        </Stack>

        <BoardEditor
          size={200}
          showCoords={false}
          initialMoves={movesAndStones.moves}
          onMovesChanged={(m) => {
            setMovesAndStones({
              ...movesAndStones,
              moves: m,
            });

            console.log(movesAndStones);
          }}
        />
      </Stack>
    </form>
  );
}
