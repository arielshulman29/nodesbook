import React from "react";
import LinksForm from "../../_components/forms/LinksForm/LinksForm";
import { PersonRepository } from "../../_repositories/personRepository";
import { isBackup } from "@/app/_utils/neo4j";

export default async function PersonPage({
  params: { personId },
  searchParams,
}: {
  params: { personId: string };
  searchParams: Record<string, string | string[] | undefined> | undefined;
}) {
  const personRepository = new PersonRepository(isBackup(searchParams));
  const people = await personRepository.getAllPeople();
  return <LinksForm people={people} personId={personId} />;
}
