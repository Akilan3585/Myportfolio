import { achievements, certifications, counters, hueVar, profiles } from "@/content/resume";
import { Counter } from "./motion/counter";
import { Reveal } from "./motion/reveal";
import { ExternalLink, Section } from "./section";

export function Achievements() {
  const aws = certifications[0];
  return (
    <Section
      id="achievements"
      index="05"
      eyebrow="Proof"
      title="Numbers I can back up."
      lede="Every figure here is from the résumé: a certification score, an internship result, and placements in college competitions."
    >
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {counters.map((c, i) => (
          <Reveal key={c.label} as="div" delay={i * 0.06} className="bg-bg p-6 sm:p-8">
            <dd className="font-display text-[2.4rem] font-bold leading-none tracking-[-0.03em] text-text sm:text-[3rem]">
              <Counter to={c.value} prefix={c.prefix} suffix={c.suffix} />
            </dd>
            <dt className="mt-3 max-w-[22ch] text-[14px] leading-snug text-muted">{c.label}</dt>
          </Reveal>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <article className="panel relative h-full overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full opacity-60"
              style={{ background: "radial-gradient(closest-side, var(--hue-amber), transparent 70%)", filter: "blur(34px)" }}
            />
            <p className="relative font-mono text-[11px] tracking-[0.2em] text-accent-2 uppercase">Featured certification · {aws.year}</p>
            <h3 className="relative mt-3 font-display text-[1.75rem] leading-tight font-semibold tracking-tight sm:text-[2rem]">{aws.name}</h3>
            <p className="relative mt-2 text-muted">{aws.issuer}</p>
            <p className="relative mt-6 font-display text-[3.5rem] leading-none font-bold tracking-[-0.03em] text-accent-2">
              914<span className="text-[1.5rem] text-muted"> / 1000</span>
            </p>
            <p className="relative mt-6 text-[14px]">
              <ExternalLink href={aws.href}>View certificate</ExternalLink>
            </p>
          </article>
        </Reveal>

        <div className="grid gap-6 lg:col-span-7">
          <Reveal delay={0.1}>
            <ul className="panel divide-y divide-line rounded-3xl" aria-label="Competition results">
              {achievements.map((a) => (
                <li key={a.title} className="flex items-start gap-4 p-5 sm:items-center sm:p-6">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0"
                    style={{ background: hueVar[a.hue], boxShadow: `0 0 0 4px color-mix(in oklab, ${hueVar[a.hue]} 18%, transparent)` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text">{a.title}</p>
                    <p className="text-[14px] text-muted">{a.org}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] text-faint">{a.year}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel rounded-3xl p-5 sm:p-6">
                <p className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">Certifications</p>
                <ul className="mt-3 space-y-3">
                  {certifications.map((c) => (
                    <li key={c.name} className="text-[14.5px]">
                      <ExternalLink href={c.href} className="text-text">
                        {c.name}
                      </ExternalLink>
                      <span className="block text-[13px] text-muted">
                        {c.issuer} · {c.year}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel rounded-3xl p-5 sm:p-6">
                <p className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">Profiles</p>
                <ul className="mt-3 space-y-3">
                  {profiles.map((p) => (
                    <li key={p.href} className="text-[14.5px]">
                      <ExternalLink href={p.href} className="text-text">
                        {p.label}
                      </ExternalLink>
                      <span className="block text-[13px] text-muted">{p.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
