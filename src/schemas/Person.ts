import z from "zod";
import { IsraelCities } from "../data/cities";
import { stack } from "../data/stacks";
import { capitalize } from "../utils/strings";

const getInvalidErrors = (fieldName: string) => ({
  invalid_type_error: `Invalid ${capitalize(fieldName)}`,
  required_error: `${capitalize(fieldName)} is Required`,
});

export const personSchema = z.object({
  name: z.string(getInvalidErrors("name")).min(3),
  email: z.string().email(),
  age: z.string().refine(
    (v) => {
      const n = Number(v);
      if (isNaN(n) || v?.length === 0) return false;
      if (n < 4 || n > 90) return false;
      return n;
    },
    { message: "Invalid age" }
  ),
  hometown: z.enum(IsraelCities, getInvalidErrors("living town")),
  livingTown: z.enum(IsraelCities, getInvalidErrors("living town")),
  company: z.string(getInvalidErrors("company")).min(3),
  stack: z.enum(stack, getInvalidErrors("stack")),
});

export type Person = z.infer<typeof personSchema>;
