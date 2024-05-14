import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PartialPerson } from "../PersonForm/PersonForm";
import { Person } from "../../../schemas/Person";

export type InputProps = {
  id: keyof Person;
  defaultValue?: string;
  onBlur?: (data: PartialPerson) => void;
  onChange?: (data: PartialPerson) => void;
  onFocus?: () => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
};

const StyledInput = styled.input`
  border-color: white !important;
  line-height: 40px;
  border-radius: 5px;
  width: 100%;
  text-indent: 10px;
`;

export default function Input({
  id,
  defaultValue,
  onBlur,
  onFocus,
  onChange,
  type,
  placeholder,
}: InputProps) {
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (typeof defaultValue == "string") setInputValue(defaultValue);
  }, [defaultValue]);
  return (
    <StyledInput
      onFocus={onFocus}
      type={type ?? "input"}
      value={inputValue}
      placeholder={placeholder}
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
  );
}
