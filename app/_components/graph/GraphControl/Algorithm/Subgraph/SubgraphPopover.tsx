import { PersonRepository } from "@/app/_repositories/personRepository";
import { PeoplePopup } from "@/app/_components/shared/PeoplePopup/PeoplePopup";
import { SubgraphParams } from "../searchParamsSchemas";
import { isBackup } from "@/app/_utils/neo4j";

export async function SubgraphPopover({
  root,
  level,
  searchParams,
}: SubgraphParams & {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const personRepository = new PersonRepository(isBackup(searchParams));
  const friendsByLevel = await personRepository.getFriendsByLevel(
    root,
    Number(level)
  );
  return <PeoplePopup people={friendsByLevel} />;
}
