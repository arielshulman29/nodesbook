import React from "react";
import LinksForm from "../../_components/forms/LinksForm/LinksForm";
import { PersonRepository } from "../../_repositories/personRepository";

export default async function PersonPage({
  params: { personId },
}: {
  params: { personId: string };
}) {
  const personRepository = new PersonRepository(isBackup(searchParams));
  const people = await personRepository.getAllPeople();
  return <LinksForm people={people} personId={personId} />;
}
