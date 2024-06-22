import Link from "next/link";
import { Person } from "@/app/_schemas/Person";
import { CopyButton } from "@/app/_components/shared/CopyButton/CopyButton";
import {
  Container,
  FixedToBottom,
  ItemContainer,
  StyledWrapper,
  Flex,
  Label,
} from "../styled";
import { Popover } from "../Popover/Popover";
import { PersonIcon } from "@radix-ui/react-icons";

export type PeoplePopupProps = { people: Person[] };

export async function PeoplePopup({ people }: PeoplePopupProps) {
  return (
    <FixedToBottom>
      <Popover icon={<PersonIcon />}>
        <ItemContainer>
          <Flex>
            {people.length ? (
              people.map((person) => (
                <StyledWrapper key={person.id}>
                  <Link href={`/?user_id=${person.id}`}>
                    {person.name} ({person.company})
                  </Link>
                  <CopyButton value={person.name} />
                </StyledWrapper>
              ))
            ) : (
              <Label>No people Found</Label>
            )}
          </Flex>
        </ItemContainer>
      </Popover>
    </FixedToBottom>
  );
}
