"use client";

import { Container } from "@/app/_components/shared/styled";
import { CodeBlock, dracula } from "react-code-blocks";

export type CodeProps = {
  text: string;
  language: string;
};

export const Code = ({ text, language }: CodeProps) => {
  return (
    <div style={{ fontSize: "12px" }}>
      <CodeBlock text={text} language={language} theme={dracula} />
    </div>
  );
};
