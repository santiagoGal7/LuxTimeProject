import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("btn", {
  variants: {
    variant: {
      salon: "btn-primary",
      solid: "btn-primary",
      ghost: "btn-ghost",
      quiet: "btn-secondary",
      icon: "btn-secondary btn-icon",
    },
    size: {
      default: "btn-md",
      sm: "btn-sm",
      icon: "btn-icon",
    },
  },
  defaultVariants: {
    variant: "salon",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), loading && "btn-loading")}
        ref={ref}
        aria-busy={loading || undefined}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
