import Link from "next/link";
import {
  ArrowRight,
  Fingerprint,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { StadoorLogo } from "@/components/stadoor-logo";

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
    <main className="min-h-screen bg-[#090909] text-white">
      <section className="relative overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_18%_18%,rgba(0,255,65,0.18),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(0,163,255,0.12),transparent_20%),linear-gradient(180deg,#090909_0%,#0d120d_56%,#090909_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-4 py-3 sm:px-6 lg:px-8">
          <header className="hero-header flex items-center justify-between border border-white/8 bg-black/20 px-4 py-2.5 backdrop-blur-sm">
            <StadoorLogo subtitleClassName="text-white/38" wordmarkClassName="text-xl text-white" />

            <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 md:flex">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-white/75 hover:bg-white/5 hover:text-white">
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                variant="brand"
                size="sm"
                className="border border-[#00ff41]/30 bg-[#00ff41] text-black shadow-[0_0_32px_rgba(0,255,65,0.18)] hover:bg-[#7cff98]"
              >
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            </div>
          </header>

          <div className="hero-grid grid flex-1 gap-4 py-4 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-4">
            <div className="flex max-w-[30rem] flex-col justify-center">
              <div className="animate-rise space-y-3.5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#00ff41]/20 bg-[#111811] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b6ffc8]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Mini Stadoor Demo
                </div>

                <div className="space-y-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">
                    Developer Security Control Plane
                  </p>
                  <h1 className="text-[3.2rem] font-semibold uppercase leading-[0.82] tracking-[-0.075em] text-white sm:text-[4rem] lg:text-[4.35rem]">
                    Register.
                    <span className="block text-[#00ff41]">Protect.</span>
                    <span className="block">Route.</span>
                  </h1>
                  <p className="max-w-[25rem] text-sm leading-6 text-white/58 sm:text-[15px]">
                    Register services under one gateway and attach route security at runtime without hardcoded config.
                  </p>
                </div>

                <div className="hero-actions flex flex-wrap gap-3 pt-1">
                  <Button
                    asChild
                    variant="brand"
                    size="lg"
                    className="border border-[#00ff41]/30 bg-[#00ff41] px-7 text-black shadow-[0_0_36px_rgba(0,255,65,0.16)] hover:bg-[#7cff98]"
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
                    className="border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5"
                  >
                    <Link href="/about">View project context</Link>
                  </Button>
                </div>
              </div>
            </div>

            <SignalField />
          </div>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                Current Workflow
              </p>
              <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.05em] text-white sm:text-5xl">
                One path.
                <span className="block text-[#00ff41]">No clutter.</span>
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

      <section className="border-b border-white/8 bg-[#090909]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                Live Surface
              </p>
              <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.05em] text-white sm:text-5xl">
                Built to prove
                <span className="block text-[#00ff41]">dynamic protection.</span>
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

      <section className="bg-[#070707]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="border border-white/8 bg-[radial-gradient(circle_at_top,rgba(0,255,65,0.14),transparent_30%),linear-gradient(180deg,#111111_0%,#0b0b0b_100%)] px-6 py-10 text-center sm:px-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
              Final CTA
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold uppercase leading-none tracking-[-0.05em] text-white sm:text-6xl">
              Open the dashboard
              <span className="block text-[#00ff41]">and run the flow.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/56">
              Create a gateway, register a service, publish a route, and test protection through one control plane.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                variant="brand"
                size="lg"
                className="border border-[#00ff41]/30 bg-[#00ff41] px-8 text-black shadow-[0_0_38px_rgba(0,255,65,0.16)] hover:bg-[#7cff98]"
              >
                <Link href="/dashboard">Enter Mini Stadoor</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5"
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
    <div className="signal-field relative min-h-[320px] overflow-hidden border border-white/8 bg-[linear-gradient(180deg,#111111_0%,#0a0a0a_100%)] lg:min-h-[360px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,255,65,0.16),transparent_22%),radial-gradient(circle_at_30%_75%,rgba(0,163,255,0.12),transparent_22%)]" />
      <div className="signal-drift absolute left-[14%] top-[20%] h-20 w-20 rounded-full border border-[#00ff41]/12" />
      <div className="signal-drift absolute left-[63%] top-[18%] h-24 w-24 rounded-full border border-white/8" />
      <div className="signal-drift absolute left-[72%] top-[62%] h-16 w-16 rounded-full border border-[#9ef0ff]/14" />
      <div className="absolute inset-x-[8%] top-[46%] hidden h-px bg-[linear-gradient(90deg,rgba(0,255,65,0.08),rgba(0,255,65,0.45),rgba(158,240,255,0.28),rgba(0,255,65,0.08))] md:block" />

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="animate-rise">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fff8b]">
              gateway_signal_map
            </p>
            <h3 className="mt-2 text-xl font-semibold uppercase tracking-[-0.04em] text-white sm:text-2xl">
              Runtime flow
            </h3>
          </div>
          <div className="rounded-full border border-[#00ff41]/18 bg-[#101810] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aff9d]">
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

        <div className="grid gap-3 border-t border-white/8 pt-4 sm:grid-cols-2">
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
  const accentClass = accent === "green" ? "text-[#8fff8b]" : "text-[#9ef0ff]";

  return (
    <div className="animate-rise flex min-h-[112px] flex-col justify-end border-l border-white/8 pl-4 transition duration-300 hover:border-[#00ff41]/24">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">{eyebrow}</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-base font-semibold uppercase tracking-[-0.03em] text-white">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/35 text-xs font-semibold ${accentClass}`}>
          <Route className="h-4 w-4" />
        </div>
      </div>
      <p className={`mt-3 font-mono text-[13px] leading-6 ${accentClass}`}>{body}</p>
    </div>
  );
}

function SignalConnector() {
  return (
    <div className="flex items-center justify-center px-1 text-[#00ff41]/72 md:px-0">
      <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
    </div>
  );
}

function SignalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/32">{label}</p>
      <p className="mt-1.5 text-sm leading-6 text-white/72">{value}</p>
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
    <div className="group grid gap-4 border-t border-white/8 py-5 first:border-t-0 first:pt-0 lg:grid-cols-[72px_1fr]">
      <p className="text-xl font-semibold text-[#00ff41] transition group-hover:translate-x-1">{number}</p>
      <div>
        <h3 className="text-lg font-semibold uppercase tracking-[-0.03em] text-white">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/54">{body}</p>
      </div>
    </div>
  );
}

function LineItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="group border-t border-white/8 py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold uppercase tracking-[-0.03em] text-white">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/54">{detail}</p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 text-white/24 transition group-hover:translate-x-1 group-hover:text-[#8fff8b]" />
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
    <div className="group border-t border-white/8 pt-5 transition hover:border-[#00ff41]/24">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00ff41]/16 bg-[#111811] text-[#8fff8b]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold uppercase tracking-[-0.03em] text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/54">{detail}</p>
    </div>
  );
}
