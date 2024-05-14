import { default as Select, type MultiValue } from "react-select";
import { StyledContainer } from "./styled";

export type MultiSelectProps<OptionsTypes> = {
  options: readonly OptionsTypes[];
  selectedOptions: OptionsTypes[];
  name: string;
  onChange: (newValue: MultiValue<OptionsTypes>) => void;
  placeholder?: string;
};

export function MultiSelect<OptionsTypes>({
  options,
  name,
  selectedOptions,
  onChange,
  placeholder,
}: MultiSelectProps<OptionsTypes>) {
  return (
    <StyledContainer>
      <Select
        instanceId={name}
        placeholder={placeholder}
        isMulti
        isSearchable
        onChange={onChange}
        defaultValue={selectedOptions}
        name={name}
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </StyledContainer>
  );
}
