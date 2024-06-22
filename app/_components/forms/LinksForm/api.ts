"use server";
import { PersonRepository } from "../../../_repositories/personRepository";

export const saveFriends = async (
  id: string,
  friendsIds: string[],
  isBackup: boolean
) => {
  try {
    const personRepository = new PersonRepository(isBackup);
    await personRepository.createFriends(id, friendsIds);
  } catch (err) {
    throw new Error("Something went wrong");
  }
};
