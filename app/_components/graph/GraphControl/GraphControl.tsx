import { Counter } from "./Counter/Counter";
import Signup from "./Signup/Signup";
import { PersonRepository } from "@/app/_repositories/personRepository";
import { AlgorithmPicker } from "./Algorithm/AlgorithmPicker/AlgorithmPicker";
import { AlgorithmRenderer } from "./Algorithm/AlgorithmSelectRenderer/AlgorithmSelectRenderer";
import { Container, Flex, ItemContainer, Row } from "../../shared/styled";
import { AlgorithmExplainer } from "./Algorithm/AlgorithmExplainer/AlgorithmExplainer";
import { isBackup } from "@/app/_utils/neo4j";
import { ToggleSearch } from "../../shared/Toggle/Toggle";

export async function GraphControl({
  searchParams,
}: {
  searchParams: Record<string, string | undefined> | undefined;
}) {
  const personRepository = new PersonRepository(isBackup(searchParams));
  const society = await personRepository.getSocietyGraph();
  return (
    <Row>
      <Container>
        <ItemContainer>
          <Signup />
          <Counter label="nodes" count={society.nodes.length} />
          <Counter label="links" count={society.links.length} />
          <ToggleSearch label="backup" items={["real", "backup"]} replace />
        </ItemContainer>
      </Container>
      <AlgorithmPicker>
        <AlgorithmRenderer searchParams={searchParams} people={society.nodes} />
      </AlgorithmPicker>
      <AlgorithmExplainer
        searchParams={searchParams}
        algorithm={searchParams?.["algorithm"]}
      />
    </Row>
  );
}
