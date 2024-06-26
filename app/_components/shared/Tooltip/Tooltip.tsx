import React, { ReactNode } from "react";
import * as TooltipComponent from "@radix-ui/react-tooltip";
import "./styles.css";

export type TooltipProps = {
  children: ReactNode;
  label: string;
};

export const Tooltip = ({ children, label }: TooltipProps) => {
  return (
    <TooltipComponent.Provider>
      <TooltipComponent.Root>
        <TooltipComponent.Trigger asChild>
          <button>{children}</button>
        </TooltipComponent.Trigger>
        <TooltipComponent.Portal>
          <TooltipComponent.Content
            className="TooltipContent"
            sideOffset={5}
            align="end"
          >
            {label}
            <TooltipComponent.Arrow className="TooltipArrow" />
          </TooltipComponent.Content>
        </TooltipComponent.Portal>
      </TooltipComponent.Root>
    </TooltipComponent.Provider>
  );
};
