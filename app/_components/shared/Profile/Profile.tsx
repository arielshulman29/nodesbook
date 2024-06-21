import { Person } from "@/app/_schemas/Person";
import { CopyButton } from "@/app/_components/shared/CopyButton/CopyButton";
import { Container, FixedToBottom, Label } from "../styled";

export type PersonProfilePopupProps = { person: Person };

export async function PersonProfilePopup({ person }: PersonProfilePopupProps) {
  return (
    <FixedToBottom>
      <Container>
        <Label>{person.name}</Label>
        <CopyButton value={person.name} />
      </Container>
    </FixedToBottom>
  );
}
