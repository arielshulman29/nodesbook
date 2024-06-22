"use server";

import { PersonRepository } from "@/app/_repositories/personRepository";
import { NewPerson } from "@/app/_schemas/Person";

export const handleSave = async (
  data: NewPerson,
  isBackup: boolean
): Promise<
  { success: true; id: string } | { success: false; error: string }
> => {
  // try {
  const personRepository = new PersonRepository(isBackup);
  return await personRepository.createPerson(data);
  // } catch (err) {
  //   throw Error("Something went wrong");
  // }
};
