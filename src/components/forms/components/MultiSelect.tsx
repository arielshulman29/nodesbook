import { default as Select, type MultiValue } from "react-select";
import { StyledContainer } from "./styled";

export type MultiSelectProps<OptionsTypes> = {
  options: readonly OptionsTypes[];
  selectedOptions: OptionsTypes[];
  name: string;
  onChange: (newValue: MultiValue<OptionsTypes>) => void;
};

export function MultiSelect<OptionsTypes>({
  options,
  name,
  selectedOptions,
  onChange,
}: MultiSelectProps<OptionsTypes>) {
  return (
    <StyledContainer>
      <Select
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
