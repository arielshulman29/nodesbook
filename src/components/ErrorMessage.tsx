import { styled } from "styled-components";

const StyledMessage = styled.span`
  color: #ea3759;
`;
export const ErrorMessage = ({ message }: { message: string }) => {
  return <StyledMessage>{message}</StyledMessage>;
};
