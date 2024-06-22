import { Counter } from "./Counter/Counter";
import Signup from "./Signup/Signup";
import { PersonRepository } from "@/app/_repositories/personRepository";
import { AlgorithmPicker } from "./Algorithm/AlgorithmPicker/AlgorithmPicker";
import { AlgorithmRenderer } from "./Algorithm/AlgorithmSelectRenderer/AlgorithmSelectRenderer";
import { Container, ItemContainer } from "../../shared/styled";

export async function GraphControl({
  searchParams,
}: {
  searchParams: Record<string, string | undefined> | undefined;
}) {
  const personRepository = new PersonRepository();
  const society = await personRepository.getSocietyGraph();
  return (
    <Container>
      <ItemContainer>
        <Signup />
        <Counter label="nodes" count={society.nodes.length} />
        <Counter label="links" count={society.links.length} />
      </ItemContainer>
      <ItemContainer>
        <AlgorithmPicker />
      </ItemContainer>
      <AlgorithmRenderer searchParams={searchParams} people={society.nodes} />
    </Container>
  );
}
