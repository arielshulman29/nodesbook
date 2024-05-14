"use client";
import { useState } from "react";
import {
  isValidUuid,
  NewPerson,
  newPersonSchema,
  type Person,
} from "../../../schemas/Person";
import { capitalize } from "../../../utils/strings";
import { ErrorMessage } from "../../ErrorMessage";
import Input, { type InputProps } from "../components/Input";
import { useRouter } from "next/navigation";
import { IsraelCities } from "../../../data/cities";
import { SingleSelect } from "../components/SingleSelect";
import { stack } from "../../../data/stacks";
import { handleSave } from "./api";
import styled from "styled-components";
import { FormContainer } from "../components/styled";

const InputRow = styled.div`
  width: 100%;
`;

const StyledButton = styled.button`
  padding: 1% 0;
  background-color: transparent;
  color: var(--primary);
  font-size: 0.9rem;
  border-style: solid;
  border-color: var(--primary);
  border-radius: 8px;
`;

function LabelAndInput(
  id: keyof Person,
  handleChange: (data: PartialPerson) => void,
  type?: InputProps["type"]
): JSX.Element {
  return (
    <InputRow>
      <Input
        placeholder={capitalize(id)}
        id={id}
        onBlur={handleChange}
        type={type}
      />
    </InputRow>
  );
}

function renderSingleSelect(
  name: keyof Person,
  handleChange: ({ name, value }: PartialPerson) => void,
  options: { label: PartialPerson["value"]; value: PartialPerson["value"] }[],
  selectedOption?: {
    label: PartialPerson["value"];
    value: PartialPerson["value"];
  }
): JSX.Element {
  return (
    <>
      <label>{capitalize(name)}</label>
      <SingleSelect
        options={options}
        name={name}
        selectedOption={selectedOption}
        onChange={(value) => {
          if (!value || !value?.value) {
            handleChange({ name, value: "" });
          } else {
            //TODO: fix this type
            handleChange({
              name,
              value: value.value,
            } as unknown as PartialPerson);
          }
        }}
      />
    </>
  );
}

export type PartialPerson = {
  name: keyof Person;
  value: Person[keyof Person];
};

export default function PersonForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<NewPerson> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const validatedPerson = newPersonSchema.safeParse(formData);
    if (validatedPerson.success) {
      const response = await handleSave(validatedPerson.data);
      if (isValidUuid(response)) router.push(`person/${response}`);
    } else {
      setErrorMessage(validatedPerson.error.message);
    }
  };

  const handleChange = ({ name, value }: PartialPerson) => {
    let valueForUpdate: string | undefined = value;
    if (!value) valueForUpdate = undefined;
    setFormData((prevForm) => {
      return { ...prevForm, [name]: valueForUpdate };
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormContainer>
        {LabelAndInput("name", handleChange)}
        {LabelAndInput("email", handleChange)}
        {LabelAndInput("age", handleChange)}
        <InputRow>
          {renderSingleSelect(
            "hometown",
            handleChange,
            IsraelCities.map((city) => ({ value: city, label: city })),
            formData?.hometown
              ? { value: formData.hometown, label: formData.hometown }
              : undefined
          )}
        </InputRow>
        <InputRow>
          {renderSingleSelect(
            "livingTown",
            handleChange,
            IsraelCities.map((city) => ({ value: city, label: city })),
            formData?.livingTown
              ? { value: formData.livingTown, label: formData.livingTown }
              : undefined
          )}
        </InputRow>
        <InputRow>
          {renderSingleSelect(
            "stack",
            handleChange,
            stack.map((teckStack) => ({ value: teckStack, label: teckStack })),
            formData?.stack
              ? { value: formData.stack, label: formData.stack }
              : undefined
          )}
        </InputRow>
        {LabelAndInput("company", handleChange)}
        <StyledButton type="submit">SAVE</StyledButton>
        {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      </FormContainer>
    </form>
  );
}
