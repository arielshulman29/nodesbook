"use client";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import "./styles.css";
import useSearch from "@/app/_hooks/useSearch";

export type ToggleProps = {
  label: string;
  items: string[];
  replace?: boolean;
};

export const ToggleSearch = ({
  items,
  label,
  replace = false,
}: ToggleProps) => {
  const { setSearch, replaceSearch } = useSearch();
  return (
    <ToggleGroup.Root
      className="ToggleGroup"
      type="single"
      aria-label="Text alignment"
      onValueChange={(value) => {
        if (replace) {
          replaceSearch([{ key: label, value }]);
        } else {
          setSearch([{ key: label, value }]);
        }
      }}
    >
      {items.map((item) => (
        <ToggleGroup.Item
          className="ToggleGroupItem"
          key={item}
          value={item}
          aria-label="Left aligned"
        >
          {item}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
