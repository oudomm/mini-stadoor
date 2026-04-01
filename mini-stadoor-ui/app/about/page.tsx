import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe,
  GraduationCap,
  Mail,
  Rocket,
  Sparkles,
  Target,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { HeroTeamLineup } from "@/components/about/hero-team-lineup";
import { MemberShowcase } from "@/components/about/member-showcase";

type MemberProfile = {
  name: string;
  image: string;
  role: string;
  track: string;
  bio: string;
  skills: readonly string[];
  position: string;
};

type MentorProfile = {
  name: string;
  image: string;
  role: string;
  specialties: readonly string[];
  quote: string;
  impact: string;
  position: string;
};

const projectFacts = [
  { label: "Program", value: "ITP at ISTAD" },
  { label: "Course", value: "Spring Microservices" },
  { label: "Team", value: "9 builders" },
  { label: "Mentors", value: "2 mentors" },
] as const;

const members: readonly MemberProfile[] = [
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Team Lead · Full Stack",
    track: "Delivery Architecture",
    bio: "Coordinated execution and aligned backend integration milestones.",
    skills: ["Leadership", "Frontend", "Backend"],
    position: "50% 18%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Gateway Engineer",
    track: "Gateway Runtime",
    bio: "Built dynamic route + service discovery runtime behavior.",
    skills: ["Gateway", "Discovery", "Java"],
    position: "50% 22%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Security Engineer",
    track: "Policy Enforcement",
    bio: "Implemented route-level security and policy behavior.",
    skills: ["Auth", "JWT", "Policy"],
    position: "50% 20%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Frontend Engineer",
    track: "Developer Portal",
    bio: "Shaped product-facing portal and interaction flow.",
    skills: ["UX", "Portal", "React"],
    position: "50% 24%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Backend Engineer",
    track: "Service Plane",
    bio: "Built service onboarding and management API behavior.",
    skills: ["API", "Services", "PostgreSQL"],
    position: "50% 24%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Integration Engineer",
    track: "Control Plane",
    bio: "Connected backend control-plane flows into portal UI.",
    skills: ["BFF", "Integration", "Next.js"],
    position: "50% 28%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Runtime Engineer",
    track: "Gateway Validation",
    bio: "Verified routing behavior and forwarding paths.",
    skills: ["Testing", "Routing", "Observability"],
    position: "50% 20%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Validation Engineer",
    track: "Demo Reliability",
    bio: "Prepared end-to-end scenario checks and demo readiness.",
    skills: ["Validation", "QA", "Scenario"],
    position: "50% 26%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Documentation Engineer",
    track: "Technical Narrative",
    bio: "Framed architecture explanations and delivery story.",
    skills: ["Docs", "Architecture", "Communication"],
    position: "50% 22%",
  },
] as const;

const mentors: readonly MentorProfile[] = [
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Spring Microservices Mentor",
    specialties: ["System Design", "Bounded Context", "Delivery Guidance"],
    quote: "Guided architecture direction and bounded-context decisions.",
    impact: "Kept domain boundaries clear while we built dynamic gateway behavior.",
    position: "50% 24%",
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/phoem-oudom.png",
    role: "Backend & Delivery Mentor",
    specialties: ["Engineering Quality", "Service Behavior", "Code Review"],
    quote: "Pushed our team to turn ideas into working, testable flows.",
    impact: "Raised implementation rigor and delivery confidence across milestones.",
    position: "50% 22%",
  },
] as const;

const storySteps = [
  {
    phase: "01",
    title: "Foundation",
    detail: "We came from a full-stack foundation where frontend speed often depended on backend availability.",
    icon: BookOpen,
  },
  {
    phase: "02",
    title: "Challenge",
    detail: "In Spring Microservices, we reframed the problem: one platform to simplify identity, routes, and security.",
    icon: Compass,
  },
  {
    phase: "03",
    title: "Execution",
    detail: "We built Stadoor around tenant onboarding, dynamic route publishing, and policy-per-route enforcement.",
    icon: Rocket,
  },
  {
    phase: "04",
    title: "Direction",
    detail: "The next direction expands to OAuth2/OIDC federation, traffic controls, and stronger network protection.",
    icon: Target,
  },
] as const;

const techStack = [
  "Java",
  "Reactive Spring",
  "Axon Framework",
  "Debezium",
  "Confluent Schema Registry",
  "RabbitMQ",
  "Apache Kafka",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Git",
  "Next.js",
  "OAuth2",
  "OIDC",
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <section className="relative min-h-[100svh] overflow-hidden border-b border-[color:color-mix(in_srgb,var(--border-soft)_90%,transparent)] bg-[radial-gradient(circle_at_22%_12%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_34%),radial-gradient(circle_at_88%_4%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_38%),linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_88%,var(--background))_58%,var(--background)_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_7%,transparent)_1px,transparent_1px),linear-gradient(180deg,color-mix(in_srgb,var(--accent)_7%,transparent)_1px,transparent_1px)] bg-[size:96px_96px] opacity-55" />
        <div className="absolute inset-x-0 top-0 z-30 px-4 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SiteHeader active="about" ctaLabel="Open Dashboard" ctaHref="/dashboard" />
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1320px] flex-col justify-end px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-32 lg:px-8 lg:pb-12">
          <div className="max-w-3xl">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_52%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">
              <GraduationCap className="h-3.5 w-3.5" />
              ISTAD Spring Microservices Final Project
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--text-strong)] sm:text-6xl sm:leading-[0.88] lg:text-7xl">
              About
              <span className="block text-[var(--accent)]">Stadoor</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-xl">
              A developer security platform where identity, dynamic API gateway routing, and route-level protection are managed as one flow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                asChild
                variant="brand"
                size="lg"
                className="w-full justify-between border border-[var(--border-strong)] bg-[var(--accent)] px-7 text-[var(--accent-contrast)] shadow-[0_0_36px_var(--glow)] hover:bg-[var(--accent-bright)] sm:w-auto sm:justify-center"
              >
                <Link href="/dashboard">
                  Explore Stadoor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] bg-transparent text-[var(--text-strong)] hover:border-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] sm:w-auto"
              >
                <Link href="/">Back to home</Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-3 border-t border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] pt-5 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-4">
              {projectFacts.map((fact) => (
                <li key={fact.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">{fact.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-strong)]">{fact.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <HeroTeamLineup members={members} />
        </div>
      </section>

      <section className="relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,var(--background))_0%,var(--background)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px]">Project Story</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94]">
                From full-stack foundation to security platform architecture.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
                Stadoor started from a practical classroom constraint and evolved into a working control plane for developer identity and gateway security.
              </p>

              <div className="mt-9 space-y-4">
                {storySteps.map((step) => (
                  <StoryStep key={step.phase} phase={step.phase} title={step.title} detail={step.detail} Icon={step.icon} />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <article className="overflow-hidden rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_94%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_92%,var(--background))_100%)]">
                <div className="grid sm:grid-cols-[1fr_220px]">
                  <div className="px-5 py-6 sm:px-6 sm:py-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">Mission</p>
                    <h3 className="mt-3 text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--text-strong)]">Make secure infrastructure ready from day one.</h3>
                    <p className="mt-3 text-[14px] leading-7 text-[var(--text-muted)] sm:text-sm">
                      Register application surfaces, publish routes, and apply per-route policy without rebuilding auth infrastructure from scratch.
                    </p>
                  </div>
                  <MissionVisualPanel />
                </div>
              </article>

              <article className="overflow-hidden rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_94%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_92%,var(--background))_100%)]">
                <div className="grid sm:grid-cols-[220px_1fr]">
                  <VisionVisualPanel />
                  <div className="px-5 py-6 sm:px-6 sm:py-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">Vision</p>
                    <h3 className="mt-3 text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--text-strong)]">Grow Stadoor into a production-grade developer security platform.</h3>
                    <p className="mt-3 text-[14px] leading-7 text-[var(--text-muted)] sm:text-sm">
                      Extend from demo-ready foundations into OAuth2/OIDC federation, stronger traffic controls, and network hardening capabilities.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_92%,var(--background))_100%)] py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_44%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px]">Built With Modern Stack</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94]">Technologies powering Stadoor.</h2>
          </div>
          <div className="marquee-wrap mt-8 border-y border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] py-4">
            <div className="marquee-track gap-3">
              {[...techStack, ...techStack].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_92%,var(--background))_0%,var(--background)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" />
              Mentor Guidance
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94]">
              Experienced direction behind the build.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {mentors.map((mentor) => (
              <MentorPanel key={mentor.name} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_92%,var(--background))_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px]">Team Members</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--text-strong)] sm:text-5xl sm:leading-[0.94]">
              The builders behind Stadoor.
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[var(--text-muted)] sm:text-sm">
              Each member owned a concrete product surface, from gateway runtime to developer portal delivery.
            </p>
          </div>

          <div className="mt-10">
            <MemberShowcase members={members} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_srgb,var(--surface)_88%,var(--background))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-start lg:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] sm:text-[11px]">Get In Touch</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--text-strong)] sm:text-6xl sm:leading-[0.94]">
              Build secure developer products with us.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
              If you want to collaborate, test Stadoor, or discuss architecture, we are open for conversations and technical exchange.
            </p>
          </div>

          <div className="space-y-4 border-t border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <ContactRow icon={<Mail className="h-4 w-4" />} label="Email" value="team@stadoor.dev" />
            <ContactRow icon={<Globe className="h-4 w-4" />} label="Location" value="ISTAD, Phnom Penh, Cambodia" />
            <ContactRow icon={<Waypoints className="h-4 w-4" />} label="Focus" value="IAM, dynamic gateway routing, and route-level security" />
            <div className="pt-2">
              <Button
                asChild
                variant="brand"
                size="lg"
                className="w-full border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_36px_var(--glow)] hover:bg-[var(--accent-bright)] sm:w-auto"
              >
                <Link href="/dashboard">
                  Open Stadoor Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function StoryStep({
  phase,
  title,
  detail,
  Icon,
}: {
  phase: string;
  title: string;
  detail: string;
  Icon: LucideIcon;
}) {
  return (
    <article className="grid gap-3 border-l border-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] pl-4 sm:grid-cols-[52px_1fr] sm:pl-5">
      <div className="flex items-center gap-3 sm:block">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_38%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)] sm:mt-2">phase {phase}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-[-0.015em] text-[var(--text-strong)]">{title}</h3>
        <p className="mt-2 text-[14px] leading-7 text-[var(--text-muted)] sm:text-sm">{detail}</p>
      </div>
    </article>
  );
}

function MissionVisualPanel() {
  return (
    <div className="relative min-h-[180px] overflow-hidden rounded-b-[1rem] border-t border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(170deg,color-mix(in_srgb,var(--surface)_90%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_96%,var(--background))_100%)] sm:rounded-b-none sm:rounded-r-[1rem] sm:border-l sm:border-t-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_44%)]" />
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">
            <Target className="h-3.5 w-3.5" />
            Security workflow
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">active</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-[86%] bg-[color:color-mix(in_srgb,var(--accent)_42%,transparent)]" />
          <div className="h-2 w-[64%] bg-[color:color-mix(in_srgb,var(--accent)_24%,transparent)]" />
          <div className="h-2 w-[74%] bg-[color:color-mix(in_srgb,var(--accent)_30%,transparent)]" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
          <div className="border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] px-2 py-1.5">Basic</div>
          <div className="border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] px-2 py-1.5">JWT</div>
          <div className="border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] px-2 py-1.5">API Key</div>
          <div className="border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] px-2 py-1.5">OAuth2</div>
        </div>
      </div>
    </div>
  );
}

function VisionVisualPanel() {
  return (
    <div className="relative min-h-[180px] overflow-hidden rounded-t-[1rem] border-b border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(170deg,color-mix(in_srgb,var(--surface)_90%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_96%,var(--background))_100%)] sm:rounded-r-none sm:rounded-l-[1rem] sm:border-b-0 sm:border-r">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_42%)]" />
      <div className="relative flex h-full flex-col justify-between p-4">
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">
          <Waypoints className="h-3.5 w-3.5" />
          Gateway runtime
        </span>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <div className="h-1.5 flex-1 bg-[color:color-mix(in_srgb,var(--accent)_34%,transparent)]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_60%,transparent)]" />
            <div className="h-1.5 w-[72%] bg-[color:color-mix(in_srgb,var(--accent)_26%,transparent)]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_52%,transparent)]" />
            <div className="h-1.5 w-[84%] bg-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
          <span>services</span>
          <span>routes</span>
          <span>runtime</span>
        </div>
      </div>
    </div>
  );
}

function MentorPanel({ mentor }: { mentor: MentorProfile }) {
  return (
    <article className="home-panel group grid gap-4 border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface)_94%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_92%,var(--background))_100%)] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] sm:grid-cols-[140px_1fr] sm:p-5">
      <figure className="relative flex h-[170px] items-end justify-center overflow-hidden rounded-[1.1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_82%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_68%,transparent)_0%,color-mix(in_srgb,var(--surface-soft)_90%,transparent)_100%)]">
        <div className="absolute inset-x-5 top-4 h-16 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_74%)] blur-xl" />
        <div className="absolute inset-x-5 bottom-3 h-5 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_24%,transparent),transparent_72%)] blur-md" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mentor.image}
          alt={mentor.name}
          loading="lazy"
          className="relative z-10 h-[148px] w-auto max-w-none object-contain transition duration-700 group-hover:scale-[1.04]"
          style={{ objectPosition: mentor.position }}
        />
      </figure>

      <div>
        <p className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-strong)]">{mentor.name}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">{mentor.role}</p>
        <p className="mt-4 text-[15px] font-medium leading-7 text-[var(--text-strong)]">“{mentor.quote}”</p>
        <p className="mt-3 text-[13px] leading-6 text-[var(--text-muted)]">{mentor.impact}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mentor.specialties.map((specialty) => (
            <span
              key={specialty}
              className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent)_38%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--text-strong)]">{value}</p>
      </div>
    </div>
  );
}
