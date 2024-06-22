import { PersonRepository } from "@/app/_repositories/personRepository";
import { ShortestPathParams } from "../searchParamsSchemas";
import { PeoplePopup } from "@/app/_components/shared/PeoplePopup/PeoplePopup";
import { isBackup } from "@/app/_utils/neo4j";

export async function ShortestPathPopover({
  from,
  to,
  searchParams,
}: ShortestPathParams & {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const personRepository = new PersonRepository(isBackup(searchParams));
  const shortestPath = await personRepository.getShortestPath(from, to);
  return <PeoplePopup people={shortestPath} />;
}
