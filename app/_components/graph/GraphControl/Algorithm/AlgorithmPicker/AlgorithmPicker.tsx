"use client";
import { SingleSelect } from "@/app/_components/shared/SingleSelect/SingleSelect";
import { Algorithms } from "./algorithms";
import useSearch from "@/app/_hooks/useSearch";
import { toCamelCase } from "@/app/_utils/strings";

export function AlgorithmPicker() {
  const { replaceSearch, searchParams } = useSearch();

  const selectedAlgorithm = Object.values(Algorithms).find((algorithm) =>
    searchParams.has("algorithm", algorithm)
  ) as Algorithms | undefined;

  const options = Object.values(Algorithms).map((algorithm) => ({
    value: algorithm,
    label: toCamelCase(algorithm),
  }));

  return (
    <SingleSelect
      name="algorithm"
      selectedOption={
        selectedAlgorithm
          ? { value: selectedAlgorithm, label: toCamelCase(selectedAlgorithm) }
          : undefined
      }
      onChange={(selected) => {
        replaceSearch([{ key: "algorithm", value: selected?.value }]);
      }}
      options={options}
    />
  );
}
