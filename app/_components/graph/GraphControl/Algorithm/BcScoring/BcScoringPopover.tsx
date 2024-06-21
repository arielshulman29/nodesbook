import { PersonRepository } from "@/app/_repositories/personRepository";
import { BcScoringParams } from "../searchParamsSchemas";
import { PeoplePopup } from "@/app/_components/shared/PeoplePopup/PeoplePopup";

export async function BcScoringPopover({ friendliest }: BcScoringParams) {
  const personRepository = new PersonRepository();
  const people = await personRepository.getAllPeople();
  const friendliestPeople = people
    .filter((person) => friendliest.includes(person.id))
    .sort((person1, person2) =>
      friendliest.indexOf(person1.id) > friendliest.indexOf(person2.id) ? 1 : -1
    );

  return <PeoplePopup people={friendliestPeople} />;
}
