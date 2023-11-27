"use client";

import { FormEvent, useState } from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Button,
  Paper,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";

import { API_URL } from "@config/api_config";

import { NeoGameNode, Player } from "@models/exports";

import { BoardEditor } from "@components/board_editor/exports";

import { useMovesContext } from "./MovesContext";

export function PatternSearchForm() {
  // const router = useRouter();
  // const searchParams = useSearchParams();

  const [isStonesSearch, setIsStonesSearch] =
    useState(false);

  const { movesAndStones, setMovesAndStones } =
    useMovesContext();

  const [gameNodesFound, setGameNodesFound] = useState<
    NeoGameNode[]
  >([]);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const movesAsString = movesAndStones.moves.join("");
    const blackStones = movesAndStones.blackStones.join("");
    const whiteStones = movesAndStones.whiteStones.join("");

    const url = isStonesSearch
      ? `${API_URL}/pattern-search/stones/${blackStones}/${whiteStones}`
      : `${API_URL}/pattern-search/sequential/${movesAsString}`;

    console.log(url);

    const res = await fetch(url);

    const gameNodes: NeoGameNode[] = await res.json();

    console.log(gameNodes);

    setGameNodesFound(gameNodes);
  }

  return (
    <>
      <form id="pattern-search" onSubmit={handleSubmit}>
        <Stack spacing={2} direction="row">
          <Stack id="filters" spacing={2}>
            <ToggleButton
              sx={{ maxWidth: "max-content" }}
              value="check"
              selected={isStonesSearch}
              onChange={() => {
                setIsStonesSearch(!isStonesSearch);
                // router.push(
                //   `/pattern-search/stones/${movesAndStones.blackStones}/${movesAndStones.whiteStones}`,
                //   {
                //     scroll: false,
                //   }
                // );
              }}
            >
              <Typography variant="caption">
                Stone Search
              </Typography>
            </ToggleButton>

            <Button type="submit" variant="contained">
              <Typography>Search</Typography>
            </Button>
          </Stack>

          <BoardEditor
            size={400}
            showControls={false}
            initialMoves={movesAndStones.moves}
            onMovesChanged={(m, p) => {
              const updatedBlackStones =
                p === Player.Black
                  ? movesAndStones.blackStones.concat(m)
                  : movesAndStones.blackStones;
              const updatedWhiteStones =
                p === Player.White
                  ? movesAndStones.whiteStones.concat(m)
                  : movesAndStones.whiteStones;

              setMovesAndStones({
                moves: movesAndStones.moves.concat(m),
                blackStones: updatedBlackStones,
                whiteStones: updatedWhiteStones,
              });
            }}
          />
        </Stack>
      </form>

      {gameNodesFound.length > 0 && (
        <Stack spacing={1}>
          <Typography>Search Results</Typography>
          {gameNodesFound.map((g, i) => {
            return (
              <Paper key={i} variant="outlined">
                <Stack direction="row">
                  <BoardEditor
                    initialMoves={
                      g.properties.first_20_moves
                    }
                    disableEditing={true}
                    disableInteraction={true}
                    showCoords={false}
                    showControls={false}
                    size={200}
                  />

                  <Stack
                    spacing={2}
                    mt={-10}
                    justifyContent="center"
                  >
                    <Typography>
                      {g.properties.filename}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </>
  );
}
