import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  Fingerprint,
  Grid2x2,
  LifeBuoy,
  Network,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Waypoints,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requirePortalSession } from "@/lib/platform-auth";
import { StadoorLogo } from "@/components/stadoor-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeveloperPortal } from "../components/developer-portal";

type DashboardPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const dashboardTabs = [
  "overview",
  "gateway",
  "iam",
] as const;

type DashboardTab = (typeof dashboardTabs)[number];

const tabMeta: Record<
  DashboardTab,
  {
    label: string;
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  }
> = {
  overview: {
    label: "Overview",
    eyebrow: "stadoor_control_plane",
    title: "Developer Security SaaS",
    description:
      "Operate Mini Stadoor as a product control plane: register developer applications, group them by gateway workspace, and expose the wider security platform roadmap in one place.",
    ctaLabel: "Open gateway",
    ctaHref: "/dashboard?tab=gateway",
  },
  gateway: {
    label: "Gateway",
    eyebrow: "gateway_registration_routing",
    title: "Gateway Management",
    description:
      "Create gateway workspaces, register services inside them, and publish dynamic routes with route-level security in one flow.",
    ctaLabel: "Manage gateway",
    ctaHref: "/dashboard?tab=gateway",
  },
  iam: {
    label: "IAM",
    eyebrow: "identity_access_management",
    title: "Identity Platform",
    description:
      "Reserve product space for login, access control, token issuance, and OAuth2 with OIDC so Mini Stadoor feels like a real developer security suite.",
    ctaLabel: "Roadmap view",
    ctaHref: "/dashboard?tab=iam",
  },
};

function normalizeTab(tab?: string): DashboardTab {
  return dashboardTabs.includes(tab as DashboardTab) ? (tab as DashboardTab) : "overview";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requirePortalSession();
  const params = searchParams ? await searchParams : undefined;
  const activeTab = normalizeTab(params?.tab);
  const meta = tabMeta[activeTab];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <div className="grid min-h-screen xl:grid-cols-[284px_minmax(0,1fr)]">
        <aside className="border-r border-white/6 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_92%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_84%,var(--background))_100%)] px-5 py-6 xl:sticky xl:top-0 xl:h-screen">
          <StadoorLogo
            iconClassName="h-12 w-12"
            wordmarkClassName="text-3xl uppercase tracking-[-0.05em] text-[var(--text-strong)]"
            subtitleClassName="hidden"
          />

          <div className="mt-10 border-t border-white/8 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                  signal_alpha
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--text-faint)]">developer_workspace</p>
              </div>
              <div className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
                live
              </div>
            </div>
            <p className="mt-5 max-w-[17rem] text-sm leading-7 text-[var(--text-muted)]">
              Control center for gateway workspaces, service onboarding, and route security across the Mini Stadoor prototype.
            </p>
          </div>

          <div className="animate-panel mt-8 space-y-2 rounded-[1.2rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] p-2" style={{ animationDelay: "80ms" }}>
            <SidebarItem
              icon={<Grid2x2 className="h-4 w-4" />}
              label="Overview"
              href="/dashboard?tab=overview"
              active={activeTab === "overview"}
            />
            <SidebarItem
              icon={<Network className="h-4 w-4" />}
              label="Gateway"
              href="/dashboard?tab=gateway"
              active={activeTab === "gateway"}
            />
            <SidebarItem
              icon={<Fingerprint className="h-4 w-4" />}
              label="IAM"
              href="/dashboard?tab=iam"
              active={activeTab === "iam"}
            />
          </div>

          <div className="animate-panel mt-10 rounded-[1.2rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_72%,transparent)] p-4" style={{ animationDelay: "140ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Current surface</p>
            <div className="mt-4 space-y-3">
              <MiniSignal label="Application registration" />
              <MiniSignal label="Gateway grouping" />
              <MiniSignal label="Dynamic gateway routes" />
              <MiniSignal label="Identity roadmap" />
              <MiniSignal label="Security controls" />
            </div>
          </div>

          <Button
            variant="brand"
            className="mt-10 h-12 w-full rounded-[0.95rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
            asChild
          >
            <Link href="/dashboard?tab=gateway">Open gateway</Link>
          </Button>

          <div className="mt-8 border-t border-white/8 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">Status panel</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-strong)]">Live</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">workspace control plane available</p>
            <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
              <Activity className="h-3.5 w-3.5" />
              systems_operational
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            <p>Docs</p>
            <p>Support</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="border-b border-white/6 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_96%,var(--surface))_0%,color-mix(in_srgb,var(--surface)_74%,var(--background))_100%)] px-6 py-6">
            <div className="animate-panel rounded-[1.35rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_76%,transparent)] p-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]">
                    <span className="text-[var(--accent-soft)]">{meta.eyebrow}</span>
                    <span className="text-[var(--text-faint)]">/</span>
                    <span className="text-[var(--text-faint)]">{meta.label}</span>
                  </div>
                  <h1 className="mt-5 text-4xl font-semibold uppercase tracking-[-0.05em] text-[var(--text-strong)] lg:text-5xl">
                    {meta.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">
                    {meta.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 xl:min-w-[420px] xl:max-w-[440px]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
                    <Input
                      className="border-white/8 bg-[var(--field)] pl-11 text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                      placeholder="query_stadoor..."
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-[0.9rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 py-2 text-sm text-[var(--text-muted)]">
                      Signed in as <span className="font-semibold text-[var(--text-strong)]">{session.displayName ?? session.username}</span>
                    </div>
                    <ThemeToggle />
                    <TopIcon icon={<Bell className="h-4 w-4" />} />
                    <TopIcon icon={<LifeBuoy className="h-4 w-4" />} />
                    <Button asChild variant="secondary" className="border-white/10 bg-transparent text-[var(--text-strong)] hover:border-white/20 hover:bg-white/5">
                      <Link href="/api/auth/logout">Log out</Link>
                    </Button>
                    <Button asChild variant="secondary" className="border-white/10 bg-transparent text-[var(--text-strong)] hover:border-white/20 hover:bg-white/5">
                      <Link href="/">Landing</Link>
                    </Button>
                    <Button asChild variant="brand" className="border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]">
                      <Link href={meta.ctaHref}>{meta.ctaLabel}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <DeveloperPortal activeTab={activeTab} />
        </section>
      </div>
    </main>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  active,
}: {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-[0.95rem] px-4 py-3 text-sm font-medium transition ${
        active ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_24px_var(--glow)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function TopIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_82%,transparent)] text-[var(--text-muted)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-strong)]">
      {icon}
    </div>
  );
}

function MiniSignal({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 border-l border-white/8 pl-3">
      <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
    </div>
  );
}
