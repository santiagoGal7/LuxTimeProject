"use client";

import type * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("text-[0.68rem] uppercase tracking-[0.16em] text-mute", className)}
      {...props}
    />
  );
}

export { Label };
