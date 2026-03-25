import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Fingerprint,
  LockKeyhole,
  Network,
  Plus,
  Route,
  Server,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { StadoorLogo } from "@/components/stadoor-logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,255,65,0.08),transparent_28%),linear-gradient(180deg,#0a0a0a_0%,#0d100d_18%,#0a0a0a_100%)]">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between border border-white/6 bg-black/30 px-5 py-4 backdrop-blur-sm">
            <StadoorLogo subtitleClassName="text-white/45" wordmarkClassName="text-xl text-white" />

            <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 md:flex">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About us
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
                className="border border-[#00ff41]/30 bg-[#00ff41] text-black shadow-[0_0_28px_rgba(0,255,65,0.18)] hover:bg-[#68ff8d]"
              >
                <Link href="/dashboard">Deploy Signal</Link>
              </Button>
            </div>
          </header>

          <section className="grid flex-1 gap-8 px-2 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-8">
            <div className="space-y-5">
              <Badge className="w-fit rounded-full border border-[#00ff41]/18 bg-[#101510] px-4 py-2 text-[10px] tracking-[0.22em] text-[#b6ffc8]">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Academic Prototype
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.5rem]">
                  Mini Stadoor
                  <span className="mt-2 block text-[#00ff41]">with simpler control.</span>
                </h1>
                <p className="max-w-lg text-base leading-7 text-white/62">
                  Register an API or frontend, publish dynamic routes, and attach security without
                  hardcoding gateway configuration.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="border border-[#00ff41]/30 bg-[#00ff41] px-7 text-black shadow-[0_0_32px_rgba(0,255,65,0.16)] hover:bg-[#7cff98]"
                >
                  <Link href="/login">
                    Start in portal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5"
                >
                  <Link href="/dashboard">View control plane</Link>
                </Button>
              </div>

              <div className="flex max-w-xl flex-wrap gap-x-8 gap-y-3 pt-1">
                <Metric value="SaaS" label="category" compact />
                <Metric value="3" label="live security modes" compact />
                <Metric value="Next.js" label="microfrontend portal" compact />
              </div>
            </div>

            <HeroControlSurface />
          </section>
        </div>
      </div>

      <section id="platform" className="border-t border-white/6 bg-[#111111]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#7dff9c]">
              Product Scope
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold uppercase leading-none tracking-[-0.04em] text-white sm:text-5xl">
              Built for
              <span className="block text-[#00ff41]">developer security.</span>
            </h2>
          </div>
          <Button
            asChild
            variant="secondary"
            className="self-start border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5"
          >
            <Link href="/dashboard">View platform dashboard</Link>
          </Button>
        </div>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-3 lg:px-8">
          <FeatureCard
            icon={<LockKeyhole className="h-4 w-4" />}
            title="Identity and access management"
            body="Stadoor is designed to grow toward IAM and OAuth2 with OIDC while route-level security is already available in the prototype."
          />
          <FeatureCard
            id="gateway"
            icon={<Waypoints className="h-4 w-4" />}
            title="API gateway with dynamic routes"
            body="Routes are created dynamically from the platform workflow instead of being hardcoded inside gateway configuration."
          />
          <FeatureCard
            id="security"
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Security controls and compliance"
            body="Basic Authentication, API Keys, JWT, OAuth2 with OIDC, and goals like GDPR all belong to the Stadoor product direction."
          />
        </div>
      </section>

      <section id="access" className="bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <ArchitecturePanel />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#7dff9c]">
              Technology Direction
            </p>
            <h2 className="mt-4 text-4xl font-semibold uppercase leading-none tracking-[-0.04em] text-white sm:text-5xl">
              Powered by a
              <span className="block text-[#00ff41]">modern stack.</span>
            </h2>

            <div className="mt-10 space-y-8">
              <NumberedItem
                number="01"
                title="Developer application registration"
                body="Developers register an API or a frontend and let the platform handle the surrounding security and management concerns."
              />
              <NumberedItem
                number="02"
                title="Reactive Spring microservices"
                body="The current backend is built with Java, Gradle, and reactive Spring microservices for gateway and service management."
              />
              <NumberedItem
                number="03"
                title="Expandable platform vision"
                body="IAM, Backend for Frontend as a Service, traffic management, network management, notifications, and compliance can grow on top of the same control plane."
              />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                variant="brand"
                size="lg"
                className="border border-[#00ff41]/30 bg-[#00ff41] text-black hover:bg-[#7cff98]"
              >
                <Link href="/dashboard">Start with Mini Stadoor</Link>
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

      <section className="border-t border-white/6 bg-[#090909]">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-4">
            <MetricInline value="100%" label="backend" />
            <MetricInline value="90%" label="database" />
            <MetricInline value="70%" label="frontend" />
            <MetricInline value="50%" label="deployment" />
          </div>

          <h2 className="mx-auto mt-16 max-w-5xl text-4xl font-semibold uppercase leading-none tracking-[-0.04em] text-white sm:text-6xl">
            Start your
            <span className="text-[#00ff41]"> signal </span>
            today.
          </h2>

          <div className="mt-10">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="border border-[#00ff41]/30 bg-[#00ff41] px-8 text-black shadow-[0_0_40px_rgba(0,255,65,0.15)] hover:bg-[#7cff98]"
            >
              <Link href="/dashboard">Deploy to Mini Stadoor</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function HeroControlSurface() {
  return (
    <Card className="overflow-hidden border border-white/8 bg-[linear-gradient(180deg,#111111_0%,#0d0d0d_100%)] text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <CardContent className="p-5 sm:p-5">
        <div className="rounded-[1.35rem] border border-[#00ff41]/12 bg-[radial-gradient(circle_at_top_right,rgba(0,255,65,0.12),transparent_35%),linear-gradient(180deg,#141414_0%,#111111_100%)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fff8b]">
                stadoor_platform_flow
              </p>
              <h3 className="mt-3 text-lg font-semibold uppercase tracking-[-0.04em] text-white sm:text-[1.6rem]">
                Register. Protect. Route.
              </h3>
            </div>
            <div className="rounded-full border border-[#00ff41]/18 bg-[#101810] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aff9d]">
              live prototype
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <CompactFlowCard
              icon={<Server className="h-4 w-4" />}
              title="Workload"
              value="API or frontend"
              accent="green"
            />
            <CompactFlowCard
              icon={<Waypoints className="h-4 w-4" />}
              title="Gateway"
              value="Dynamic route publish"
              accent="green"
            />
            <CompactFlowCard
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Security"
              value="NONE / BASIC / API_KEY"
              accent="cyan"
            />
          </div>

          <div className="mt-3 rounded-[1.1rem] border border-white/8 bg-[#121212] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 font-mono text-xs text-[#8fff8b]">
                /basic/products/**
              </span>
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 font-mono text-xs text-white/72">
                lb://product-service
              </span>
              <span className="rounded-full border border-[#00ff41]/14 bg-[#111811] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8fff8b]">
                BASIC policy
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip icon={<BadgeCheck className="h-3.5 w-3.5" />} label="Dynamic registration" />
              <Chip icon={<Network className="h-3.5 w-3.5" />} label="Gateway sync" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArchitecturePanel() {
  return (
    <Card className="border border-white/8 bg-[#111111] text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <CardContent className="p-6">
        <div className="rounded-[1.5rem] border border-white/6 bg-[linear-gradient(180deg,#151515_0%,#101010_100%)] p-6">
          <div className="grid gap-4">
            <PanelRow title="Developer Portal" value="Next.js microfrontend control surface" tone="bg-[#00ff41]" />
            <PanelRow title="Gateway Management" value="service registration + route control" tone="bg-[#7cff98]" />
            <PanelRow title="Standard Gateway" value="runtime entry point for end users" tone="bg-[#9ef0ff]" />
            <PanelRow title="Consumer Service" value="Basic / API key validation" tone="bg-[#00ff41]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({
  id,
  icon,
  title,
  body,
}: {
  id?: string;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card id={id} className="border border-white/8 bg-[#171717] text-white shadow-none scroll-mt-28">
      <CardContent className="p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#142114] text-[#7dff9c]">
          {icon}
        </div>
        <h3 className="mt-6 text-lg font-semibold uppercase tracking-tight text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/62">{body}</p>
      </CardContent>
    </Card>
  );
}

function NumberedItem({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
      <p className="text-lg font-semibold text-[#00ff41]">{number}.</p>
      <div>
        <h3 className="text-lg font-semibold uppercase text-white">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/62">{body}</p>
      </div>
    </div>
  );
}

function PanelRow({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4 rounded-xl border border-white/6 bg-black/20 px-4 py-4">
      <div className={`h-2 rounded-full ${tone}`} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">{title}</p>
        <p className="mt-1 text-sm text-white/78">{value}</p>
      </div>
    </div>
  );
}

function Metric({ value, label, compact }: { value: string; label: string; compact?: boolean }) {
  return (
    <div>
      <p className={compact ? "text-2xl font-semibold text-white" : "text-3xl font-semibold text-white"}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{label}</p>
    </div>
  );
}

function MetricInline({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/35">{label}</p>
    </div>
  );
}

function Chip({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/6 bg-[#131313] px-3 py-2 text-xs text-white/75">
      <span className="text-[#7dff9c]">{icon}</span>
      {label}
    </div>
  );
}

function CompactFlowCard({
  icon,
  title,
  value,
  accent,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  accent: "green" | "cyan";
}) {
  const accentClass = accent === "green" ? "text-[#8fff8b] bg-[#162316]" : "text-[#9ef0ff] bg-[#122126]";

  return (
    <div className="rounded-[1rem] border border-white/8 bg-black/22 p-3.5">
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${accentClass}`}>{icon}</div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">{title}</p>
          <p className="mt-1.5 text-sm leading-6 text-white/82">{value}</p>
        </div>
      </div>
    </div>
  );
}
