import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[116px] w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--field)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
