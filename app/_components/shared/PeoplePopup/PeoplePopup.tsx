import { Person } from "@/app/_schemas/Person";
import {
  FixedToBottom,
  ItemContainer,
  StyledWrapper,
  Flex,
  Label,
} from "../styled";
import { Popover } from "../Popover/Popover";
import { PersonIcon, Share1Icon } from "@radix-ui/react-icons";
import { ProfileButton } from "../ProfileButton/ProfileButton";

export type PeoplePopupProps = { people: Person[] };

export async function PeoplePopup({ people }: PeoplePopupProps) {
  return (
    <FixedToBottom>
      <Popover icon={<Share1Icon />}>
        <ItemContainer>
          <Flex>
            {people.length ? (
              people.map((person) => (
                <StyledWrapper key={person.id}>
                  {person.name} ({person.company})
                  <ProfileButton personId={person.id} />
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
