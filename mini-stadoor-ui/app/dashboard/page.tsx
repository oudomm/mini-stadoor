import type { ReactNode } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requirePortalSession } from "@/lib/platform-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeveloperPortal } from "@/components/mini-stadoor-ui";
import type { DashboardTab } from "@/components/mini-stadoor-ui/model";
import { SidebarNav } from "./sidebar-nav";

type DashboardPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const dashboardTabs: DashboardTab[] = [
  "dashboard",
  "gateways",
  "services",
  "routes",
  "consumers",
  "clients",
  "roles",
  "users",
  "settings",
  "tunnel-cli",
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
  },
  services: {
    title: "Services",
    description: "Register and manage backend services for your gateways.",
  },
  routes: {
    title: "Routes",
    description: "Configure API routes and map public endpoints to backend services.",
  },
  consumers: {
    title: "Consumers",
    description: "Manage gateway-scoped runtime identities and credential flows for protected routes.",
  },
  clients: {
    title: "Client",
    description: "Review OAuth clients and app registrations that belong to the IAM side of Stadoor.",
  },
  roles: {
    title: "Role",
    description: "Organize IAM access policies, assignment rules, and permission boundaries.",
  },
  users: {
    title: "User",
    description: "Manage gateway-scoped runtime identities and credential flows for protected routes.",
  },
  settings: {
    title: "Settings",
    description: "Configure your account, defaults, and portal preferences.",
  },
  "tunnel-cli": {
    title: "Tunnel CLI",
    description: "Set up the local tunnel workflow that lets developers expose services into Stadoor.",
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
    return "clients";
  }
  if (tab === "tunnel") {
    return "tunnel-cli";
  }
  return dashboardTabs.includes(tab as DashboardTab) ? (tab as DashboardTab) : "dashboard";
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
            <Link
              href="/"
              className="block transition hover:opacity-85"
              aria-label="Go to home page"
            >
              <p className="text-4xl font-semibold tracking-[-0.055em] text-[var(--text-strong)]">Stadoor</p>
              <p className="mt-1 text-[1rem] text-[var(--text-muted)]">Developer Portal</p>
            </Link>
          </div>

          <SidebarNav activeTab={activeTab} />

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
