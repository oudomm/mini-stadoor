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
import { StadoorLogo } from "@/components/stadoor-logo";
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
  const params = searchParams ? await searchParams : undefined;
  const activeTab = normalizeTab(params?.tab);
  const meta = tabMeta[activeTab];

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="grid min-h-screen xl:grid-cols-[284px_minmax(0,1fr)]">
        <aside className="border-r border-white/6 bg-[#101010] px-5 py-6">
          <StadoorLogo
            iconClassName="h-12 w-12"
            wordmarkClassName="text-3xl uppercase tracking-[-0.05em] text-[#00ff41]"
            subtitleClassName="hidden"
          />

          <div className="mt-10 rounded-[1.25rem] border border-white/8 bg-[linear-gradient(180deg,#171717_0%,#111111_100%)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                  signal_alpha
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/34">developer_workspace</p>
              </div>
              <div className="rounded-full border border-[#00ff41]/20 bg-[#0f170f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aff9d]">
                live
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-white/54">
              Control center for gateway workspaces, service onboarding, and route security across the Mini Stadoor prototype.
            </p>
          </div>

          <div className="mt-8 space-y-2">
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

          <div className="mt-10 rounded-[1.2rem] border border-white/8 bg-[#171717] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">Current surface</p>
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
            className="mt-10 h-12 w-full rounded-[0.95rem] border border-[#00ff41]/30 bg-[#00ff41] text-black hover:bg-[#7cff98]"
            asChild
          >
            <Link href="/dashboard?tab=gateway">Open gateway</Link>
          </Button>

          <div className="mt-8 rounded-[1.2rem] border border-white/8 bg-[#141414] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Status panel</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Live</p>
            <p className="mt-1 text-sm text-white/50">workspace control plane available</p>
            <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fff8b]">
              <Activity className="h-3.5 w-3.5" />
              systems_operational
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-[12px] uppercase tracking-[0.18em] text-white/34">
            <p>Docs</p>
            <p>Support</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="border-b border-white/6 bg-[#0d0d0d] px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]">
                <span className="text-[#8fff8b]">{meta.eyebrow}</span>
                <span className="text-white/22">/</span>
                <span className="text-white/35">{meta.label}</span>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-[280px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <Input
                    className="border-white/8 bg-[#171717] pl-11 text-white placeholder:text-white/28 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                    placeholder="query_stadoor..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <TopIcon icon={<Bell className="h-4 w-4" />} />
                  <TopIcon icon={<LifeBuoy className="h-4 w-4" />} />
                  <Button asChild variant="secondary" className="border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5">
                    <Link href="/">Landing</Link>
                  </Button>
                  <Button asChild variant="brand" className="border border-[#00ff41]/30 bg-[#00ff41] text-black hover:bg-[#7cff98]">
                    <Link href={meta.ctaHref}>{meta.ctaLabel}</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div>
                <h1 className="text-4xl font-semibold uppercase tracking-[-0.05em] text-white lg:text-5xl">
                  {meta.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/54">
                  {meta.description}
                </p>
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
      className={`flex items-center gap-4 rounded-[0.95rem] px-4 py-3 text-sm font-medium ${
        active ? "bg-[#00ff41] text-black" : "text-white/68 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function TopIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-white/8 bg-[#171717] text-white/65">
      {icon}
    </div>
  );
}

function MiniSignal({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[0.9rem] border border-white/6 bg-black/20 px-3 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-[#00ff41]" />
      <span className="text-sm text-white/68">{label}</span>
    </div>
  );
}
