import Graph from "@/app/components/graph/Graph";
import { PersonRepository } from "@/app/repositories/personRepository";

export default async function GraphPage() {
  const personRepository = new PersonRepository();
  const society = await personRepository.getSocietyGraph();
  return <Graph society={society} />;
}
