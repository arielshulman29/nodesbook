"use client";
import { useState } from "react";
import {
  NewPerson,
  newPersonSchema,
  type Person,
} from "../../../_schemas/Person";
import { capitalize } from "../../../_utils/strings";
import { ErrorMessage } from "../components/ErrorMessage/ErrorMessage";
import Input, { type InputProps } from "../components/Input/Input";
import { useRouter } from "next/navigation";
import { IsraelCities } from "../../../_data/cities";
import { stack } from "../../../_data/stacks";
import { handleSave } from "./api";
import { SingleSelect } from "../../shared/SingleSelect/SingleSelect";
import { Container, FullScreen } from "../../shared/styled";
import { Generations, generationsMap } from "@/app/_data/generations";
import { isBackup } from "@/app/_utils/neo4j";
import useSearch from "@/app/_hooks/useSearch";

function renderInput(
  id: keyof Person,
  handleChange: (data: PartialPerson) => void,
  type?: InputProps["type"]
): JSX.Element {
  return (
    <Input
      placeholder={capitalize(id)}
      id={id}
      onBlur={handleChange}
      type={type}
    />
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
    <span style={{ marginTop: "1%" }}>
      <SingleSelect
        options={options}
        placeholder={capitalize(name)}
        name={name}
        selectedOption={selectedOption}
        onChange={(option) => {
          if (!option || !option?.value) {
            handleChange({ name, value: "" });
          } else {
            //TODO: fix this type
            handleChange({
              name,
              value: option.value,
            } as unknown as PartialPerson);
          }
        }}
      />
    </span>
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
      const response = await handleSave(validatedPerson.data, false);
      if (response.success) router.push(`person/${response.id}`);
    } else {
      const error =
        validatedPerson.error.format()?.name?._errors[0] ??
        validatedPerson.error.format()?.email?._errors[0] ??
        validatedPerson.error.format()?.generation?._errors[0] ??
        validatedPerson.error.format()?.hometown?._errors[0] ??
        validatedPerson.error.format()?.livingTown?._errors[0] ??
        validatedPerson.error.format()?.stack?._errors[0] ??
        validatedPerson.error.format()?.company?._errors[0];
      setErrorMessage(`${error}` ?? "Sorry Something went wrong");
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
    <form onSubmit={handleSubmit} autoComplete="off">
      <FullScreen>
        {renderInput("name", handleChange)}
        {renderInput("email", handleChange)}
        {renderSingleSelect(
          "generation",
          handleChange,
          Object.values(Generations).map((gen) => ({
            value: gen,
            label: `${gen} ${generationsMap[gen as Generations].join("-")}`,
          })),
          formData?.generation
            ? { value: formData.generation, label: formData.generation }
            : undefined
        )}
        {renderSingleSelect(
          "hometown",
          handleChange,
          IsraelCities.map((city) => ({ value: city, label: city })),
          formData?.hometown
            ? { value: formData.hometown, label: formData.hometown }
            : undefined
        )}
        {renderSingleSelect(
          "livingTown",
          handleChange,
          IsraelCities.map((city) => ({ value: city, label: city })),
          formData?.livingTown
            ? { value: formData.livingTown, label: formData.livingTown }
            : undefined
        )}
        {renderSingleSelect(
          "stack",
          handleChange,
          stack.map((teckStack) => ({ value: teckStack, label: teckStack })),
          formData?.stack
            ? { value: formData.stack, label: formData.stack }
            : undefined
        )}
        {renderInput("company", handleChange)}

        <button type="submit" style={{ background: "none" }}>
          <Container>Save</Container>
        </button>

        {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      </FullScreen>
    </form>
  );
}
