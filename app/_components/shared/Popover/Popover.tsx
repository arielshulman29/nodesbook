import React, { ReactNode } from "react";
import * as PopoverComponent from "@radix-ui/react-popover";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";

export const Popover = ({ children }: { children: ReactNode }) => (
  <PopoverComponent.Root>
    <PopoverComponent.Trigger asChild>
      <button className="IconButton" aria-label="Update dimensions">
        <MixerHorizontalIcon />
      </button>
    </PopoverComponent.Trigger>
    <PopoverComponent.Portal>
      <PopoverComponent.Content className="PopoverContent" sideOffset={5}>
        {children}
        <PopoverComponent.Close className="PopoverClose" aria-label="Close">
          <Cross2Icon />
        </PopoverComponent.Close>
        <PopoverComponent.Arrow className="PopoverArrow" />
      </PopoverComponent.Content>
    </PopoverComponent.Portal>
  </PopoverComponent.Root>
);
