import { PersonRepository } from "@/app/_repositories/personRepository";
import { PeoplePopup } from "@/app/_components/shared/PeoplePopup/PeoplePopup";
import { SubgraphParams } from "../searchParamsSchemas";

export async function SubgraphPopover({ root, level }: SubgraphParams) {
  const personRepository = new PersonRepository();
  const friendsByLevel = await personRepository.getFriendsByLevel(
    root,
    Number(level)
  );
  return <PeoplePopup people={friendsByLevel} />;
}
