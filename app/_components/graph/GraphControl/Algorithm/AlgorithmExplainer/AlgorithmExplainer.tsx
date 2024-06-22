import { PersonRepository } from "@/app/_repositories/personRepository";
import { Algorithms } from "../AlgorithmPicker/algorithms";
import { Code } from "./CodeClientWarapper";
import { Popover } from "@/app/_components/shared/Popover/Popover";

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
      <Popover>
        <Code text={getCode(selectedAlgorithm)} language="js" />
      </Popover>
    );
  }
  return <></>;
}
