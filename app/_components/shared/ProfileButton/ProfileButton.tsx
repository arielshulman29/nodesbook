"use client";

import { CheckIcon, PersonIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import styles from "./button.module.css";
import useSearch from "@/app/_hooks/useSearch";

const StyledButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <span>
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  </span>
);

type ProfileButtonProps = { personId: string };

export function ProfileButton({ personId }: ProfileButtonProps) {
  const { setSearch } = useSearch();
  return (
    <StyledButton
      onClick={() => setSearch([{ key: "personId", value: personId }])}
    >
      <PersonIcon />
    </StyledButton>
  );
}
