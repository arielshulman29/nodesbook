"use client";
import { useEffect, useMemo, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { capitalize } from "../../../_utils/strings";
import { Society } from "@/app/_schemas/SocietyGraph";
import fcose from "cytoscape-fcose";
import { styleSheet } from "./config";
import fcoseLayout from "./layouts/fcose";
import useSearch from "@/app/_hooks/useSearch";
import { Algorithms } from "../GraphControl/Algorithm/AlgorithmPicker/algorithms";

cytoscape.use(fcose);

type Element = {
  data: {
    id: string;
    label?: string;
    source?: string;
    target?: string;
    main?: string;
    selected?: string;
  };
};

const createElementsFromSociety = (
  society: Society,
  mainUserId?: string,
  selectesUsersIds?: string[],
  drawPathBetweenSelected?: boolean
): Element[] => {
  const elements: Element[] = [];
  society.nodes.forEach((node) => {
    elements.push({
      data: {
        id: node.id,
        label: `${capitalize(node.name)}`,
        main: `${node.id === mainUserId}`,
        selected: `${selectesUsersIds?.includes(node.id)}`,
      },
    });
  });
  society.links.forEach((link) => {
    elements.push({
      data: {
        id: `${link.source}${link.target}`,
        source: link.source,
        target: link.target,
        selected: `${
          drawPathBetweenSelected &&
          selectesUsersIds?.includes(link.source) &&
          selectesUsersIds?.includes(link.target)
        }`,
      },
    });
  });
  return elements;
};

export type GraphProps = {
  society: Society;
  drawPathBetweenSelected?: boolean;
  mainUserId?: string;
  selectedUsersIds?: string[];
};

export default function Graph({
  society,
  mainUserId,
  selectedUsersIds,
  drawPathBetweenSelected = true,
}: GraphProps) {
  const { setSearch, searchParams } = useSearch();
  const cyRef = useRef<cytoscape.Core | undefined>();
  const elements = useMemo(
    () =>
      createElementsFromSociety(
        society,
        mainUserId,
        selectedUsersIds,
        drawPathBetweenSelected
      ),
    [society, mainUserId, selectedUsersIds, drawPathBetweenSelected]
  );
  const layout = fcoseLayout;
  layout.nodeRepulsion = () => 300 * society.nodes.length;

  useEffect(() => {
    if (!cyRef.current?.nodes().length) return;
    let bcScoring = cyRef.current?.elements().betweennessCentrality({});
    cyRef.current?.nodes().forEach((n) => {
      n.data({ bcScoring: bcScoring?.betweenness(n) });
    });
  }, [cyRef.current?.nodes().length]);

  useEffect(() => {
    const shouldUpdateURLWithBcScoring =
      !!searchParams &&
      searchParams.has("algorithm") &&
      searchParams.get("algorithm") === Algorithms.betweenessCentrality &&
      !searchParams.has("friendliest");
    if (shouldUpdateURLWithBcScoring) {
      const friendliest = cyRef.current
        ?.nodes()
        .sort((el1, el2) =>
          el1.data("bcScoring") > el2.data("bcScoring") ? -1 : 1
        )
        .slice(0, 5)
        .map<string>((el) => el.data("id"));
      setSearch([{ key: "friendliest", value: friendliest }]);
    }
  }, [searchParams]);

  return (
    <CytoscapeComponent
      style={{ width: "100%", height: "100vh" }}
      elements={elements}
      layout={layout}
      stylesheet={styleSheet}
      cy={(cy) => (cyRef.current = cy)}
    />
  );
}
