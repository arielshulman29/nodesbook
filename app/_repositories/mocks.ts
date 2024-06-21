import { IsraelCities } from "../_data/cities";
import { Generations } from "../_data/generations";
import { stack } from "../_data/stacks";
import { Person } from "../_schemas/Person";
import { Society } from "../_schemas/SocietyGraph";

export const manipulateSociety = (society: Society) => {
  const newSociety: Society = {
    nodes: manipulatePeople(society.nodes, 300),
    links: society.links,
  };
  const newLinks = generateRandomLinks(newSociety);
  newSociety.links = newSociety.links.concat(newLinks);
  return newSociety;
};

const manipulatePerson = (person: Person): Person => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randCharIndex = Math.round(Math.random() * 40);
  const randGenIndex = Math.round(
    Math.random() * Object.values(Generations).length
  );
  const randStackIndex = Math.round(Math.random() * 4);
  const randCityIndex = Math.round(Math.random() * 20);
  const newPerson: Person = {
    ...person,
    name: person.name + characters[randCharIndex],
    generation: Object.values(Generations)[randGenIndex],
    stack: stack[randStackIndex],
    livingTown: IsraelCities[randCityIndex + randStackIndex],
    hometown: IsraelCities[randCityIndex],
    id: person.id.slice(0, person.id.length - 2) + `${randCityIndex}`,
  };
  return newPerson;
};
const manipulatePeople = (people: Person[], quantity: number): Person[] => {
  const manipulatedPeople = people.map((person) => manipulatePerson(person));
  const newPeople = people.concat(manipulatedPeople);
  if (newPeople.length < quantity) {
    return manipulatePeople(newPeople, quantity);
  }
  return newPeople;
};
const generateRandomLink = (society: Society) => {
  const people = society.nodes;
  const links = society.links;
  const randomSourceIndex = Math.round(Math.random() * people.length - 1);
  const randomTargetIndex = Math.round(Math.random() * people.length - 1);
  const randomSourcePersonId = people[randomSourceIndex]?.id;
  const randomTargetPersonId = people[randomTargetIndex]?.id;
  if (
    randomSourcePersonId &&
    randomTargetPersonId &&
    randomSourceIndex !== randomTargetIndex &&
    !links.find(
      (link) =>
        link.source === randomSourcePersonId &&
        link.target === randomTargetPersonId
    )
  ) {
    return { source: randomSourcePersonId, target: randomTargetPersonId };
  }
};
const generateRandomLinks = (society: Society) => {
  let newLinks = [];
  for (let index = 0; index < 400; index++) {
    let link = generateRandomLink(society);
    if (link) newLinks.push(link);
  }
  return newLinks;
};
