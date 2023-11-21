import { z } from "zod";

import { BoardCoordinates } from "../board_coordinates";

export const PatternSchema = z.array(
  z.string().transform((s) => s as BoardCoordinates)
);
export type Pattern = z.infer<typeof PatternSchema>;
