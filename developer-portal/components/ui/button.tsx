import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_18%,transparent)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-muted)] text-[var(--text-strong)] shadow-[0_16px_40px_var(--glow)] hover:-translate-y-0.5",
        brand:
          "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_16px_40px_var(--glow)] hover:-translate-y-0.5 hover:bg-[var(--accent-bright)]",
        secondary:
          "border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-strong)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]",
        ghost: "text-[var(--text-muted)] hover:bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] hover:text-[var(--text-strong)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
