"use client";
import { Tooltip } from "@/app/_components/shared/Tooltip/Tooltip";
import { Flex, Label } from "../../../shared/styled";
import styles from "./styles.module.css";

export type CounterProps = {
  count: number;
  label: string;
};

export const Counter = ({ count, label }: CounterProps) => {
  let title = "friendships";
  if (label === "nodes") title = "people";
  return (
    <Tooltip label={`number of ${title}`}>
      <Label>
        {label}: <span className={styles.counter}>{count}</span>
      </Label>
    </Tooltip>
  );
};
