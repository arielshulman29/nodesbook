import Link from "next/link";
import { Person } from "@/app/_schemas/Person";
import { CopyButton } from "@/app/_components/shared/CopyButton/CopyButton";
import {
  Container,
  FixedToBottom,
  ItemContainer,
  StyledWrapper,
  Flex,
  HideOnMobile,
  Label,
} from "../styled";

export type PeoplePopupProps = { people: Person[] };

export async function PeoplePopup({ people }: PeoplePopupProps) {
  return (
    <HideOnMobile>
      <FixedToBottom>
        <ItemContainer>
          <Container>
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
          </Container>
        </ItemContainer>
      </FixedToBottom>
    </HideOnMobile>
  );
}
