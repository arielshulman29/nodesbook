import Graph, { GraphProps } from "@/app/_components/graph/Graph/Graph";
import { PersonRepository } from "@/app/_repositories/personRepository";
import { GraphControl } from "./_components/graph/GraphControl/GraphControl";
import { AlgorithmPopupRenderer } from "./_components/graph/GraphControl/Algorithm/AlgorithmPopupRenderer/AlgorithmPopupRenderer";
import { searchParamsParser } from "./_components/graph/GraphControl/Algorithm/searchParamsSchemas";
import { Algorithms } from "./_components/graph/GraphControl/Algorithm/AlgorithmPicker/algorithms";

export default async function GraphPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const personRepository = new PersonRepository();
  const society = await personRepository.getSocietyGraph();
  const graphProps = await getGraphPropsFromSearchParams(searchParams);
  return (
    <>
      <GraphControl searchParams={searchParams} />
      <AlgorithmPopupRenderer searchParams={searchParams} />
      <Graph society={society} {...graphProps} />
    </>
  );
}

async function getGraphPropsFromSearchParams(
  searchParams: unknown
): Promise<Omit<GraphProps, "society">> {
  const selectedAlgrithmValidation = searchParamsParser.safeParse(searchParams);
  if (!selectedAlgrithmValidation.success) return {};

  const { data: props } = selectedAlgrithmValidation;
  if (props.algorithm === Algorithms.shortestPath) {
    const personRepository = new PersonRepository();
    const path = await personRepository.getShortestPath(props.from, props.to);
    const pathIds = path.map(({ id }) => id);
    if (pathIds.length)
      return { selectedUsersIds: pathIds, mainUserId: props.from };
    return { mainUserId: props.from, selectedUsersIds: [props.to] };
  }
  if (props.algorithm === Algorithms.betweenessCentrality) {
    return {
      mainUserId: props.friendliest[0],
      selectedUsersIds: props.friendliest.slice(1),
      drawPathBetweenSelected: false,
    };
  }
  if (props.algorithm == Algorithms.subgraph) {
    const personRepository = new PersonRepository();
    const friends = await personRepository.getFriendsByLevel(
      props.root,
      Number(props.level)
    );
    return {
      mainUserId: props.root,
      selectedUsersIds: (friends ?? []).map(({ id }) => id),
      drawPathBetweenSelected: false,
    };
  }
  return {};
}
