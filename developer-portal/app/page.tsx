import Link from "next/link";
import { ArrowRight, Fingerprint, Network, Route, ShieldCheck, Sparkles } from "lucide-react";

import { LandingMascot } from "@/components/landing-mascot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const liveModules = [
  {
    title: "Gateway Workspaces",
    detail: "Create one gateway, group services under it, and manage route ownership clearly.",
  },
  {
    title: "Dynamic Routes",
    detail: "Publish runtime routes without hardcoding every path into the gateway config.",
  },
  {
    title: "Route Security",
    detail: "Protect each route with NONE, BASIC, API_KEY, or JWT according to the demo flow.",
  },
] as const;

const platformRoadmap = [
  {
    title: "API Gateway",
    detail: "Gateway workspace, service registration, route publishing, and runtime sync.",
    icon: <Network className="h-4 w-4" />,
  },
  {
    title: "IAM",
    detail: "OAuth2, OIDC, access control, and token lifecycle for the full Stadoor platform.",
    icon: <Fingerprint className="h-4 w-4" />,
  },
  {
    title: "Security Layer",
    detail: "JWT, API keys, compliance, and platform trust controls attached to application flows.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <LandingMascot />

      <section
        data-guide-section="hero"
        data-guide-title="Start with one gateway"
        data-guide-detail="Group services under one workspace before you publish any route."
        data-mascot-x="14vw"
        data-mascot-y="74vh"
        data-mascot-align="left"
        className="guide-section relative min-h-screen overflow-hidden border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_24%),radial-gradient(circle_at_82%_22%,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_20%),linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_86%,var(--background))_56%,var(--background)_100%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <SiteHeader active="home" ctaLabel="Open Dashboard" ctaHref="/dashboard" />

          <section className="hero-grid grid flex-1 gap-8 px-2 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="flex max-w-[32rem] flex-col">
              <div className="animate-rise space-y-3.5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Mini Stadoor Demo
                </div>

                <div className="space-y-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]">
                    Developer Security Control Plane
                  </p>
                  <h1 className="max-w-4xl text-4xl font-semibold uppercase leading-[0.84] tracking-[-0.06em] text-[var(--text-strong)] sm:text-5xl lg:text-6xl">
                    Register.
                    <span className="block text-[var(--accent)]">Protect.</span>
                    <span className="block text-[var(--text-strong)]">Route.</span>
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
                    Register services under one gateway and attach route security at runtime without hardcoded config.
                  </p>
                </div>

                <div className="hero-actions flex flex-wrap gap-4 pt-1">
                  <Button
                    asChild
                    variant="brand"
                    size="lg"
                    className="border border-[var(--border-strong)] bg-[var(--accent)] px-7 text-[var(--accent-contrast)] shadow-[0_0_36px_var(--glow)] hover:bg-[var(--accent-bright)]"
                  >
                    <Link href="/dashboard">
                      Launch control plane
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-transparent text-[var(--text-strong)] hover:border-[color:color-mix(in_srgb,var(--border-soft)_100%,transparent)] hover:bg-[var(--surface-soft)]"
                  >
                    <Link href="/about">View project context</Link>
                  </Button>
                </div>
              </div>
            </div>

            <SignalField />
          </section>
        </div>
      </section>

      <section
        data-guide-section="workflow"
        data-guide-title="Follow the sequence"
        data-guide-detail="Create gateway, then register service, then publish the route."
        data-mascot-x="77vw"
        data-mascot-y="32vh"
        data-mascot-align="right"
        className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_86%,var(--background))]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                Current Workflow
              </p>
              <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.05em] text-[var(--text-strong)] sm:text-5xl">
                One path.
                <span className="block text-[var(--accent)]">No clutter.</span>
              </h2>
            </div>

            <div className="space-y-4">
              <WorkflowRow number="01" title="Create gateway" body="Start with a workspace like e-commerce, partner APIs, or internal tools." />
              <WorkflowRow number="02" title="Register service" body="Attach services under the gateway so ownership is grouped before routing." />
              <WorkflowRow number="03" title="Create route" body="Expose the path and choose auth type: NONE, BASIC, API_KEY, or JWT." />
              <WorkflowRow number="04" title="Test route" body="Send credentials, API key, or bearer token through the standard gateway." />
            </div>
          </div>
        </div>
      </section>

      <section
        data-guide-section="surface"
        data-guide-title="Protect by route"
        data-guide-detail="Each route can choose NONE, BASIC, API_KEY, JWT, or OAUTH2."
        data-mascot-x="16vw"
        data-mascot-y="64vh"
        data-mascot-align="left"
        className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--background)]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                Live Surface
              </p>
              <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.05em] text-[var(--text-strong)] sm:text-5xl">
                Built to prove
                <span className="block text-[var(--accent)]">dynamic protection.</span>
              </h2>
            </div>

            <div className="space-y-4">
              {liveModules.map((module) => (
                <LineItem key={module.title} title={module.title} detail={module.detail} />
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            {platformRoadmap.map((item) => (
              <RoadmapStrip key={item.title} title={item.title} detail={item.detail} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section
        data-guide-section="cta"
        data-guide-title="Open the workspace"
        data-guide-detail="Use the dashboard to run the full demo flow after the landing page."
        data-mascot-x="80vw"
        data-mascot-y="68vh"
        data-mascot-align="right"
        className="guide-section relative bg-[color:color-mix(in_srgb,var(--background)_92%,var(--surface))]"
      >
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_30%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,var(--background))_0%,var(--background)_100%)] px-6 py-10 text-center sm:px-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
              Final CTA
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold uppercase leading-none tracking-[-0.05em] text-[var(--text-strong)] sm:text-6xl">
              Open the dashboard
              <span className="block text-[var(--accent)]">and run the flow.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
              Create a gateway, register a service, publish a route, and test protection through one control plane.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                variant="brand"
                size="lg"
                className="border border-[var(--border-strong)] bg-[var(--accent)] px-8 text-[var(--accent-contrast)] shadow-[0_0_38px_var(--glow)] hover:bg-[var(--accent-bright)]"
              >
                <Link href="/dashboard">Enter Mini Stadoor</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-transparent text-[var(--text-strong)] hover:border-[color:color-mix(in_srgb,var(--border-soft)_100%,transparent)] hover:bg-[var(--surface-soft)]"
              >
                <Link href="/login">Preview access flow</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function SignalField() {
  return (
    <div className="signal-field relative min-h-[320px] overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(180deg,var(--surface)_0%,color-mix(in_srgb,var(--surface-muted)_88%,var(--background))_100%)] lg:min-h-[360px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_22%),radial-gradient(circle_at_30%_75%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_22%)]" />
      <div className="signal-drift absolute left-[14%] top-[20%] h-20 w-20 rounded-full border border-[var(--border-strong)]" />
      <div className="signal-drift absolute left-[63%] top-[18%] h-24 w-24 rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)]" />
      <div className="signal-drift absolute left-[72%] top-[62%] h-16 w-16 rounded-full border border-[var(--border-soft)]" />
      <div className="absolute inset-x-[8%] top-[46%] hidden h-px bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_8%,transparent),color-mix(in_srgb,var(--accent)_45%,transparent),color-mix(in_srgb,var(--accent-soft)_28%,transparent),color-mix(in_srgb,var(--accent)_8%,transparent))] md:block" />

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="animate-rise">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-soft)]">
              gateway_signal_map
            </p>
            <h3 className="mt-2 text-xl font-semibold uppercase tracking-[-0.04em] text-[var(--text-strong)] sm:text-2xl">
              Runtime flow
            </h3>
          </div>
          <div className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
            live demo
          </div>
        </div>

        <div className="grid gap-3 pt-4 md:grid-cols-[minmax(0,1.18fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
          <FlowStage eyebrow="workspace" title="Gateway" body="E-Commerce Gateway" accent="green" />
          <SignalConnector />
          <FlowStage eyebrow="registered_service" title="Service" body="product-service" accent="cyan" />
          <SignalConnector />
          <FlowStage eyebrow="published_route" title="Route" body="/jwt/products/**" accent="green" />
        </div>

        <div className="grid gap-3 border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pt-4 sm:grid-cols-2">
          <SignalStat label="Auth types" value="NONE / BASIC / API_KEY / JWT" />
          <SignalStat label="Gateway action" value="Validate, then forward" />
        </div>
      </div>
    </div>
  );
}

function FlowStage({
  eyebrow,
  title,
  body,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent: "green" | "cyan";
}) {
  const accentClass =
    accent === "green"
      ? "text-[var(--accent)]"
      : "text-[color:color-mix(in_srgb,var(--accent)_72%,var(--text-strong))]";

  return (
    <div className="animate-rise flex min-h-[112px] flex-col justify-end border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-4 transition duration-300 hover:border-[color:color-mix(in_srgb,var(--accent)_24%,transparent)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">{eyebrow}</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-base font-semibold uppercase tracking-[-0.03em] text-[var(--text-strong)]">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_68%,transparent)] text-xs font-semibold ${accentClass}`}>
          <Route className="h-4 w-4" />
        </div>
      </div>
      <p className={`mt-3 font-mono text-[13px] leading-6 ${accentClass}`}>{body}</p>
    </div>
  );
}

function SignalConnector() {
  return (
    <div className="flex items-center justify-center px-1 text-[color:color-mix(in_srgb,var(--accent)_72%,transparent)] md:px-0">
      <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
    </div>
  );
}

function SignalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">{label}</p>
      <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">{value}</p>
    </div>
  );
}

function WorkflowRow({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group grid gap-4 border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] py-5 first:border-t-0 first:pt-0 lg:grid-cols-[72px_1fr]">
      <p className="text-xl font-semibold text-[var(--accent)] transition group-hover:translate-x-1">{number}</p>
      <div>
        <h3 className="text-lg font-semibold uppercase tracking-[-0.03em] text-[var(--text-strong)]">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">{body}</p>
      </div>
    </div>
  );
}

function LineItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="group border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold uppercase tracking-[-0.03em] text-[var(--text-strong)]">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">{detail}</p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 text-[var(--text-faint)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
      </div>
    </div>
  );
}

function RoadmapStrip({
  title,
  detail,
  icon,
}: {
  title: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pt-5 transition hover:border-[color:color-mix(in_srgb,var(--accent)_24%,transparent)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[var(--surface-soft)] text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold uppercase tracking-[-0.03em] text-[var(--text-strong)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}
