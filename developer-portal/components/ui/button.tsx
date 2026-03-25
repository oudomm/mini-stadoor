import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
  {
    variants: {
      variant: {
        default:
          "bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] hover:-translate-y-0.5",
        brand:
          "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_16px_40px_rgba(249,115,22,0.25)] hover:-translate-y-0.5",
        secondary:
          "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
        ghost: "text-slate-600 hover:bg-white/70 hover:text-slate-900",
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
