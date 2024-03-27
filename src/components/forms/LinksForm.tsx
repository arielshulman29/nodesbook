import { useEffect, useState } from "react";
import { useReadCypher, useLazyWriteCypher } from "use-neo4j";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { MultiSelect } from "./components/MultiSelect";
import { type Option } from "../../types/option";
import { extractResultsArrayFromNeo4jRecords } from "../../utils/neo4j";
import { MultiValue } from "react-select";

export type LinksFormProps = {
  personId: string;
};

const getMergeQuery = (relationshipType: string) => `
MATCH(person:Person{id:$id})
OPTIONAL MATCH(linkedPerson:Person where linkedPerson.id in $ids)
WITH person, collect(linkedPerson) as linkedPeopleWithNulls
WITH person, [linkedPerson in linkedPeopleWithNulls WHERE linkedPerson.id IS NOT NULL] as linkedPeople
UNWIND linkedPeople as linkedPerson
MERGE(person)-[:${relationshipType}]-(linkedPerson)
return collect(linkedPerson) as linkedPeople`;

const personOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
});
export type PersonOption = z.infer<typeof personOptionSchema>;

export default function LinksForm() {
  const { id: personId } = useParams();

  const [friendsOptions, setFriendsOptions] = useState<Option[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Option[]>([]);

  const {
    run: getAllPeople,
    loading: loadingPeople,
    records,
  } = useReadCypher(
    `MATCH(person:Person WHERE person.id<>$id) return collect(person{.id,.name,.company}) as people`,
    { id: personId }
  );
  const [createFriends] = useLazyWriteCypher(getMergeQuery("FRIEND_OF"));

  useEffect(() => {
    getAllPeople({ id: personId });
  }, [personId]);

  useEffect(() => {
    if (records?.length && !loadingPeople) {
      const peopleOptions = extractResultsArrayFromNeo4jRecords<PersonOption>(
        records,
        personOptionSchema
      );
      const options: Option[] = peopleOptions.map((person) => ({
        label: `${person.name} (${person.company})`,
        value: person.id,
      }));
      setFriendsOptions(options);
    }
  }, [records, loadingPeople]);

  const handlePersonSelect = (options: MultiValue<Option>) => {
    setSelectedFriends([...options]);
  };

  const saveFriends = async () => {
    try {
      await createFriends({
        id: personId,
        ids: selectedFriends.map(({ value }) => value),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>{loadingPeople ? "loading..." : null}</div>
      <h1>Find Your Friends</h1>
      <MultiSelect
        name="friends"
        selectedOptions={selectedFriends}
        options={friendsOptions}
        onChange={handlePersonSelect}
      />
      <button type="submit" onClick={saveFriends}>
        Save
      </button>
    </div>
  );
}
