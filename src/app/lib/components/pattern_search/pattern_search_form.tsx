"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Stack,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";

import { BoardEditor } from "@components/board_editor/exports";

export function PatternSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pattern = searchParams.get("pattern") ?? "";
  const isStoneSearch =
    searchParams.get("stone-search") === "true";

  return (
    <>
      <BoardEditor />

      <form id="pattern-search">
        <Stack spacing={2} width={200}>
          {/* TODO: This is only temporary, this should actually be tracked by the board editor */}
          <TextField
            id="pattern"
            value={pattern}
            onChange={(e) => {
              router.push(
                `?pattern=${e.target.value}&stone-search=${isStoneSearch}`,
                {
                  scroll: false,
                }
              );
            }}
          />
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
      </form>
    </>
  );
}
