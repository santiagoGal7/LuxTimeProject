import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "h-12 w-full border border-white/15 bg-transparent px-3 text-sm text-ivory outline-none placeholder:text-ivory/35 focus:border-gold",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
