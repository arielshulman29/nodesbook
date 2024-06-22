import { ShortestPathSelect } from "../ShortestPath/ShortestPathSelect";
import { SubgraphSelect } from "../Subgraph/SubgraphSelect";
import { Algorithms } from "../AlgorithmPicker/algorithms";
import { Person } from "@/app/_schemas/Person";
import { ToggleSearch } from "@/app/_components/shared/Toggle/Toggle";

export type AlgorithmRendererProps = {
  searchParams: Record<string, string | undefined> | undefined;
  people: Person[];
};

export function AlgorithmRenderer({
  searchParams,
  people,
}: AlgorithmRendererProps) {
  const selectedAlgorithm = Object.values(Algorithms).find(
    (algorithm) => searchParams?.["algorithm"] == algorithm
  );
  return (
    <>
      {selectedAlgorithm === Algorithms.shortestPath && (
        <ShortestPathSelect people={people} {...searchParams} />
      )}
      {selectedAlgorithm === Algorithms.subgraph && (
        <SubgraphSelect people={people} {...searchParams} />
      )}
      {selectedAlgorithm === Algorithms.betweenessCentrality && (
        <ToggleSearch items={["all", "subgraph"]} label="show" />
      )}
    </>
  );
}
