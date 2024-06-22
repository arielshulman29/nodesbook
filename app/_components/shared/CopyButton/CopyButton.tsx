"use client";

import { useCopyToClipboard } from "@/app/_hooks/useCopyToClipboard";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import styles from "./button.module.css";

type CopyButtonProps = { value: string };

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

export function CopyButton({ value }: CopyButtonProps) {
  const [copiedValue, copy] = useCopyToClipboard();
  return (
    <StyledButton onClick={() => copy(value)}>
      {copiedValue ? <CheckIcon /> : <CopyIcon />}
    </StyledButton>
  );
}
