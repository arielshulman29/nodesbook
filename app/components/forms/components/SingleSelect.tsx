import { default as Select, type SingleValue } from "react-select";
import { StyledContainer } from "./styled";

export type SingleSelectProps<OptionsTypes> = {
  options: readonly OptionsTypes[];
  name: string;
  onChange: (selected: SingleValue<OptionsTypes>) => void;
  selectedOption?: OptionsTypes;
  placeholder?: string;
};

export function SingleSelect<OptionsTypes>({
  options,
  name,
  selectedOption,
  onChange,
  placeholder,
}: SingleSelectProps<OptionsTypes>): JSX.Element {
  return (
    <StyledContainer>
      <Select
        instanceId={name}
        placeholder={placeholder}
        closeMenuOnSelect
        isSearchable
        onChange={onChange}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={selectedOption}
        name={name}
        options={options}
      />
    </StyledContainer>
  );
}
