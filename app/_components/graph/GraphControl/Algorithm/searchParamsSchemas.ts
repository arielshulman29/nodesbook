import z from "zod";
import { Algorithms } from "./AlgorithmPicker/algorithms";

export const shortestPathParams = z.object({
  algorithm: z.literal(Algorithms.shortestPath),
  from: z.string().uuid(),
  to: z.string().uuid(),
});

export const shortestPathParamsPartial = shortestPathParams.partial();

export type ShortestPathParams = z.infer<typeof shortestPathParams>;

export const subgraphParams = z.object({
  algorithm: z.literal(Algorithms.subgraph),
  root: z.string().uuid(),
  level: z.string(),
});

export const subgraphParamsPartial = subgraphParams.partial();

export type SubgraphParams = z.infer<typeof subgraphParams>;

export const bcScoringParams = z.object({
  algorithm: z.literal(Algorithms.betweenessCentrality),
  friendliest: z.union([
    z.array(z.string().uuid()),
    z.string().transform((arg) => arg.split(",")),
  ]),
});
export const bcScoringParamsPartial = bcScoringParams.partial();

export type BcScoringParams = z.infer<typeof bcScoringParams>;

export const searchParamsParser = z.discriminatedUnion("algorithm", [
  shortestPathParams,
  subgraphParams,
  bcScoringParams,
]);
