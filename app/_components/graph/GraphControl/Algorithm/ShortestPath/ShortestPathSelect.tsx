import { Person } from "@/app/_schemas/Person";
import PeopleSelect from "../../../../shared/PeopleSelect/PeopleSelect";
import { ShortestPathParams } from "../searchParamsSchemas";

export type ShortestPathSelectProps = {
  people: Person[];
} & Partial<ShortestPathParams>;

export async function ShortestPathSelect({
  people,
  from,
  to,
}: ShortestPathSelectProps) {
  return (
    <>
      <PeopleSelect label="from" people={people} personId={from} />
      <PeopleSelect label="to" people={people} personId={to} />
    </>
  );
}
