"use client";
import { SingleSelect } from "@/app/_components/shared/SingleSelect/SingleSelect";
import { Algorithms } from "./algorithms";
import useSearch from "@/app/_hooks/useSearch";
import { toCamelCase } from "@/app/_utils/strings";
import { ReactNode, useCallback } from "react";
import { Popover } from "@/app/_components/shared/Popover/Popover";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Flex } from "@/app/_components/shared/styled";

export function AlgorithmPicker({ children }: { children: ReactNode }) {
  const { replaceSearch, searchParams } = useSearch();

  const selectedAlgorithm = Object.values(Algorithms).find((algorithm) =>
    searchParams.has("algorithm", algorithm)
  ) as Algorithms | undefined;

  const options = Object.values(Algorithms).map((algorithm) => ({
    value: algorithm,
    label: toCamelCase(algorithm),
  }));

  const AlgorithmSelect = useCallback(
    () => (
      <SingleSelect
        name="algorithm"
        selectedOption={
          selectedAlgorithm
            ? {
                value: selectedAlgorithm,
                label: toCamelCase(selectedAlgorithm),
              }
            : undefined
        }
        onChange={(selected) => {
          replaceSearch([{ key: "algorithm", value: selected?.value }]);
        }}
        options={options}
      />
    ),
    [selectedAlgorithm, searchParams]
  );

  return (
    <Popover icon={<MixerHorizontalIcon />}>
      <Flex>
        <AlgorithmSelect />
        {children}
      </Flex>
    </Popover>
  );
}
