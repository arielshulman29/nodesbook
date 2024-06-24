import { FixedToBottomRight, Flex, ItemContainer, Paragraph } from "../styled";
import { Popover } from "../Popover/Popover";
import { PersonIcon } from "@radix-ui/react-icons";
import { PersonRepository } from "@/app/_repositories/personRepository";
import { CopyButton } from "../CopyButton/CopyButton";

export type PersonProfilePopupProps = { personId?: string; isBackup: boolean };

export async function PersonProfilePopup({
  personId,
  isBackup,
}: PersonProfilePopupProps) {
  if (!personId) return null;
  const repo = new PersonRepository(isBackup);
  const people = await repo.getPerson(personId);
  const person = people?.[0];
  if (!person) return null;
  return (
    <FixedToBottomRight>
      <Popover icon={<PersonIcon />}>
        <ItemContainer>
          <Paragraph>
            <Flex>
              <h1>{person.name}</h1>
              <h3>
                {person.stack} @{person.company}
              </h3>
              <h5>{person.generation}</h5>
              <h5>lives in {person.livingTown}</h5>
              <h5>originally from {person.hometown}</h5>
              <span>
                add me on social! <CopyButton value={person.name} />
              </span>
            </Flex>
          </Paragraph>
        </ItemContainer>
      </Popover>
    </FixedToBottomRight>
  );
}
