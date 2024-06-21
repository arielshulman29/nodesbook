import {
  GroupBase,
  default as Select,
  StylesConfig,
  type SingleValue,
} from "react-select";

export type SingleSelectProps<OptionsTypes> = {
  options: readonly OptionsTypes[];
  name: string;
  onChange: (selected: SingleValue<OptionsTypes>) => void;
  selectedOption?: OptionsTypes;
  placeholder?: string;
};
const customStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

export function SingleSelect<OptionsTypes>({
  options,
  name,
  selectedOption,
  onChange,
  placeholder,
}: SingleSelectProps<OptionsTypes>): JSX.Element {
  return (
    <Select
      styles={customStyles}
      instanceId={name}
      placeholder={placeholder}
      closeMenuOnSelect
      isSearchable
      onChange={(newValue) => onChange(newValue as OptionsTypes)}
      className="basic-single"
      classNamePrefix="select"
      defaultValue={selectedOption}
      name={name}
      options={options}
    />
  );
}
