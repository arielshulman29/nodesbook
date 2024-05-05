"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { MultiSelect } from "../components/MultiSelect";
import { type Option } from "../../../types/option";
// import { extractResultsArrayFromNeo4jRecords } from "../../utils/neo4j";
import { MultiValue } from "react-select";
import { Person } from "@/app/schemas/Person";
import { saveFriends } from "./api";
import styled from "styled-components";
import { FormContainer } from "../components/styled";

const personOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
});
export type PersonOption = z.infer<typeof personOptionSchema>;

export type LinksFormProps = {
  people: Person[];
  personId: string;
};

export default function LinksForm({ people, personId }: LinksFormProps) {
  const router = useRouter();
  const [friendsOptions, setFriendsOptions] = useState<Option[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Option[]>([]);

  useEffect(() => {
    const options: Option[] = people.map((person) => ({
      label: `${person.name} (${person.company})`,
      value: person.email,
    }));
    setFriendsOptions(options);
  }, [people]);

  const handlePersonSelect = (options: MultiValue<Option>) => {
    setSelectedFriends([...options]);
  };

  const handleSave = async () => {
    const selectedIds = selectedFriends.map(({ value }) => value);
    await saveFriends(personId, selectedIds);
    router.push("/graph");
  };

  return (
    <FormContainer>
      <h1>Find Your Friends</h1>
      <MultiSelect
        name="friends"
        selectedOptions={selectedFriends}
        options={friendsOptions}
        onChange={handlePersonSelect}
      />
      <button type="submit" onClick={handleSave}>
        Save
      </button>
    </FormContainer>
  );
}
