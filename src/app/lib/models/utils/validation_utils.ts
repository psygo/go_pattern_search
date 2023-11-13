import { z } from "zod";

export const PointsSchema = z.number().int().positive();
