import Link from "next/link";

import { getPortalSession } from "@/lib/platform-auth";
import { StadoorLogo } from "@/components/stadoor-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type NavKey = "home" | "about" | "dashboard";

type SiteHeaderProps = {
  active: NavKey;
  ctaLabel: string;
  ctaHref: string;
};

export async function SiteHeader({ active, ctaLabel, ctaHref }: SiteHeaderProps) {
  const session = await getPortalSession();
  const navItems = [
    { key: "home" as const, label: "Home", href: "/" },
    { key: "about" as const, label: "About", href: "/about" },
    { key: "dashboard" as const, label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="site-header flex items-center justify-between border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] px-5 py-4 backdrop-blur-sm">
      <StadoorLogo subtitleClassName="text-[var(--text-faint)]" wordmarkClassName="text-xl text-[var(--text-strong)]" />

      <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] md:flex">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={active === item.key ? "text-[var(--text-strong)]" : "transition hover:text-[var(--text-strong)]"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button asChild variant="ghost" size="sm" className="text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]">
          <Link href={session ? "/api/auth/logout" : "/login"}>{session ? "Log out" : "Log in"}</Link>
        </Button>
        <Button
          asChild
          variant="brand"
          size="sm"
          className="border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_28px_var(--glow)] hover:bg-[var(--accent-bright)]"
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </header>
  );
}
