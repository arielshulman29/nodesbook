import { NewPerson, Person, personSchema } from "@/app/schemas/Person";
import neo4j, { Driver } from "neo4j-driver";
import {
  extractResultsObjectFromNeo4jRecords,
  extractResultsObjectFromNeo4jRecordsbyKey,
  extractFirstErrorMessageFromSchemaError,
} from "../utils/neo4j";
import { Society, societySchema } from "../schemas/SocietyGraph";

const driver = neo4j.driver(
  process.env.NEO4J_HOST!,
  neo4j.auth.basic("neo4j", process.env?.NEO4J_PASSWORD ?? "")
);

export class PersonRepository {
  #driver: Driver;
  constructor() {
    this.#driver = driver;
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
        SET n.id=apoc.create.uuid(), n.age=$age, n.company=$company, n.name=$name, 
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
        let error = extractFirstErrorMessageFromSchemaError(
          validatedResult.error.message
        );
        return { success: false, error };
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async createFriends(personId: string, friendsIds: string[]) {
    const { session } = await this.#getSession();
    // run statement in a transaction
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
      console.log("committed");
    } catch (error) {
      console.log(error);
      await txc.rollback();
      console.log("rolled back");
    }
  }
  async getFriendsRecommendationsByRelationships(personId: string) {
    const { session } = await this.#getSession();
    // run statement in a transaction
    const tsx = await session.executeRead((tsx) => {
      return tsx.run(
        `MATCH(person:Person{id:$id})
        CALL apoc.path.subgraphNodes(person, { relationshipFilter: 'FRIEND_OF', labelFilter:'/Person', minLevel:1, maxLevel:3 })
        YIELD node as recommrndation
        return collect(recommendation{.id,.name,.email}) as recommendations
        `,
        { id: personId }
      );
    });
    return tsx.records[0].toObject();
  }
  async getAllPeople(): Promise<Person[]> {
    const { session } = await this.#getSession();
    // run statement in a transaction
    const tsx = await session.executeRead((tsx) => {
      return tsx.run(
        `MATCH(person:Person) RETURN collect(properties(person)) as people`
      );
    });
    return tsx.records[0].toObject()["people"];
  }
  async getSocietyGraph(): Promise<Society> {
    const { session } = await this.#getSession();
    // run statement in a transaction
    const tsx = await session.executeRead((tsx) => {
      return tsx.run(
        `
       MATCH(person:Person)
       OPTIONAL MATCH(person)-[link:FRIEND_OF]->(person2:Person)
       WITH collect(distinct {source:startNode(link).id, target:endNode(link).id}) as links_with_nulls,
            collect(distinct properties(person)) as nodes
       RETURN nodes, [link in links_with_nulls WHERE link.source IS NOT NULL] as links`
      );
    });
    const graphData = extractResultsObjectFromNeo4jRecords<Society>(
      tsx.records,
      societySchema
    );
    if (graphData.success) {
      return graphData.data;
    }
    return { nodes: [], links: [] };
  }
}
