import { z } from "zod";

import { BoardCoordinates } from "@models/exports";

export const PatternSchema = z
  .string()
  .transform(
    (s) =>
      s.match(/.{1,2}/g) as unknown as BoardCoordinates[]
  );
export type Pattern = z.infer<typeof PatternSchema>;

export const PatternSearchReqParamsSchema = z.object({
  pattern: PatternSchema,
});
export type PatternSearchReqParams = z.infer<
  typeof PatternSearchReqParamsSchema
>;

export const PatternSearchReqSearchParamsSchema = z.object({
  "stone-search": z
    .string()
    .transform((s) => s === "true" || s === "")
    .optional(),
});
