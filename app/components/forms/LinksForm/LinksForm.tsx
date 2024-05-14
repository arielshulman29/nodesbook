"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { MultiSelect } from "../components/MultiSelect";
import { type Option } from "../../../types/option";
import { MultiValue } from "react-select";
import { Person } from "@/app/schemas/Person";
import { saveFriends } from "./api";
import { FormContainer, StyledButton } from "../components/styled";

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
    const options: Option[] = people
      .filter((person) => person.id !== personId)
      .map((person) => ({
        label: `${person.name} (${person.company})`,
        value: person.id,
      }));
    setFriendsOptions(options);
  }, [people.length]);

  const handlePersonSelect = (options: MultiValue<Option>) => {
    setSelectedFriends([...options]);
  };

  const handleSave = async () => {
    const selectedIds = selectedFriends.map(({ value }) => value);
    if (selectedIds.length) await saveFriends(personId, selectedIds);
    router.push(`/person/${personId}/graph`);
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
      <StyledButton type="submit" onClick={handleSave}>
        NEXT
      </StyledButton>
    </FormContainer>
  );
}
