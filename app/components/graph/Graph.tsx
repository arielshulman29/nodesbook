"use client";
import { useMemo } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { capitalize } from "../../utils/strings";
import { Society } from "@/app/schemas/SocietyGraph";
import cola from "cytoscape-cola";
import { layout, styleSheet } from "./config";
import Signup from "./buttons/Signup/Signup";

cytoscape.use(cola);

type Element = {
  data: { id: string; label?: string; source?: string; target?: string };
};

const createElementsFromSociety = (society: Society): Element[] => {
  const elements: Element[] = [];
  society.nodes.forEach((node) => {
    elements.push({
      data: {
        id: node.id,
        label: `${capitalize(node.name)}`,
      },
    });
  });
  society.links.forEach((link) => {
    elements.push({
      data: {
        id: `${link.source}${link.target}`,
        source: link.source,
        target: link.target,
      },
    });
  });
  return elements;
};

export type GraphProps = { society: Society };

export default function Graph({ society }: GraphProps) {
  const elements = useMemo(() => createElementsFromSociety(society), [society]);

  return (
    <>
      <Signup />
      <CytoscapeComponent
        style={{ width: "100%", height: "100vh" }}
        elements={elements}
        layout={layout}
        stylesheet={styleSheet}
      />
    </>
  );
}
