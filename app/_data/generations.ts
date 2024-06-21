export const Generations = {
  BOOM: "Baby Boomers",
  GEN_X: "gen X",
  GEN_Y: "gen Y",
  GEN_Z: "gen Z",
} as const;

type ValueOf<Type> = Type[keyof Type];

export type Generations = ValueOf<typeof Generations>;

export const generationsMap = {
  [Generations.BOOM]: [1946, 1964],
  [Generations.GEN_X]: [1965, 1979],
  [Generations.GEN_Y]: [1980, 1994],
  [Generations.GEN_Z]: [1995, 2009],
} as const;
