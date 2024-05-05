import { NewPerson, Person, personSchema } from "@/app/schemas/Person";
import neo4j, { Driver } from "neo4j-driver";
import { extractResultsObjectFromNeo4jRecords } from "../utils/neo4j";

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

  async createPerson(person: NewPerson): Promise<Person | null | undefined> {
    const { session } = await this.#getSession();
    const txc = session.beginTransaction();
    try {
      const personResult = await txc.run<Person & { id: string }>(
        `CREATE (n:Person)
        SET n.id=apoc.create.uuid(), n.age=$age, n.company=$company, n.name=$name, 
          n.email=$email, n.stack=$stack, n.livingTown=$livingTown, n.hometown=$hometown
        return properties(n)`,
        { ...person }
      );
      const validatedResult = extractResultsObjectFromNeo4jRecords(
        personResult.records,
        personSchema
      );
      if (!validatedResult) {
        throw new Error("Something went wrong");
      } else {
        await txc.commit();
      }
      return validatedResult;
    } catch (error) {
      console.log(error);
      await txc.rollback();
      console.log("rolled back");
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
        MERGE(person)-[:FRIEND_OF]-(linkedPerson)
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
}
