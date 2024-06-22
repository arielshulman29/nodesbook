import { Person } from "@/app/_schemas/Person";
import PeopleSelect from "../../../../shared/PeopleSelect/PeopleSelect";
import { ShortestPathParams } from "../searchParamsSchemas";
import { ToggleSearch } from "@/app/_components/shared/Toggle/Toggle";
import { Flex } from "@/app/_components/shared/styled";

export type ShortestPathSelectProps = {
  people: Person[];
} & Partial<ShortestPathParams>;

export async function ShortestPathSelect({
  people,
  from,
  to,
}: ShortestPathSelectProps) {
  return (
    <Flex>
      <PeopleSelect label="from" people={people} personId={from} />
      <PeopleSelect label="to" people={people} personId={to} />
      <ToggleSearch items={["all", "subgraph"]} label="show" />
    </Flex>
  );
}
