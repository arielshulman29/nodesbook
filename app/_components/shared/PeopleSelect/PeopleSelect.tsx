"use client";
import { z } from "zod";
import { type Option } from "../../../_types/option";
import { Person } from "@/app/_schemas/Person";
import useSearch from "@/app/_hooks/useSearch";
import { SingleSelect } from "@/app/_components/shared/SingleSelect/SingleSelect";
import { toCamelCase } from "@/app/_utils/strings";

const personOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
});

export type PersonOption = z.infer<typeof personOptionSchema>;

export type PeopleSelectProps = {
  people: Person[];
  personId?: string;
  label: string;
  placeholder?: string;
};

export default function PeopleSelect({
  people,
  personId,
  label,
  placeholder,
}: PeopleSelectProps) {
  const { setSearch } = useSearch();
  const options: Option[] = people.map((person) => ({
    label: `${person.name} (${person.company})`,
    value: person.id,
  }));
  const selectedOption = personId
    ? options.find((op) => op.value === personId)
    : undefined;
  return (
    <SingleSelect
      selectedOption={selectedOption}
      name="friends"
      placeholder={toCamelCase(placeholder ?? label)}
      options={options}
      onChange={(option) => {
        setSearch([{ key: label, value: option?.value }]);
      }}
    />
  );
}
