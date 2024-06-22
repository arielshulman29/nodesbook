import { useEffect, useState } from "react";
import { PartialPerson } from "../../PersonForm/PersonForm";
import { Person } from "../../../../_schemas/Person";
import styles from "./style.module.css";

export type InputProps = {
  id: keyof Person;
  defaultValue?: string;
  onBlur?: (data: PartialPerson) => void;
  onChange?: (data: PartialPerson) => void;
  onFocus?: () => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
};

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
    <input
      className={styles.inputBox}
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
