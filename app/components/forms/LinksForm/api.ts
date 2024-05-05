"use server";
import { PersonRepository } from "../../../repositories/personRepository";

export const saveFriends = async (id: string, friendsIds: string[]) => {
  try {
    const personRepository = new PersonRepository();
    await personRepository.createFriends(id, friendsIds);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};
