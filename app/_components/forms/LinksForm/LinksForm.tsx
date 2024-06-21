"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { MultiSelect } from "../../shared/MultiSelect/MultiSelect";
import { type Option } from "../../../_types/option";
import { MultiValue } from "react-select";
import { Person } from "@/app/_schemas/Person";
import { saveFriends } from "./api";
import { Container, FullScreen } from "../../shared/styled";

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
    router.push(`/`);
  };

  return (
    <FullScreen>
      <h1>Find Your Friends</h1>
      <MultiSelect
        name="friends"
        selectedOptions={selectedFriends}
        options={friendsOptions}
        onChange={handlePersonSelect}
      />
      <Container>
        <button
          type="submit"
          onClick={handleSave}
          style={{ background: "none" }}
        >
          NEXT
        </button>
      </Container>
    </FullScreen>
  );
}
