type MemberShowcaseItem = {
  name: string;
  image: string;
  role: string;
  track: string;
  bio: string;
  skills: readonly string[];
  position: string;
};

type MemberShowcaseProps = {
  members: readonly MemberShowcaseItem[];
};

export function MemberShowcase({ members }: MemberShowcaseProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((member, index) => (
        <article
          key={member.name}
          className="home-panel group overflow-hidden border border-[color:color-mix(in_srgb,var(--border-soft)_88%,transparent)] bg-[linear-gradient(170deg,color-mix(in_srgb,var(--surface)_94%,var(--background))_0%,color-mix(in_srgb,var(--surface-muted)_92%,var(--background))_100%)] transition duration-300 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--accent)_36%,transparent)]"
        >
          <div className="relative overflow-hidden border-b border-[color:color-mix(in_srgb,var(--border-soft)_82%,transparent)] p-4 sm:p-5">
            <div className="absolute inset-x-0 top-0 h-[120px] bg-[radial-gradient(circle_at_20%_18%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_srgb,var(--surface-soft)_78%,transparent)_0%,transparent_100%)]" />

            <div className="relative flex items-start gap-4">
              <figure className="relative flex h-[108px] w-[94px] shrink-0 items-end justify-center overflow-hidden rounded-[1.1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_68%,transparent)_0%,color-mix(in_srgb,var(--surface-soft)_88%,transparent)_100%)] sm:h-[116px] sm:w-[100px]">
                <div className="absolute inset-x-3 bottom-2 h-4 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_24%,transparent),transparent_72%)] blur-md" />
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="relative z-10 h-[96px] w-auto max-w-none object-contain transition duration-700 group-hover:scale-[1.04] sm:h-[104px]"
                style={{ objectPosition: member.position }}
              />
              </figure>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex shrink-0 rounded-[0.62rem] border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    #{(index + 1).toString().padStart(2, "0")}
                  </span>
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">{member.track}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-[1.38rem] font-semibold leading-[1.02] tracking-[-0.028em] text-[var(--text-strong)] sm:text-[1.5rem]">
                    {member.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)]">{member.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            <p className="max-w-[32ch] text-[13px] leading-6 text-[var(--text-muted)]">{member.bio}</p>
            <div className="flex flex-wrap gap-2">
              {member.skills.slice(0, 3).map((skill) => (
                <span
                  key={`${member.name}-${skill}`}
                  className="inline-flex items-center rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_95%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
