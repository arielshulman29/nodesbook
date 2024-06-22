"use server";
import { PersonRepository } from "../../../_repositories/personRepository";

export const saveFriends = async (id: string, friendsIds: string[]) => {
  try {
    const personRepository = new PersonRepository(isBackup(searchParams));
    await personRepository.createFriends(id, friendsIds);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};
