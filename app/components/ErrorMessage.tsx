import { styled } from "styled-components";

const StyledMessage = styled.span`
  color: var(--primary);
`;
export const ErrorMessage = ({ message }: { message: string }) => {
  return <StyledMessage>{message}</StyledMessage>;
};
