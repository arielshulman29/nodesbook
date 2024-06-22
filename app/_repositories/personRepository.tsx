import { NewPerson, Person, personSchema } from "@/app/_schemas/Person";
import neo4j, { Driver, Node } from "neo4j-driver";
import { extractResultsObjectFromNeo4jRecordsbyKey } from "../_utils/neo4j";
import { Society } from "../_schemas/SocietyGraph";

const backupDriver = neo4j.driver(
  process.env.NEO4J_HOST ?? "",
  neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD ?? "")
);
const driver = neo4j.driver(
  process.env.NEO4J_REAL_HOST ?? "",
  neo4j.auth.basic("neo4j", process.env.NEO4J_REAL_PASSWORD ?? "")
);

export class PersonRepository {
  #driver: Driver;
  constructor(backup: boolean) {
    if (backup) {
      this.#driver = backupDriver;
    } else {
      this.#driver = driver;
    }
  }

  #getSession = async () => {
    const session = this.#driver.session();
    return {
      session,
      [Symbol.asyncDispose]: async () => {
        await session.close();
      },
    };
  };

  async createPerson(
    person: NewPerson
  ): Promise<
    { success: true; id: string } | { success: false; error: string }
  > {
    const { session } = await this.#getSession();
    const txc = session.beginTransaction();
    try {
      const personResult = await txc.run<Person & { id: string }>(
        `CREATE (n:Person)
        SET n.id=apoc.create.uuid(), n.generation=$generation, n.company=$company, n.name=$name, 
          n.email=$email, n.stack=$stack, n.livingTown=$livingTown, n.hometown=$hometown
        return properties(n) AS person`,
        { ...person }
      );
      const validatedResult = extractResultsObjectFromNeo4jRecordsbyKey(
        personResult.records,
        "person",
        personSchema
      );
      if (validatedResult.success) {
        await txc.commit();
        return { success: true, id: validatedResult.data.id };
      } else {
        await txc.rollback();
        let error = validatedResult.error.format();
        return { success: false, error: error?.name?._errors[0] ?? "" };
      }
    } catch (error) {
      throw Error("Something went wrong");
    }
  }

  async createFriends(personId: string, friendsIds: string[]) {
    const { session } = await this.#getSession();
    const txc = session.beginTransaction();
    try {
      await txc.run(
        `MATCH(person:Person{id:$id})
        OPTIONAL MATCH(linkedPerson:Person where linkedPerson.id in $ids)
        WITH person, collect(linkedPerson) as linkedPeopleWithNulls
        WITH person, [linkedPerson in linkedPeopleWithNulls WHERE linkedPerson.id IS NOT NULL] as linkedPeople
        UNWIND linkedPeople as linkedPerson
        MERGE(person)-[:FRIEND_OF]->(linkedPerson)
        return collect(linkedPerson) as linkedPeople`,
        {
          id: personId,
          ids: friendsIds,
        }
      );
      await txc.commit();
    } catch (error) {
      console.log("rolled back, Error: " + error);
      await txc.rollback();
    }
  }

  async getAllPeople(): Promise<Person[]> {
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx) => {
      return tsx.run<{ people: Person[] }>(
        `MATCH(person:Person) RETURN collect(properties(person)) as people`
      );
    });
    return tsx.records[0].toObject()["people"];
  }

  async getFriendsSubgraph(personId: string, level: number): Promise<Person[]> {
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx) => {
      return tsx.run<{ friendsCircles: Array<Node<number, Person>> }>(
        `
        MATCH(person:Person{id:$personId})
        CALL apoc.neighbors.byhop(person, 'FRIEND_OF', 3)
        YIELD nodes as friendsCircles
        RETURN friendsCircles`,
        { personId }
      );
    });
    return tsx.records[level - 1]
      .toObject()
      ["friendsCircles"].map((validPerson) => validPerson.properties);
  }

  async getShortestPath(fromId: string, toId: string): Promise<Person[]> {
    if (fromId === toId) return Promise.resolve([]);
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx) => {
      return tsx.run<{ shortestPath: Array<Node<number, Person>> }>(
        `
        MATCH(fromPerson:Person{id:$fromId})
        MATCH(toPerson:Person{id:$toId})
        WITH shortestPath((fromPerson)-[*..8]-(toPerson)) as p
        RETURN coalesce(nodes(p),[]) as shortestPath`,
        { fromId, toId }
      );
    });
    return tsx.records[0]
      .toObject()
      ["shortestPath"].map((validPerson) => validPerson.properties);
  }

  async calculateBSScoring(): Promise<Person[]> {
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx) => {
      return tsx.run<{ shortestPath: Array<Node<number, Person>> }>(
        `
        CALL gds.betweenness.stream('myGraph', {samplingSize: 2, samplingSeed: 0})
        YIELD nodeId, score
        RETURN gds.util.asNode(nodeId).name AS name, score
        ORDER BY name ASC`
      );
    });
    return tsx.records[0]
      .toObject()
      ["shortestPath"].map((validPerson) => validPerson.properties);
  }

  async getSocietyGraph(): Promise<Society> {
    const { session } = await this.#getSession();
    const tsx = await session.executeRead((tsx) => {
      return tsx.run<Society>(
        `
       MATCH(person:Person)
       OPTIONAL MATCH(person)-[link:FRIEND_OF]->(person2:Person)
       WITH collect(distinct {source:startNode(link).id, target:endNode(link).id}) as links_with_nulls,
            collect(distinct properties(person)) as nodes
       RETURN nodes, [link in links_with_nulls WHERE link.source IS NOT NULL] as links`
      );
    });
    return tsx.records[0].toObject();
  }
}
