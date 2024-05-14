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
import { FormContainer, StyledButton } from "../components/styled";
import { extractFirstErrorMessageFromSchemaError } from "@/app/utils/neo4j";

const InputRow = styled.div`
  width: 100%;
`;

function renderInput(
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
      <SingleSelect
        options={options}
        placeholder={capitalize(name)}
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
      setErrorMessage(
        extractFirstErrorMessageFromSchemaError(validatedPerson.error.message)
      );
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
        {renderInput("name", handleChange)}
        {renderInput("email", handleChange)}
        {renderInput("age", handleChange)}
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
        {renderInput("company", handleChange)}
        <StyledButton type="submit">NEXT</StyledButton>
        {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      </FormContainer>
    </form>
  );
}
