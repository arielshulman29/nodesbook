import { PersonRepository } from "@/app/_repositories/personRepository";
import { Algorithms } from "../AlgorithmPicker/algorithms";
import { Code } from "./CodeClientWarapper";
import { Popover } from "@/app/_components/shared/Popover/Popover";
import { CodeIcon } from "@radix-ui/react-icons";
import { Box, Label, Paragraph } from "@/app/_components/shared/styled";
import { toCamelCase } from "@/app/_utils/strings";
import { code, explanations } from "./explanations";
import { isBackup } from "@/app/_utils/neo4j";

export type AlgorithmExplainerProps = {
  algorithm?: string;
  searchParams?: Record<string, string[] | string | undefined>;
};

export function AlgorithmExplainer({
  algorithm,
  searchParams,
}: AlgorithmExplainerProps) {
  if (
    typeof algorithm === "string" &&
    Object.values(Algorithms).find((al) => al === algorithm)
  ) {
    const repo = new PersonRepository(isBackup(searchParams));
    const selectedAlgorithm = algorithm as Algorithms;

    return (
      <Popover icon={<CodeIcon />}>
        <Box>
          <Code text={code[selectedAlgorithm]} language="js" />

          <br />
          <Paragraph>
            <h2>{toCamelCase(algorithm)}</h2>
            {explanations[selectedAlgorithm]}
          </Paragraph>
        </Box>
      </Popover>
    );
  }
  return <></>;
}
