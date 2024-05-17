export enum Generations {
  BOOM = "Baby Boomers",
  GEN_X = "Generation X",
  GEN_Y = "Generation Y",
  GEN_Z = "Generation Z",
}

export const generationsMap: Record<Generations, [number, number]> = {
  [Generations.BOOM]: [1946, 1964],
  [Generations.GEN_X]: [1965, 1979],
  [Generations.GEN_Y]: [1980, 1994],
  [Generations.GEN_Z]: [1995, 2009],
} as const;
