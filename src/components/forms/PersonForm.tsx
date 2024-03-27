import { useState } from "react";
import { personSchema, type Person } from "../../schemas/Person";
import { capitalize } from "../../utils/strings";
import { ErrorMessage } from "../ErrorMessage";
import Input, { type InputProps } from "./components/Input";
import { useLazyWriteCypher } from "use-neo4j";
import { useNavigate } from "react-router-dom";
import { IsraelCities } from "../../data/cities";
import { v4 as uuid } from "uuid";
import { SingleSelect } from "./components/SingleSelect";
import { stack } from "../../data/stacks";

function LabelAndInput(
  id: keyof Person,
  handleChange: (data: PartialPerson) => void,
  type?: InputProps["type"]
): JSX.Element {
  return (
    <>
      <label>{capitalize(id)}</label>
      <Input id={id} onBlur={handleChange} type={type} />
    </>
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Person> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [createPerson, { loading: loadingCreate, error: createError }] =
    useLazyWriteCypher(
      `CREATE (n:Person)
      SET n.id=$id, n.age=$age, n.company=$company,n.name=$name, n.email=$email,
          n.stack=$stack, n.livingTown=$livingTown, n.hometown=$hometown
      return n`
    );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const validatedPerson = personSchema.safeParse(formData);
      if (validatedPerson.success) {
        const id = uuid();
        await createPerson({ ...validatedPerson.data, id });
        if (id && !createError && !loadingCreate) navigate(`/${id}`);
      } else {
        setErrorMessage(validatedPerson.error.message);
      }
    } catch (err) {
      setErrorMessage("Something went wrong, please try again later");
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
      <div>please reply in english</div>
      {LabelAndInput("name", handleChange)}
      {LabelAndInput("email", handleChange)}
      {LabelAndInput("age", handleChange)}
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
      {LabelAndInput("company", handleChange)}
      <button type="submit">Save</button>
      <br />
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
    </form>
  );
}
