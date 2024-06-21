import { Algorithms } from "../AlgorithmPicker/algorithms";
import { BcScoringPopover } from "../BcScoring/BcScoringPopover";
import { ShortestPathPopover } from "../ShortestPath/ShortesPathPopover";
import { SubgraphPopover } from "../Subgraph/SubgraphPopover";
import { searchParamsParser } from "../searchParamsSchemas";

export function AlgorithmPopupRenderer({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const props = searchParamsParser.safeParse(searchParams);
  return (
    <>
      {props.data?.algorithm === Algorithms.subgraph && (
        <SubgraphPopover {...props.data} />
      )}
      {props.data?.algorithm === Algorithms.shortestPath && (
        <ShortestPathPopover {...props.data} />
      )}
      {props.data?.algorithm === Algorithms.betweenessCentrality && (
        <BcScoringPopover {...props.data} />
      )}
    </>
  );
}
