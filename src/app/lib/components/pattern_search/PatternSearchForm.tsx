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

import { BoardEditor } from "@components/board_editor/exports";
import { BoardCoordinates } from "../../models/board_coordinates";

export function PatternSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pattern = searchParams.get("pattern") ?? "";
  const isStoneSearch =
    searchParams.get("stone-search") === "true";

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
                `?pattern=${pattern}&stone-search=${!isStoneSearch}`,
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
          initialMoves={
            ["ff", "gg", "hh"] as BoardCoordinates[]
          }
        />
      </Stack>
    </form>
  );
}
