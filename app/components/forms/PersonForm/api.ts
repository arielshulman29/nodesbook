"use server";

import { PersonRepository } from "@/app/repositories/personRepository";
import { NewPerson } from "@/app/schemas/Person";

export const handleSave = async (data: NewPerson) => {
  try {
    const personRepository = new PersonRepository();
    const id = await personRepository.createPerson(data);
    return id;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};
