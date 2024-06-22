import { z } from "zod";
import { IsraelCities } from "../_data/cities";
import { stack } from "../_data/stacks";
import { capitalize } from "../_utils/strings";
import { Generations } from "../_data/generations";

const getInvalidErrors = (fieldName: string) => ({
  invalid_type_error: `Invalid ${capitalize(fieldName)}`,
  required_error: `${capitalize(fieldName)} is Required`,
});

const englishRegex = new RegExp(/^[a-zA-Z0-9]/);

export const personSchema = z.object({
  id: z.string(getInvalidErrors("id")).uuid(),
  name: z.string(getInvalidErrors("name")).min(3).regex(englishRegex),
  email: z.string().email(),
  generation: z.nativeEnum(Generations),
  hometown: z.enum(IsraelCities, getInvalidErrors("living town")),
  livingTown: z.enum(IsraelCities, getInvalidErrors("living town")),
  company: z.string(getInvalidErrors("company")).min(3),
  stack: z.enum(stack, getInvalidErrors("stack")),
});

export const newPersonSchema = personSchema.omit({ id: true });

export type Person = z.infer<typeof personSchema>;
export type NewPerson = z.infer<typeof newPersonSchema>;

export const isValidUuid = (id: any) => z.string().uuid().safeParse(id).success;
