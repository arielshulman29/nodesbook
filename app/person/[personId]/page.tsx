import React from "react";
import LinksForm from "../../components/forms/LinksForm/LinksForm";
import { PersonRepository } from "../../repositories/personRepository";

export default async function PersonPage({
  params: { personId },
}: {
  params: { personId: string };
}) {
  const personRepository = new PersonRepository();
  const people = await personRepository.getAllPeople();
  return <LinksForm people={people} personId={personId} />;
}
