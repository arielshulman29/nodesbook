"use client";
import { SingleSelect } from "@/app/_components/shared/SingleSelect/SingleSelect";
import useSearch from "@/app/_hooks/useSearch";
import PeopleSelect from "../../../../shared/PeopleSelect/PeopleSelect";
import { Person } from "@/app/_schemas/Person";
import { SubgraphParams } from "../searchParamsSchemas";
import { ToggleSearch } from "@/app/_components/shared/Toggle/Toggle";

const options = [
  { value: "1", label: "First circle" },
  { value: "2", label: "Second circle" },
  { value: "3", label: "Third circle" },
] as const;

export type SubgraphSelectProps = {
  people: Person[];
} & Partial<SubgraphParams>;

export function SubgraphSelect({ people, level, root }: SubgraphSelectProps) {
  const { setSearch } = useSearch();

  return (
    <>
      <PeopleSelect
        placeholder="Select Root"
        label="root"
        personId={root}
        people={people}
      />
      <SingleSelect
        selectedOption={options.find((opt) => opt.value === level)}
        name="level"
        onChange={(selected) =>
          setSearch([{ key: "level", value: selected?.value }])
        }
        options={options}
      />
      <ToggleSearch items={["all", "subgraph"]} label="show" />
    </>
  );
}
