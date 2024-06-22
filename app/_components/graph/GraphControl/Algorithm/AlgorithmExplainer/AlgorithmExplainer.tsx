import { PersonRepository } from "@/app/_repositories/personRepository";
import { Algorithms } from "../AlgorithmPicker/algorithms";
import { Code } from "./CodeClientWarapper";
import { Popover } from "@/app/_components/shared/Popover/Popover";
import { CodeIcon } from "@radix-ui/react-icons";
import { Box, Label, Paragraph } from "@/app/_components/shared/styled";
import { toCamelCase } from "@/app/_utils/strings";
import { explanations } from "./explanations";

export type AlgorithmExplainerProps = {
  algorithm?: string;
};

export function AlgorithmExplainer({ algorithm }: AlgorithmExplainerProps) {
  if (
    typeof algorithm === "string" &&
    Object.values(Algorithms).find((al) => al === algorithm)
  ) {
    const repo = new PersonRepository();
    const selectedAlgorithm = algorithm as Algorithms;
    const getCode = (algorithm: Algorithms) => {
      if (algorithm === Algorithms.betweenessCentrality) {
        return repo.calculateBSScoring.toString();
      }
      if (algorithm === Algorithms.shortestPath) {
        return repo.getShortestPath.toString();
      }
      if (algorithm === Algorithms.subgraph) {
        return repo.getFriendsByLevel.toString();
      }
      return "";
    };
    return (
      <Popover icon={<CodeIcon />}>
        <Box>
          <Code text={getCode(selectedAlgorithm)} language="js" />
          <Label>
            <h3>{toCamelCase(algorithm)}</h3>
          </Label>
          <br />
          <Paragraph>{explanations[selectedAlgorithm]}</Paragraph>
        </Box>
      </Popover>
    );
  }
  return <></>;
}
