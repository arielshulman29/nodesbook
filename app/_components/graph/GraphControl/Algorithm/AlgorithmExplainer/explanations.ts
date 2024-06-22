import { Algorithms } from "../AlgorithmPicker/algorithms";

export const explanations: Record<Algorithms, string> = {
  [Algorithms.betweenessCentrality]: `In graph theory, betweenness centrality is a measure of centrality in a graph based on shortest paths.
    For every pair of nodes in a connected graph, there exists at least one shortest path between the nodes. 
    The betweenness centrality for each node is the number of these shortest paths that pass through it
    {\displaystyle g(v)=\sum _{s\neq v\neq t}{\frac {\sigma _{st}(v)}{\sigma _{st}}}}
    `,
  [Algorithms.shortestPath]: `In graph theory, the shortest path problem is the problem of finding
    a path between two or nodes in a graph such that the sum of the
    weights of its constituent edges is minimized. The problem of
    finding the shortest path between two intersections on a road map
    may be modeled as a special case of the shortest path problem in
    graphs, where the vertices correspond to intersections and the edges
    correspond to road segments, each weighted by the length of the
    segment.`,
  [Algorithms.subgraph]: `In the mathematical field of graph theory, an induced subgraph of a graph is another graph.
    Formed from a subset of the nodes of the graph and all of their links from the original graph.`,
};
