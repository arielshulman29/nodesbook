import { styled } from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1%;
`;

export const FormContainer = styled.div`
  height: 100vh;
  padding: 1%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2%;
`;

export const StyledButton = styled.button`
  padding: 1% 0;
  font-size: 0.9rem;
  border-style: solid;
  border-color: var(--primary);
  color: var(--primary);
  background-color: transparent;
  border-radius: 8px;
`;
