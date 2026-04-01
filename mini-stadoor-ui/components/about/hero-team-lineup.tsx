"use client";

import { useEffect, useState } from "react";

type HeroLineupMember = {
  name: string;
  image: string;
  role: string;
  track: string;
  position: string;
};

type HeroTeamLineupProps = {
  members: readonly HeroLineupMember[];
};

export function HeroTeamLineup({ members }: HeroTeamLineupProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const activeMember = members[activeIndex] ?? members[0];

  useEffect(() => {
    if (isInteracting || members.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % members.length);
    }, 3800);

    return () => {
      window.clearInterval(timer);
    };
  }, [isInteracting, members.length]);

  return (
    <div className="mt-10 w-full" onMouseEnter={() => setIsInteracting(true)} onMouseLeave={() => setIsInteracting(false)}>
      <div className="home-panel hidden h-[430px] overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(170deg,color-mix(in_srgb,var(--surface)_96%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_92%,var(--background))_100%)] lg:flex">
        {members.map((member, index) => {
          const distance = Math.abs(index - activeIndex);
          const isActive = index === activeIndex;
          const grow = isActive ? 8 : distance === 1 ? 3.7 : distance === 2 ? 2.1 : 1.2;

          return (
            <button
              key={member.name}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              style={{ flexGrow: grow }}
              className={`group relative min-w-[56px] overflow-hidden border-r border-[color:color-mix(in_srgb,var(--border-soft)_82%,transparent)] text-left transition-[flex-grow,filter] duration-500 last:border-r-0 ${
                isActive ? "grayscale-0" : "grayscale-[92%] hover:grayscale-[38%]"
              }`}
              aria-label={`Show ${member.name}`}
            >
              <img src={member.image} alt={member.name} className="h-full w-full object-cover" style={{ objectPosition: member.position }} loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_0%,transparent)_28%,color-mix(in_srgb,var(--background)_82%,transparent)_100%)]" />

              {isActive ? (
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">Featured Builder</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-[var(--text-strong)]">{member.name}</p>
                  <p className="mt-1 text-[15px] font-medium text-[var(--text-muted)]">{member.role}</p>
                </div>
              ) : (
                <div className="absolute inset-x-0 bottom-0 p-2">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-strong)] opacity-80">{member.name}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 hidden items-center justify-between lg:flex">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Team reel · hover to focus</p>
        <div className="flex items-center gap-1.5">
          {members.map((member, index) => (
            <button
              key={`dot-${member.name}`}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-7 bg-[var(--accent)]"
                  : "w-1.5 bg-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--accent)_35%,transparent)]"
              }`}
              aria-label={`Go to ${member.name}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 lg:hidden">
        <figure className="home-panel relative h-[320px] overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--surface)_94%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_92%,var(--background))_100%)]">
          {members.map((member, index) => (
            <img
              key={`mobile-${member.name}`}
              src={member.image}
              alt={member.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                index === activeIndex ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[1.02]"
              }`}
              style={{ objectPosition: member.position }}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_0%,transparent)_32%,color-mix(in_srgb,var(--background)_80%,transparent)_100%)]" />

          {activeMember ? (
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">Featured Builder</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.026em] text-[var(--text-strong)]">{activeMember.name}</p>
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">{activeMember.role}</p>
            </figcaption>
          ) : null}
        </figure>

        <div className="grid grid-cols-3 gap-2">
          {members.map((member, index) => (
            <button
              key={`thumb-${member.name}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={`relative h-20 overflow-hidden border transition ${
                index === activeIndex
                  ? "border-[color:color-mix(in_srgb,var(--accent)_44%,transparent)]"
                  : "border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)]"
              }`}
              aria-label={`Show ${member.name}`}
            >
              <img src={member.image} alt={member.name} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: member.position }} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,color-mix(in_srgb,var(--background)_74%,transparent)_100%)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
