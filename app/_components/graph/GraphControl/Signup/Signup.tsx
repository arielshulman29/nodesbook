"use client";
import { PersonIcon } from "@radix-ui/react-icons";
import { StyledIconWrapper } from "../../../shared/styled";
import Link from "next/link";
import { Tooltip } from "@/app/_components/shared/Tooltip/Tooltip";

export default function Signup() {
  return (
    <Tooltip label="Sign me up">
      <StyledIconWrapper>
        <Link href="/person">
          <PersonIcon height={36} width={36} strokeWidth={0.3} />
        </Link>
      </StyledIconWrapper>
    </Tooltip>
  );
}
