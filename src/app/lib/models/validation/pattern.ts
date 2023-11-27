import { z } from "zod";

import { BoardCoordinates } from "@models/exports";

export const PatternSchema = z
  .string()
  .transform(
    (s) =>
      s.match(/.{1,2}/g) as unknown as BoardCoordinates[]
  );
export type Pattern = z.infer<typeof PatternSchema>;

//----------------------------------------------------------
// 1. Sequential

export const SequentialSearchReqParamsSchema = z.object({
  pattern: PatternSchema,
});
export type SequentialSearchReqParams = z.infer<
  typeof SequentialSearchReqParamsSchema
>;

//----------------------------------------------------------
// 2. Stones

export const StonesSearchReqParamsSchema = z.object({
  black_stones: PatternSchema,
  white_stones: PatternSchema,
});
export type StonesSearchReqParams = z.infer<
  typeof StonesSearchReqParamsSchema
>;

export const StonesSearchReqSearchParamsSchema = z.object({
  equals: z
    .string()
    .transform((s) => s === "")
    .or(z.undefined().transform((s) => false)),
});

//----------------------------------------------------------
