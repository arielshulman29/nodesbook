import { PersonIcon } from "@radix-ui/react-icons";
import styled from "styled-components";
import { Tooltip } from "../../../shared/Tooltip/Tooltip";

const StyledButtonWrapper = styled.div`
  border-radius: 50%;
  color: #4a56a6;
  border: 2px solid #4a56a6;
  width: 40px;
  height: 40px;
  justify-content: center;
  cursor: pointer;
  :hover {
    background-color: #16abff33;
    border-radius: 50%;
  }
`;

export default function Signup() {
  return (
    <Tooltip label="Sign me up">
      <StyledButtonWrapper>
        <PersonIcon height={36} width={36} strokeWidth={0.3} />
      </StyledButtonWrapper>
    </Tooltip>
  );
}
