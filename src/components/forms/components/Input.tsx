import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PartialPerson } from "../PersonForm";
import { Person } from "../../../schemas/Person";
import { StyledContainer } from "./styled";

export type InputProps = {
  id: keyof Person;
  defaultValue?: string;
  onBlur?: (data: PartialPerson) => void;
  onChange?: (data: PartialPerson) => void;
  onFocus?: () => void;
  type?: React.HTMLInputTypeAttribute;
};

const StyledInput = styled.input`
  border: 1 px solid white;
  line-height: 40px;
  borderradius: 5px;
  width: 100%;
`;

export default function Input({
  id,
  defaultValue,
  onBlur,
  onFocus,
  onChange,
  type,
}: InputProps) {
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (typeof defaultValue == "string") setInputValue(defaultValue);
  }, [defaultValue]);
  return (
    <StyledContainer>
      <StyledInput
        onFocus={onFocus}
        type={type ?? "input"}
        value={inputValue}
        name={id}
        id={id}
        required
        onChange={({ target: { value } }) => {
          setInputValue(value);
          onChange?.({ name: id, value } as PartialPerson);
        }}
        onBlur={() => {
          if (inputValue) {
            onBlur?.({ name: id, value: inputValue } as PartialPerson);
          }
        }}
      />
    </StyledContainer>
  );
}
