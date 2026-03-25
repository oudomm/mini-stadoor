import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe2,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { StadoorLogo } from "@/components/stadoor-logo";

const mentors = [
  {
    name: "Chan Chhaya",
    image: "/images/team/teacher-chhaya.jpeg",
    title: "Lead Mentor",
    role: "Spring Microservices Mentor",
    focus: "Architecture guidance, domain design, and system direction",
    tags: ["Architecture", "DDD", "Mentorship"],
    accent: "green" as const,
    socials: {
      github: "#",
      linkedin: "#",
      portfolio: "#",
    },
  },
  {
    name: "Eung Lyzhia",
    image: "/images/team/teacher-lyzhia.jpeg",
    title: "Technical Mentor",
    role: "Backend & Delivery Mentor",
    focus: "Backend review, project coaching, and delivery guidance",
    tags: ["Backend", "Review", "Coaching"],
    accent: "cyan" as const,
    socials: {
      github: "#",
      linkedin: "#",
      portfolio: "#",
    },
  },
];

const members = [
  {
    name: "Chey Somatra",
    image: "/images/team/somatra.jpeg",
    title: "Team Leader",
    role: "Full Stack Developer",
    focus: "Project coordination, backend integration, and product delivery",
    tags: ["Leadership", "Full Stack", "Integration"],
    accent: "green" as const,
  },
  {
    name: "Som Sokunsreypich",
    image: "/images/team/sokunsreypich.jpg",
    title: "Full Stack Developer",
    role: "Gateway & Discovery",
    focus: "Dynamic route flow, service registration, and discovery handling",
    tags: ["Gateway", "Discovery", "Java"],
    accent: "cyan" as const,
  },
  {
    name: "Kong Chan",
    image: "/images/team/chan.jpeg",
    title: "Full Stack Developer",
    role: "Security Workflow",
    focus: "Basic Auth, API Key flow, and security policy behavior",
    tags: ["Security", "Policies", "Spring"],
    accent: "green" as const,
  },
  {
    name: "But Seavthong",
    image: "/images/team/seavthong.jpeg",
    title: "Full Stack Developer",
    role: "Developer Portal",
    focus: "Landing page, dashboard experience, and product-facing UI",
    tags: ["Next.js", "UI", "UX"],
    accent: "cyan" as const,
  },
  {
    name: "Chao Vanthoung",
    image: "/images/team/vanthoung.jpeg",
    title: "Full Stack Developer",
    role: "Service Management",
    focus: "Service onboarding flow and management APIs",
    tags: ["Services", "APIs", "Postgres"],
    accent: "green" as const,
  },
  {
    name: "Ren Makara",
    image: "/images/team/makara.jpeg",
    title: "Full Stack Developer",
    role: "Portal & Control Plane",
    focus: "Bridging backend prototype capabilities into the web portal",
    tags: ["Control Plane", "Web", "Integration"],
    accent: "cyan" as const,
  },
  {
    name: "Chan Somnang",
    image: "/images/team/somnang.jpeg",
    title: "Full Stack Developer",
    role: "Runtime Gateway",
    focus: "Runtime routing flow and gateway behavior verification",
    tags: ["Routing", "Gateway", "Testing"],
    accent: "green" as const,
  },
  {
    name: "Teng Meng Houy",
    image: "/images/team/menghouy.jpeg",
    title: "Full Stack Developer",
    role: "Validation & Demo Flow",
    focus: "Scenario testing, Postman validation, and demo readiness",
    tags: ["QA", "Validation", "Demo"],
    accent: "cyan" as const,
  },
  {
    name: "Phoem Oudom",
    image: "/images/team/oudom.jpg",
    title: "Full Stack Developer",
    role: "Documentation Support",
    focus: "Architecture explanation, feature framing, and project communication",
    tags: ["Research", "Docs", "Analysis"],
    accent: "green" as const,
  },
].map((member) => ({
  ...member,
  socials: {
    github: "#",
    linkedin: "#",
    portfolio: "#",
  },
}));

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-[radial-gradient(circle_at_top,rgba(0,255,65,0.08),transparent_28%),linear-gradient(180deg,#0a0a0a_0%,#0d100d_18%,#0a0a0a_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between border border-white/6 bg-black/30 px-5 py-4 backdrop-blur-sm">
            <StadoorLogo subtitleClassName="text-white/45" wordmarkClassName="text-xl text-white" />

            <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 md:flex">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-white">
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
                <Link href="/dashboard">Open portal</Link>
              </Button>
            </div>
          </header>

          <section className="grid gap-8 px-2 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                academic_project_context
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                About
                <span className="mt-2 block text-[#00ff41]">Mini Stadoor.</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Mini Stadoor is the final project of the ITP Program at ISTAD for the subject
                <span className="text-white"> Spring Microservices</span>. The project is guided by
                2 mentors and built by a team of 9 students as a developer security SaaS prototype.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="border border-[#00ff41]/30 bg-[#00ff41] px-7 text-black shadow-[0_0_32px_rgba(0,255,65,0.16)] hover:bg-[#7cff98]"
                >
                  <Link href="/dashboard">
                    View prototype
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5"
                >
                  <Link href="/">Back to landing</Link>
                </Button>
              </div>
            </div>

            <Card className="border border-white/8 bg-[linear-gradient(180deg,#121212_0%,#0f0f0f_100%)] text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <CardContent className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fff8b]">
                  project_snapshot
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <AboutStat icon={<GraduationCap className="h-4 w-4" />} label="Program" value="ITP at ISTAD" />
                  <AboutStat icon={<BookOpen className="h-4 w-4" />} label="Subject" value="Spring Microservices" />
                  <AboutStat icon={<Users className="h-4 w-4" />} label="Team" value="9 students" />
                  <AboutStat icon={<ShieldCheck className="h-4 w-4" />} label="Mentors" value="2 mentors" />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <section className="border-t border-white/6 bg-[#111111]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
          <AboutCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="What Mini Stadoor is"
            body="A developer security SaaS prototype where developers can register an API or frontend, publish dynamic routes, and apply security policies through one platform."
          />
          <AboutCard
            icon={<Waypoints className="h-5 w-5" />}
            title="What this prototype proves"
            body="Dynamic service registration, dynamic routing, Basic Authentication, API Key enforcement, and JWT working together through the Mini Stadoor control plane."
          />
          <AboutCard
            icon={<BookOpen className="h-5 w-5" />}
            title="What comes next"
            body="The wider Mini Stadoor vision includes IAM, OAuth2 with OIDC, BFF as a Service, compliance features, traffic management, and more platform modules."
          />
        </div>
      </section>

      <section className="border-t border-white/6 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
              project_team
            </p>
            <h2 className="mt-4 text-3xl font-semibold uppercase tracking-[-0.04em] text-white sm:text-4xl">
              Mentors and
              <span className="text-[#00ff41]"> team members.</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-white/60">
              Mini Stadoor is built as a team project. This section presents the project structure with
              mentor and member profile cards. You can replace the placeholder names with the real
              team list any time.
            </p>
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#132113] text-[#8fff8b]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">Mentor group</p>
                <p className="text-xl font-semibold text-white">2 project mentors</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {mentors.map((mentor, index) => (
                <ProfileCard
                  key={mentor.name}
                  name={mentor.name}
                  image={mentor.image}
                  title={mentor.title}
                  role={mentor.role}
                  focus={mentor.focus}
                  tags={mentor.tags}
                  accent={mentor.accent}
                  socials={mentor.socials}
                />
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#142114] text-[#8fff8b]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">Student team</p>
                <p className="text-xl font-semibold text-white">9 project members</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <ProfileCard
                  key={member.name}
                  name={member.name}
                  image={member.image}
                  title={member.title}
                  role={member.role}
                  focus={member.focus}
                  tags={member.tags}
                  accent={member.accent}
                  socials={member.socials}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function AboutStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.1rem] border border-white/8 bg-black/20 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#132113] text-[#8fff8b]">
        {icon}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function AboutCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="border border-white/8 bg-[#171717] text-white shadow-none">
      <CardContent className="p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#142114] text-[#8fff8b]">
          {icon}
        </div>
        <h3 className="mt-6 text-lg font-semibold uppercase tracking-tight text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/62">{body}</p>
      </CardContent>
    </Card>
  );
}

function ProfileCard({
  name,
  image,
  title,
  role,
  focus,
  tags,
  accent,
  socials,
}: {
  name: string;
  image?: string;
  title: string;
  role: string;
  focus: string;
  tags: string[];
  accent: "green" | "cyan";
  socials: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
}) {
  const accentClasses =
    accent === "green"
      ? "bg-[#132113] text-[#8fff8b] border-[#00ff41]/12"
      : "bg-[#102028] text-[#9ef0ff] border-[#9ef0ff]/12";
  const bannerClasses =
    accent === "green"
      ? "from-[#162716] via-[#111111] to-[#0f160f]"
      : "from-[#11212a] via-[#111111] to-[#0f1618]";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden border border-white/8 bg-[linear-gradient(180deg,#151515_0%,#111111_100%)] text-white shadow-none">
      <div className={`h-24 bg-gradient-to-br ${bannerClasses}`} />
      <CardContent className="p-6 pt-0">
        <div className="-mt-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProfileAvatar image={image} initials={initials} accentClasses={accentClasses} />
            <div>
              <p className="text-lg font-semibold text-white">{name}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8fff8b]">{title}</p>
              <p className="mt-2 text-sm text-white/56">{role}</p>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black/20 text-white/45">
            <Layers3 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                accent === "green"
                  ? "border-[#00ff41]/12 bg-[#111811] text-[#8fff8b]"
                  : "border-[#9ef0ff]/12 bg-[#10191d] text-[#9ef0ff]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[1rem] border border-white/8 bg-black/20 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Project focus</p>
          <p className="mt-3 text-sm leading-7 text-white/62">{focus}</p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <SocialPill href={socials.github} label="GitHub" />
          <SocialPill href={socials.linkedin} label="LinkedIn" />
          <SocialPill href={socials.portfolio} label="Portfolio" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileAvatar({
  image,
  initials,
  accentClasses,
}: {
  image?: string;
  initials: string;
  accentClasses: string;
}) {
  if (image) {
    return (
      <div className="h-20 w-20 overflow-hidden rounded-[1.35rem] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`flex h-20 w-20 items-center justify-center rounded-[1.35rem] border text-xl font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.22)] ${accentClasses}`}>
      {initials}
    </div>
  );
}

function SocialPill({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/20 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-white/14 hover:bg-white/4 hover:text-white"
    >
      <Globe2 className="h-4 w-4" />
      {label}
    </Link>
  );
}
