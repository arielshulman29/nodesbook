import { SimpleReactCytoscape } from "simple-react-cytoscape";
import { useLayoutEffect, useMemo, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { extractResultsObjectFromNeo4jRecords } from "../../utils/neo4j";
import { z } from "zod";
import { personSchema } from "../../schemas/Person";
import { capitalize } from "../../utils/strings";
import { layouts } from "./layouts";

type Element = {
  data: { id: string; label?: string; source?: string; target?: string };
};
const createElementsFromSociety = (society: Society): Element[] => {
  const elements: Element[] = [];
  society.nodes.forEach((node) => {
    elements.push({
      data: {
        id: node.id,
        label: `${capitalize(node.name)} (${capitalize(node.company)}, ${
          node.stack
        })`,
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

const style = [
  // the stylesheet for the graph
  {
    selector: "node",
    style: {
      "background-color": "pink",
      label: "data(label)",
      color: "#85878A",
      width: 50,
      height: 50,
    },
  },

  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
];

const linkSchema = z.object({
  source: z.string().uuid(),
  target: z.string().uuid(),
});

const societySchema = z.object({
  links: z.array(linkSchema),
  nodes: z.array(personSchema.merge(z.object({ id: z.string().uuid() }))),
});

type Society = z.infer<typeof societySchema>;

export default function Graph() {
  const [society, setSociety] = useState<Society>({
    links: [],
    nodes: [],
  });
  const {
    run: getAllPeople,
    loading: loadingPeople,
    records,
  } = useReadCypher(`
    MATCH(person:Person)
    OPTIONAL MATCH(person)-[link:FRIEND_OF]->(person2:Person)
    WITH collect(distinct {source:startNode(link).id, target:endNode(link).id}) as links_with_nulls,
         collect(distinct properties(person)) as nodes
    RETURN nodes, [link in links_with_nulls WHERE link.source IS NOT NULL] as links`);

  useLayoutEffect(() => {
    getAllPeople();
  }, []);

  useLayoutEffect(() => {
    if (!loadingPeople && records?.length) {
      const graphData = extractResultsObjectFromNeo4jRecords<Society>(
        records,
        societySchema
      );
      setSociety(graphData as Society);
    }
  }, [records, loadingPeople]);

  const elements = useMemo(() => createElementsFromSociety(society), [society]);

  const options = {
    elements,
    style,
    layout: layouts.circle,
  };

  return (
    <div className="App">
      {loadingPeople ? null : <SimpleReactCytoscape options={options} />}
    </div>
  );
}
