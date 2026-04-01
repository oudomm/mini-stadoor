import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Braces,
  CheckCircle2,
  Cpu,
  Database,
  Fingerprint,
  Globe,
  KeyRound,
  LockKeyhole,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users2,
  Waypoints,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const controlPlaneSignals = [
  {
    label: "Identity Core",
    value: "OAuth2/OIDC tenant sessions",
  },
  {
    label: "Gateway Runtime",
    value: "Runtime route + service publish",
  },
  {
    label: "Route Policy",
    value: "Policy modes: BASIC, JWT, API_KEY, OIDC",
  },
] as const;

const stadoorPrinciples = [
  {
    title: "Identity-first onboarding",
    detail: "Developers enter through IAM and immediately land inside their tenant workspace boundary.",
    icon: LockKeyhole,
  },
  {
    title: "Runtime publication",
    detail: "Services and routes are registered without static gateway file edits on each deployment.",
    icon: Rocket,
  },
  {
    title: "Policy by endpoint",
    detail: "Each path can choose its own protection contract and move independently from others.",
    icon: ShieldCheck,
  },
  {
    title: "One developer control plane",
    detail: "API and frontend traffic can share one security and routing surface in the same platform.",
    icon: Waypoints,
  },
] as const;

const flowNodes = [
  {
    label: "Tenant IAM",
    subtitle: "workspace identity",
    detail: "developer://tenant",
    icon: Fingerprint,
  },
  {
    label: "Gateway",
    subtitle: "ownership boundary",
    detail: "gateway://provisioned",
    icon: Network,
  },
  {
    label: "Service",
    subtitle: "runtime registration",
    detail: "service://attached",
    icon: Database,
  },
  {
    label: "Route Policy",
    subtitle: "auth selection",
    detail: "route://jwt or key",
    icon: ShieldCheck,
  },
  {
    label: "Live Traffic",
    subtitle: "validate then forward",
    detail: "edge://enforced",
    icon: Activity,
  },
] as const;

const builderLanes = [
  {
    role: "Software Engineers",
    mission: "Ship APIs and frontend integrations without handcrafting gateway internals each sprint.",
    value: "Dynamic route publishing and tenant-scoped ownership from one workspace.",
    icon: Braces,
  },
  {
    role: "Security Researchers",
    mission: "Inspect behavior across multiple auth contracts inside one consistent runtime surface.",
    value: "Replay BASIC, JWT, API_KEY, and OIDC scenarios through a single gateway model.",
    icon: ShieldCheck,
  },
  {
    role: "Students and Learners",
    mission: "Understand IAM, routing, and policy flows through a practical microservice project.",
    value: "Concepts map directly to service registration and route enforcement behavior.",
    icon: Users2,
  },
] as const;

const authModes = [
  {
    name: "BASIC",
    route: "/basic/**",
    headline: "Credential-gated endpoints",
    detail: "Fast onboarding for partner or internal applications where username and password are sufficient.",
    icon: KeyRound,
    strength: 64,
  },
  {
    name: "JWT",
    route: "/jwt/**",
    headline: "Claim-aware access",
    detail: "Token-based flows for modern frontend and mobile clients that need scalable authorization.",
    icon: ShieldCheck,
    strength: 88,
  },
  {
    name: "API_KEY",
    route: "/key/**",
    headline: "Machine channel trust",
    detail: "Simple machine-to-machine verification by header or query parameter with route-level policy.",
    icon: Cpu,
    strength: 72,
  },
  {
    name: "OAUTH2 + OIDC",
    route: "/oidc/**",
    headline: "Identity platform integration",
    detail: "Enterprise identity interoperability inspired by Keycloak and Auth0 provider patterns.",
    icon: Globe,
    strength: 93,
  },
] as const;

const featurePortfolio = [
  {
    title: "Identity and Access Management",
    detail: "Tenant-aware identity core inspired by Keycloak and OAuth0 for secure platform entry.",
    status: "Available now",
    icon: Fingerprint,
    capabilities: ["OAuth2", "OIDC", "Tenant workspace", "Token lifecycle"],
  },
  {
    title: "API Gateway with Dynamic Routes",
    detail: "Runtime route and service publication so teams can evolve endpoints without static gateway edits.",
    status: "Available now",
    icon: Network,
    capabilities: ["Gateway management", "Service registration", "Dynamic publish", "Policy binding"],
  },
  {
    title: "Backend for Frontend as a Service",
    detail: "BFF workflow surface so frontend teams can compose secure application-specific API layers.",
    status: "In rollout",
    icon: Braces,
    capabilities: ["Frontend API facade", "Gateway routing", "Tenant scoping", "Shared auth"],
  },
  {
    title: "Security Compliance Layer",
    detail: "Security controls and compliance strategy including GDPR-style governance for enterprise use.",
    status: "In rollout",
    icon: ShieldCheck,
    capabilities: ["Basic auth", "JWT", "API Keys", "Compliance policy"],
  },
  {
    title: "Traffic Management",
    detail: "Traffic shaping and runtime observability for predictable service behavior under load.",
    status: "Planned release",
    icon: Activity,
    capabilities: ["Rate strategy", "Traffic balancing", "Runtime insight", "Gateway telemetry"],
  },
  {
    title: "Network Management",
    detail: "Edge hardening vision including DDoS defense and web application firewall controls.",
    status: "Planned release",
    icon: Cpu,
    capabilities: ["DDoS mitigation", "WAF policy", "Threat controls", "Edge protection"],
  },
  {
    title: "Notification",
    detail: "Platform alerting so teams know when policy, traffic, or route behavior needs attention.",
    status: "Planned release",
    icon: Sparkles,
    capabilities: ["Policy alerts", "Gateway events", "Service signals", "Team awareness"],
  },
] as const;

const commandRail = [
  {
    step: "01",
    title: "Provision gateway",
    command: "POST /api/gateways",
    output: "gateway_id created for tenant workspace",
  },
  {
    step: "02",
    title: "Attach service",
    command: "POST /api/services/register",
    output: "service linked under gateway ownership",
  },
  {
    step: "03",
    title: "Publish route policy",
    command: "POST /api/routes { securityType: JWT }",
    output: "policy replicated to standard gateway runtime",
  },
  {
    step: "04",
    title: "Validate request",
    command: "GET /jwt/products/** with Bearer token",
    output: "traffic accepted and forwarded to target service",
  },
] as const;

const runtimeLogLines = [
  "[iam] tenant token verified",
  "[gateway] route synced to edge runtime",
  "[policy] JWT strategy attached",
  "[edge] request accepted",
  "[proxy] forwarding to product-service",
] as const;

const protocolTicker = [
  "OAuth2",
  "OIDC",
  "BASIC",
  "JWT",
  "API_KEY",
  "Dynamic Routes",
  "Tenant Isolation",
  "Reactive Services",
  "Gateway Runtime",
] as const;

const duplicatedTicker = [...protocolTicker, ...protocolTicker] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <section className="guide-section home-hero relative min-h-screen overflow-hidden border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[radial-gradient(circle_at_22%_16%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_36%),radial-gradient(circle_at_80%_24%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_28%),linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_88%,var(--background))_56%,var(--background)_100%)]">
        <div className="poster-grid absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--accent)_5%,transparent),transparent_45%)]" />
        <div className="scan-line absolute inset-x-0 top-[24%] h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--accent)_30%,transparent),transparent)]" />
        <div className="scan-line absolute inset-x-0 top-[68%] h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--accent)_28%,transparent),transparent)] [animation-delay:1.7s]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="orbit-float absolute left-[8%] top-[15%] h-20 w-20 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_18%,transparent)]" />
          <div className="orbit-float absolute right-[12%] top-[28%] h-14 w-14 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_24%,transparent)] [animation-delay:0.7s]" />
          <div className="orbit-float absolute bottom-[16%] left-[48%] h-16 w-16 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] [animation-delay:1.2s]" />
        </div>

        <div className="absolute inset-x-0 top-0 z-30 px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SiteHeader active="home" ctaLabel="Open Dashboard" ctaHref="/dashboard" />
          </div>
        </div>

        <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 pb-12 pt-28 sm:gap-10 sm:px-6 sm:pb-14 sm:pt-32 md:pt-36 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8 lg:pb-16 xl:pt-32">
          <div className="max-w-xl">
            <div className="animate-rise space-y-5 sm:space-y-6">
              <p className="inline-flex w-fit items-center gap-2 border border-[var(--border-strong)] bg-[color:color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:tracking-[0.26em]">
                <Sparkles className="h-3.5 w-3.5" />
                Stadoor
              </p>

              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)] sm:text-[11px] sm:tracking-[0.28em]">
                  Developer Security Infrastructure
                </p>
                <h1 className="text-[2.65rem] font-semibold leading-[0.9] tracking-[-0.038em] text-[var(--text-strong)] sm:text-6xl sm:leading-[0.86] sm:tracking-[-0.045em] lg:text-7xl">
                  Stadoor
                  <span className="block text-[var(--accent)]">Identity + Gateway Control Plane.</span>
                </h1>
                <p className="max-w-xl text-[15px] leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
                  Register apps once, publish secure routes at runtime, and keep identity plus policy in one place.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="w-full justify-between border border-[var(--border-strong)] bg-[var(--accent)] px-7 text-[var(--accent-contrast)] shadow-[0_0_36px_var(--glow)] hover:bg-[var(--accent-bright)] sm:w-auto sm:justify-center"
                >
                  <Link href="/dashboard">
                    <span className="sm:hidden">Open Dashboard</span>
                    <span className="hidden sm:inline">Launch Stadoor</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="w-full border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-transparent text-[var(--text-strong)] hover:border-[color:color-mix(in_srgb,var(--border-soft)_100%,transparent)] hover:bg-[var(--surface-soft)] sm:w-auto"
                >
                  <Link href="/about">
                    <span className="sm:hidden">Architecture</span>
                    <span className="hidden sm:inline">Explore architecture</span>
                  </Link>
                </Button>
              </div>

              <div className="hidden gap-4 border-t border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] pt-5 sm:grid sm:grid-cols-3">
                {controlPlaneSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.2em]">{signal.label}</p>
                    <p className="mt-1.5 text-[13px] leading-6 text-[var(--text-muted)] sm:text-sm">{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <HeroConstellation />

          <div className="hidden sm:block lg:col-span-2">
            <div className="marquee-wrap mt-2 border-y border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] py-3">
              <div className="marquee-track">
                {duplicatedTicker.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="mx-2 inline-flex items-center gap-2 border border-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_84%,transparent)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:tracking-[0.2em]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,var(--background))_0%,var(--background)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px] sm:tracking-[0.24em]">Stadoor Thesis</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.035em]">
                Security choreography, not scattered scripts.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-sm">
                Stadoor gives teams one expressive surface where identity, routing, and protection move together.
              </p>
              <div className="mt-8 space-y-4">
                {stadoorPrinciples.map((item) => (
                  <PrincipleChip key={item.title} title={item.title} Icon={item.icon} />
                ))}
              </div>
            </div>

            <PolicySphere />
          </div>
        </div>
      </section>

      <section className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,var(--background))]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col gap-5 border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px] sm:tracking-[0.24em]">Runtime Flow Stage</p>
            <h2 className="max-w-5xl text-3xl font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.035em]">
              From tenant login
              <span className="block text-[var(--accent)]">to policy-enforced traffic.</span>
            </h2>
          </div>

          <div className="mt-8 space-y-8">
            <FlowPipeline />
            <div className="grid gap-4 md:grid-cols-5">
              {flowNodes.map((node) => (
                <FlowLabel key={node.label} label={node.label} subtitle={node.subtitle} detail={node.detail} Icon={node.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_82%,var(--background))]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col gap-5 border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pb-10">
            <p className="inline-flex w-fit items-center gap-2 border border-[var(--border-strong)] bg-[color:color-mix(in_srgb,var(--surface)_84%,transparent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)] sm:tracking-[0.22em]">
              <Users2 className="h-3.5 w-3.5" />
              Who Builds On Stadoor
            </p>
            <h2 className="max-w-5xl text-3xl font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.035em]">
              One platform.
              <span className="block text-[var(--accent)]">Three very different operating styles.</span>
            </h2>
          </div>
          <div className="mt-6 space-y-5">
            {builderLanes.map((lane, index) => (
              <BuilderLaneRow key={lane.role} role={lane.role} mission={lane.mission} value={lane.value} Icon={lane.icon} delay={index * 0.35} />
            ))}
          </div>
        </div>
      </section>

      <section className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px] sm:tracking-[0.24em]">Auth Theater</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.035em]">
                Multiple protection contracts.
                <span className="block text-[var(--accent)]">One route publishing surface.</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-sm">
                Pick security mode by endpoint and keep legacy plus modern identity paths together.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {authModes.map((mode) => (
                <AuthModeTile
                  key={mode.name}
                  name={mode.name}
                  headline={mode.headline}
                  detail={mode.detail}
                  route={mode.route}
                  strength={mode.strength}
                  Icon={mode.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,var(--background))_0%,var(--background)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px] sm:tracking-[0.24em]">Stadoor Product Suite</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.035em]">
                Platform core.
                <span className="block text-[var(--accent)]">Expansion modules.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-sm">
                A real product view of what Stadoor delivers now and what is shipping next across security, traffic, and network layers.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <StatusPill label="Available now" tone="active" />
                <StatusPill label="In rollout" tone="progress" />
                <StatusPill label="Planned release" tone="roadmap" />
              </div>
            </div>

            <FeaturePortfolioGrid />
          </div>
        </div>
      </section>

      <section className="guide-section relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_90%,var(--background))_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="inline-flex w-fit items-center gap-2 border border-[var(--border-strong)] bg-[color:color-mix(in_srgb,var(--surface)_84%,transparent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)] sm:tracking-[0.22em]">
                <TerminalSquare className="h-3.5 w-3.5" />
                Command Rail
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.035em]">
                Real sequence, not static mockups.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-sm">
                Provision gateway, attach service, publish secured route, and immediately inspect runtime logs.
              </p>
            </div>

            <RuntimeConsole />
          </div>
        </div>
      </section>

      <section className="guide-section relative overflow-hidden bg-[color:color-mix(in_srgb,var(--background)_92%,var(--surface))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px] sm:tracking-[0.24em]">Build With Confidence</p>
          <h2 className="mx-auto mt-5 max-w-5xl text-3xl font-semibold leading-[1.02] tracking-[-0.032em] text-[var(--text-strong)] sm:text-6xl sm:leading-[0.94] sm:tracking-[-0.04em]">
            Let developers ship product.
            <span className="block text-[var(--accent)]">Stadoor handles the security plane.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[var(--text-muted)] sm:mt-6 sm:text-lg sm:leading-8">
            Start from IAM, route everything through dynamic gateway policy, and keep one place for identity, access, and runtime
            route control.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full border border-[var(--border-strong)] bg-[var(--accent)] px-8 text-[var(--accent-contrast)] shadow-[0_0_36px_var(--glow)] hover:bg-[var(--accent-bright)] sm:w-auto"
            >
              <Link href="/dashboard">Enter dashboard</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-transparent text-[var(--text-strong)] hover:border-[color:color-mix(in_srgb,var(--border-soft)_100%,transparent)] hover:bg-[var(--surface-soft)] sm:w-auto"
            >
              <Link href="/login">
                Try login flow
                <KeyRound className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function HeroConstellation() {
  return (
    <div className="home-panel relative min-h-[380px] overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface)_90%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_84%,transparent)_100%)] lg:min-h-[520px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_12%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_30%),radial-gradient(circle_at_20%_80%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_34%)]" />
      <div className="absolute left-[10%] top-[22%] h-px w-[38%] rotate-[7deg] bg-[color:color-mix(in_srgb,var(--accent)_22%,transparent)]" />
      <div className="absolute left-[40%] top-[26%] h-px w-[34%] rotate-[-4deg] bg-[color:color-mix(in_srgb,var(--accent)_24%,transparent)]" />
      <div className="absolute left-[24%] top-[60%] h-px w-[44%] rotate-[5deg] bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)]" />
      <div className="absolute left-[58%] top-[58%] h-px w-[24%] rotate-[-11deg] bg-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]" />

      <ConstellationPoint className="left-[10%] top-[18%]" label="iam" title="OAuth2 Issuer" detail="tenant://workspace" />
      <ConstellationPoint className="left-[41%] top-[23%]" label="gateway" title="Runtime Orchestrator" detail="route://publish" />
      <ConstellationPoint className="left-[70%] top-[17%]" label="policy" title="Auth Selector" detail="basic | jwt | key | oidc" />
      <ConstellationPoint className="left-[24%] top-[56%]" label="service" title="Product Service" detail="/api/products/**" />
      <ConstellationPoint className="left-[58%] top-[54%]" label="edge" title="Standard Gateway" detail="validate -> forward" />

      <div className="absolute bottom-0 left-0 right-0 border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">stadoor_signal_plane</p>
        <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">Identity, route policy, and traffic decisions inside one visual control map.</p>
      </div>
    </div>
  );
}

function ConstellationPoint({
  className,
  label,
  title,
  detail,
}: {
  className: string;
  label: string;
  title: string;
  detail: string;
}) {
  return (
    <div className={`absolute w-[40%] min-w-[150px] max-w-[240px] ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">{label}</p>
      <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-[var(--text-strong)]">{title}</p>
      <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">{detail}</p>
      <div className="mt-2 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_20px_var(--glow)]" />
    </div>
  );
}

function PrincipleChip({
  title,
  Icon,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="home-panel inline-flex w-full items-center gap-3 border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-[var(--text-strong)] sm:text-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[var(--surface-soft)] text-[var(--accent)]">
        <Icon className="h-4 w-4" />
      </span>
      {title}
    </div>
  );
}

function PolicySphere() {
  const orbitModes = ["BASIC", "JWT", "API_KEY", "OIDC"] as const;
  const positions = [
    "left-[18%] top-[18%]",
    "right-[16%] top-[24%]",
    "left-[14%] bottom-[20%]",
    "right-[20%] bottom-[18%]",
  ] as const;

  return (
    <div className="home-panel relative min-h-[420px] overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_92%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_84%,transparent)_100%)] sm:min-h-[500px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_55%)]" />
      <div className="policy-ring absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_26%,transparent)] sm:h-[360px] sm:w-[360px]" />
      <div className="policy-ring-spin absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)] sm:h-[300px] sm:w-[300px]" />
      <div className="policy-pulse absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_62%)] sm:h-[220px] sm:w-[220px]" />

      <div className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 text-center sm:w-[220px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)] sm:tracking-[0.22em]">policy core</p>
        <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[var(--text-strong)] sm:text-2xl sm:tracking-[-0.025em]">Gateway Brain</p>
        <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">Identity claims in, route decision out.</p>
      </div>

      {orbitModes.map((mode, index) => (
        <div
          key={mode}
          className={`orbit-float absolute ${positions[index]} border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-strong)] sm:tracking-[0.2em]`}
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          {mode}
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] px-4 py-4 sm:px-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">stadoor://policy-orbit</p>
      </div>
    </div>
  );
}

function FlowPipeline() {
  return (
    <div className="home-panel relative overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface)_92%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_84%,transparent)_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_18%,transparent),color-mix(in_srgb,var(--accent)_44%,transparent),color-mix(in_srgb,var(--accent)_18%,transparent))]" />
      <div className="pipeline-packet absolute left-[8%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-[var(--accent)] bg-[var(--background)] shadow-[0_0_24px_var(--glow)]" />
      <div className="relative grid gap-4 sm:grid-cols-5">
        {flowNodes.map((node) => (
          <div key={node.label} className="flow-node border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-3 py-3 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--surface-soft)] text-[var(--accent)]">
              <node.icon className="h-4 w-4" />
            </div>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">{node.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowLabel({
  label,
  subtitle,
  detail,
  Icon,
}: {
  label: string;
  subtitle: string;
  detail: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pt-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--accent)]" />
        <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-strong)]">{label}</p>
      </div>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)] sm:text-[11px] sm:tracking-[0.16em]">{subtitle}</p>
      <p className="mt-1.5 font-mono text-xs text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}

function BuilderLaneRow({
  role,
  mission,
  value,
  Icon,
  delay,
}: {
  role: string;
  mission: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  return (
    <div className="home-panel lane-glide relative overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_90%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_84%,transparent)_100%)] px-4 py-5 sm:px-6" style={{ animationDelay: `${delay}s` }}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,color-mix(in_srgb,var(--accent)_8%,transparent)_45%,transparent_100%)]" />
      <div className="relative grid gap-5 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--surface-soft)] text-[var(--accent)]">
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-strong)] sm:text-2xl sm:tracking-[-0.025em]">{role}</p>
        </div>
        <div className="space-y-3">
          <p className="text-[14px] leading-6 text-[var(--text-muted)] sm:text-sm sm:leading-7">{mission}</p>
          <p className="border-l border-[color:color-mix(in_srgb,var(--accent)_26%,transparent)] pl-4 text-[14px] leading-6 text-[var(--text-strong)] sm:text-sm sm:leading-7">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthModeTile({
  name,
  headline,
  detail,
  route,
  strength,
  Icon,
}: {
  name: string;
  headline: string;
  detail: string;
  route: string;
  strength: number;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="home-panel group relative overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface)_90%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_82%,transparent)_100%)] px-4 py-5 sm:px-5">
      <p className="absolute right-3 top-2 text-[38px] font-semibold uppercase tracking-[-0.032em] text-[color:color-mix(in_srgb,var(--text-faint)_26%,transparent)] sm:text-[44px] sm:tracking-[-0.04em]">
        {name.split(" ")[0]}
      </p>
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.2em]">{route}</p>
          <h3 className="mt-2 text-[17px] font-semibold leading-6 tracking-[-0.016em] text-[var(--text-strong)] sm:text-lg sm:tracking-[-0.02em]">{headline}</h3>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--surface-soft)] text-[var(--accent)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="relative mt-3 text-[14px] leading-6 text-[var(--text-muted)] sm:text-sm sm:leading-7">{detail}</p>
      <div className="relative mt-4">
        <div className="h-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_86%,transparent)]">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_62%,var(--accent-bright)))]" style={{ width: `${strength}%` }} />
        </div>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.18em]">policy confidence {strength}</p>
      </div>
    </div>
  );
}

function RuntimeConsole() {
  return (
    <div className="home-panel relative overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_84%,transparent)_100%)] p-4 sm:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--accent)_42%,transparent),transparent)]" />
      <div className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_45%,transparent)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_35%,transparent)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_25%,transparent)]" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">runtime://gateway-console</p>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="space-y-2">
          {runtimeLogLines.map((line, index) => (
            <p key={line} className="font-mono text-[12px] text-[var(--text-muted)]" style={{ opacity: 1 - index * 0.08 }}>
              {line}
            </p>
          ))}
          <p className="font-mono text-[12px] text-[var(--accent)]">
            [console] watching route health<span className="console-caret">_</span>
          </p>
        </div>

        <div className="space-y-2 border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pt-2 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
          {commandRail.map((item) => (
            <div key={item.step} className="border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pt-3 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">step {item.step}</p>
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
              </div>
              <p className="mt-1 text-sm font-semibold tracking-[-0.01em] text-[var(--text-strong)]">{item.title}</p>
              <p className="mt-1 font-mono text-[12px] text-[var(--accent-soft)]">{item.command}</p>
              <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{item.output}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturePortfolioGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {featurePortfolio.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          detail={feature.detail}
          status={feature.status}
          capabilities={feature.capabilities}
          Icon={feature.icon}
          index={index}
        />
      ))}
    </div>
  );
}

function FeatureCard({
  title,
  detail,
  status,
  capabilities,
  Icon,
  index,
}: {
  title: string;
  detail: string;
  status: "Available now" | "In rollout" | "Planned release";
  capabilities: readonly string[];
  Icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  const statusClass =
    status === "Available now"
      ? "border-[color:color-mix(in_srgb,var(--accent)_32%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]"
      : status === "In rollout"
        ? "border-[color:color-mix(in_srgb,var(--accent)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_84%,transparent)] text-[var(--text-strong)]"
        : "border-[color:color-mix(in_srgb,var(--border-soft)_90%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] text-[var(--text-faint)]";

  const barValues = [34 + ((index * 9) % 46), 46 + ((index * 11) % 36), 28 + ((index * 7) % 54), 38 + ((index * 5) % 42)];

  return (
    <article className="home-panel group feature-card relative overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--surface)_90%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_84%,transparent)_100%)] px-4 py-5 sm:px-5">
      <div className="feature-sheen pointer-events-none absolute inset-y-0 -left-[38%] w-[44%] bg-[linear-gradient(110deg,transparent_0%,color-mix(in_srgb,var(--accent)_18%,transparent)_50%,transparent_100%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <StatusPill label={status} tone={status === "Available now" ? "active" : status === "In rollout" ? "progress" : "roadmap"} className={statusClass} />
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[var(--surface-soft)] text-[var(--accent)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <h3 className="relative mt-4 text-[17px] font-semibold leading-6 tracking-[-0.016em] text-[var(--text-strong)] sm:text-lg sm:tracking-[-0.02em]">{title}</h3>
      <p className="relative mt-2 text-[14px] leading-6 text-[var(--text-muted)] sm:text-sm sm:leading-7">{detail}</p>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {capabilities.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:tracking-[0.16em]"
          >
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            {item}
          </span>
        ))}
      </div>

      <div className="relative mt-4 grid grid-cols-4 gap-2">
        {barValues.map((value, barIndex) => (
          <div key={`${title}-${barIndex}`} className="h-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_84%,transparent)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_62%,var(--accent-bright)))]"
              style={{ width: `${value}%` }}
            />
          </div>
        ))}
      </div>
    </article>
  );
}

function StatusPill({
  label,
  tone,
  className,
}: {
  label: string;
  tone: "active" | "progress" | "roadmap";
  className?: string;
}) {
  const toneClass =
    tone === "active"
      ? "border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]"
      : tone === "progress"
        ? "border-[color:color-mix(in_srgb,var(--accent)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_84%,transparent)] text-[var(--text-strong)]"
        : "border-[color:color-mix(in_srgb,var(--border-soft)_86%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] text-[var(--text-faint)]";

  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] ${toneClass} ${className ?? ""}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[currentColor]" />
      {label}
    </span>
  );
}
