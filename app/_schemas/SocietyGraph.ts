import { z } from "zod";
import { personSchema } from "./Person";

export const linkSchema = z.object({
  source: z.string().uuid(),
  target: z.string().uuid(),
});

export const societySchema = z.object({
  links: z.array(linkSchema),
  nodes: z.array(personSchema.merge(z.object({ id: z.string().uuid() }))),
});

export type Society = z.infer<typeof societySchema>;
