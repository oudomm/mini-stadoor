import { cn } from "@/lib/utils";

type StadoorLogoProps = {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  subtitleClassName?: string;
  compact?: boolean;
  showSubtitle?: boolean;
};

export function StadoorLogo({
  className,
  iconClassName,
  wordmarkClassName,
  subtitleClassName,
  compact = false,
  showSubtitle = true,
}: StadoorLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-soft)_0%,var(--surface)_100%)] shadow-[0_0_30px_var(--glow)]",
          iconClassName,
        )}
      >
        <StadoorMark />
      </div>

      {compact ? null : (
        <div>
          <p className={cn("text-2xl font-semibold tracking-tight text-[var(--text-strong)]", wordmarkClassName)}>Mini Stadoor</p>
          {showSubtitle ? (
            <p
              className={cn(
                "text-[11px] uppercase tracking-[0.24em] text-[var(--text-faint)]",
                subtitleClassName,
              )}
            >
              developer security platform
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function StadoorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <rect x="8" y="8" width="48" height="48" rx="14" stroke="rgba(86,227,64,0.18)" strokeWidth="2.5" />
      <rect x="26" y="15" width="12" height="34" rx="5" fill="#56E340" />
      <circle cx="17" cy="24" r="4" fill="#9CF08F" />
      <circle cx="47" cy="40" r="4" fill="#9CF08F" />
      <path
        d="M21 24H26M38 40H43M17 40H23C25.7614 40 28 37.7614 28 35V29M47 24H41C38.2386 24 36 26.2386 36 29V35"
        stroke="#9CF08F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
