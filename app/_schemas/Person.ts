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
  name: z
    .string(getInvalidErrors("name"))
    .min(3, "name must be at least 3 letters")
    .regex(englishRegex, "name must be in English"),
  email: z.string(getInvalidErrors("email")).email(),
  generation: z.nativeEnum(Generations, getInvalidErrors("generation")),
  hometown: z.enum(IsraelCities, getInvalidErrors("hometown")),
  livingTown: z.enum(IsraelCities, getInvalidErrors("living town")),
  company: z
    .string(getInvalidErrors("company"))
    .min(3, "company name must be at least 3 letters")
    .regex(englishRegex, "company name must be in English"),
  stack: z.enum(stack, getInvalidErrors("stack")),
});

export const newPersonSchema = personSchema.omit({ id: true });

export type Person = z.infer<typeof personSchema>;
export type NewPerson = z.infer<typeof newPersonSchema>;

export const isValidUuid = (id: any) => z.string().uuid().safeParse(id).success;
