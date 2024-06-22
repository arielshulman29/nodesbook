import { PersonRepository } from "@/app/_repositories/personRepository";
import { ShortestPathParams } from "../searchParamsSchemas";
import { PeoplePopup } from "@/app/_components/shared/PeoplePopup/PeoplePopup";

export async function ShortestPathPopover({ from, to }: ShortestPathParams) {
  const personRepository = new PersonRepository();
  const shortestPath = await personRepository.getShortestPath(from, to);
  return <PeoplePopup people={shortestPath} />;
}
