import { Algorithms } from "../AlgorithmPicker/algorithms";

export const explanations: Record<Algorithms, string> = {
  [Algorithms.betweenessCentrality]: `In graph theory, betweenness centrality is a measure of centrality in a graph based on shortest paths.
    For every pair of nodes in a connected graph, there exists at least one shortest path between the nodes. 
    The betweenness centrality for each node is the number of these shortest paths that pass through it.
    `,
  [Algorithms.shortestPath]: `In graph theory, the shortest path problem is the problem of finding a path between two or nodes in a graph such that the sum of the weights of its constituent edges is minimized. 
  The problem of finding the shortest path between two intersections on a road map may be modeled as a special case of the shortest path problem in graphs, 
  where the nodes correspond to intersections and the edges correspond to road segments, each weighted by the length of the segment.`,
  [Algorithms.subgraph]: `In the mathematical field of graph theory, an induced subgraph of a graph is another graph.
    Formed from a subset of the nodes of the graph and all of their links from the original graph.`,
};

export const code: Record<Algorithms, string> = {
  [Algorithms.betweenessCentrality]: `
  async calculateBSScoring() {
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx)=>{
        return tsx.run(\`
    CALL gds.betweenness.stream('myGraph', {samplingSize: 2, samplingSeed: 0})
    YIELD nodeId, score
    RETURN gds.util.asNode(nodeId).name AS name, score
    ORDER BY name ASC\`);
    });
    return tsx.records[0].toObject()["shortestPath"].map((validPerson)=>validPerson.properties);
} `,
  [Algorithms.shortestPath]: `
  async getShortestPath(fromId, toId) {
    if (fromId === toId) return Promise.resolve([]);
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx)=>{
        return tsx.run(\`
    MATCH(fromPerson:Person{id:$fromId})
    MATCH(toPerson:Person{id:$toId})
    WITH shortestPath((fromPerson)-[*..8]-(toPerson)) as p
    RETURN coalesce(nodes(p),[]) as shortestPath\`, {
            fromId,
            toId
        });
    });
    return tsx.records[0].toObject()["shortestPath"].map((validPerson)=>validPerson.properties);
  }`,
  [Algorithms.subgraph]: `async getFriendsSubgraph(personId, level) {
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx)=>{
        return tsx.run(\`
    MATCH(person:Person{id:$personId})
    CALL apoc.neighbors.byhop(person, 'FRIEND_OF', 3)
    YIELD nodes as friendsCircles
    RETURN friendsCircles\`, {
            personId
        });
    });
    return tsx.records[level - 1].toObject()["friendsCircles"].map((validPerson)=>validPerson.properties);
}`,
};
