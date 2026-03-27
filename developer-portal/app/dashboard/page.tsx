import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  Bell,
  Grid2x2,
  Moon,
  Route,
  Search,
  Server,
  Settings,
  Shield,
  Users,
  Waypoints,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requirePortalSession } from "@/lib/platform-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeveloperPortal } from "../components/developer-portal";
import type { DashboardTab } from "../components/developer-portal/model";

type DashboardPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const sidebarItems: Array<{
  key: DashboardTab;
  label: string;
  icon: LucideIcon;
}> = [
  { key: "dashboard", label: "Dashboard", icon: Grid2x2 },
  { key: "gateways", label: "Gateways", icon: Waypoints },
  { key: "services", label: "Services", icon: Server },
  { key: "routes", label: "Routes", icon: Route },
  { key: "security", label: "Security", icon: Shield },
  { key: "consumers", label: "Consumers", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

const tabMeta: Record<
  DashboardTab,
  {
    title: string;
    description: string;
    ctaLabel?: string;
    ctaHref?: string;
  }
> = {
  dashboard: {
    title: "Dashboard",
    description: "Manage and monitor your API gateway workspaces and protected routes.",
  },
  gateways: {
    title: "Gateways",
    description: "Create and configure gateway workspaces for grouped service ownership.",
    ctaLabel: "Add Gateway",
    ctaHref: "/dashboard?tab=gateways",
  },
  services: {
    title: "Services",
    description: "Register and manage backend services for your gateways.",
    ctaLabel: "Add Service",
    ctaHref: "/dashboard?tab=services",
  },
  routes: {
    title: "Routes",
    description: "Configure API routes and map public endpoints to backend services.",
    ctaLabel: "Add Route",
    ctaHref: "/dashboard?tab=routes",
  },
  security: {
    title: "Security",
    description: "Track route protection strategy across BASIC, API_KEY, JWT, and planned OAuth2.",
  },
  consumers: {
    title: "Consumers",
    description: "Manage consumer access for Basic Auth, API Key, and JWT protected routes.",
  },
  settings: {
    title: "Settings",
    description: "Configure your account, defaults, and portal preferences.",
  },
};

function normalizeTab(tab?: string): DashboardTab {
  if (tab === "overview") {
    return "dashboard";
  }
  if (tab === "gateway") {
    return "gateways";
  }
  if (tab === "iam") {
    return "security";
  }
  return sidebarItems.some((item) => item.key === tab) ? (tab as DashboardTab) : "dashboard";
}

function initials(name?: string, username?: string) {
  const source = name || username || "DV";
  const chunks = source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (chunks.length === 0) {
    return "DV";
  }
  return chunks.map((chunk) => chunk.charAt(0).toUpperCase()).join("");
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requirePortalSession();
  const params = searchParams ? await searchParams : undefined;
  const activeTab = normalizeTab(params?.tab);
  const meta = tabMeta[activeTab];
  const displayName = session.displayName ?? session.username;
  const displayEmail = session.email ?? `${session.username}@stadoor.com`;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <div className="grid min-h-screen xl:grid-cols-[252px_minmax(0,1fr)]">
        <aside className="flex flex-col border-r border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_82%,var(--background))]">
          <div className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] px-6 py-7">
            <p className="text-4xl font-semibold tracking-[-0.055em] text-[var(--text-strong)]">Stadoor</p>
            <p className="mt-1 text-[1rem] text-[var(--text-muted)]">Developer Portal</p>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activeTab;
              return (
                <Link
                  key={item.key}
                  href={`/dashboard?tab=${item.key}`}
                  className={`flex items-center gap-3 rounded-[0.82rem] px-3.5 py-3 text-[1.05rem] font-medium transition ${
                    isActive
                      ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                      : "text-[var(--accent-soft)] hover:bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] px-6 py-5 text-sm text-[var(--text-faint)]">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2026 Stadoor</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_92%,var(--background))]">
            <div className="flex flex-wrap items-center gap-3 px-5 py-3">
              <div className="relative min-w-[280px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
                <Input
                  className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] pl-10 text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                  placeholder="Search gateways, services, routes..."
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <TopCircle icon={<Moon className="h-4 w-4" />} />
                <TopCircle icon={<Bell className="h-4 w-4" />} />
                <div className="ml-1 flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-2.5 py-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-contrast)]">
                    {initials(session.displayName, session.username)}
                  </div>
                  <div className="pr-1 leading-tight">
                    <p className="text-sm font-semibold text-[var(--text-strong)]">{displayName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{displayEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-5 py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-[2.35rem] font-semibold tracking-[-0.055em] text-[var(--text-strong)]">{meta.title}</h1>
                <p className="mt-1 text-xl text-[var(--text-muted)]">{meta.description}</p>
              </div>

              {meta.ctaLabel && meta.ctaHref ? (
                <Button
                  asChild
                  variant="brand"
                  className="h-11 rounded-[0.8rem] border border-[var(--border-strong)] bg-[var(--accent)] px-5 text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                >
                  <Link href={meta.ctaHref}>{meta.ctaLabel}</Link>
                </Button>
              ) : null}
            </div>

            <DeveloperPortal
              activeTab={activeTab}
              operatorName={displayName}
              operatorEmail={displayEmail}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function TopCircle({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] text-[var(--accent-soft)]">
      {icon}
    </div>
  );
}
