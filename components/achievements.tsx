"use client";

import { motion } from "motion/react";
import { certifications, counters, profiles, systemEvents } from "@/content/resume";
import { Counter } from "./motion/counter";
import { Reveal } from "./motion/reveal";
import { ExternalLink, Section } from "./section";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** [05] SYSTEM EVENTS: achievements as a log, plus the numbers that back them. */
export function Achievements() {
  const aws = certifications[0];
  return (
    <Section id="achievements" index="05" eyebrow="System events" title="Numbers I can back up." note="from the résumé">
      <dl className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {counters.map((c, i) => (
          <Reveal key={c.label} as="div" delay={i * 0.05} className="bg-bg p-5 sm:p-6">
            <dd className="font-display text-[2.2rem] leading-none font-semibold tracking-[-0.03em] text-text sm:text-[2.6rem]">
              <Counter to={c.value} prefix={c.prefix} suffix={c.suffix} />
            </dd>
            <dt className="mt-3 max-w-[22ch] font-mono text-[12px] leading-snug text-muted">{c.label}</dt>
          </Reveal>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="term h-full overflow-hidden">
            <div className="term-bar">
              <span>events · tail -n {systemEvents.length}</span>
            </div>
            <ol className="px-4 py-3 sm:px-5">
              {systemEvents.map((e, i) => (
                <motion.li
                  key={`${e.year}-${e.detail}`}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.35, ease, delay: i * 0.08 }}
                  className="grid grid-cols-[16px_44px_minmax(0,1fr)] gap-x-3 py-1.5 text-[13px] sm:grid-cols-[16px_44px_170px_minmax(0,1fr)]"
                >
                  <span className="text-green">✓</span>
                  <span className="text-faint">{e.year}</span>
                  <span className="text-muted uppercase tracking-[0.06em]">{e.label}</span>
                  <span className="col-span-3 text-text sm:col-span-1">{e.detail}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:col-span-5">
          <Reveal delay={0.1}>
            <article className="panel ticks p-5">
              <p className="meta text-amber">featured certification · {aws.year}</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{aws.name}</h3>
              <p className="font-mono text-[12.5px] text-muted">{aws.issuer}</p>
              <p className="mt-4 font-display text-[2.6rem] leading-none font-semibold tracking-[-0.03em] text-amber">
                914<span className="text-[1.1rem] text-muted"> / 1000</span>
              </p>
              <p className="mt-4 font-mono text-[12.5px]">
                <ExternalLink href={aws.href}>view certificate ↗</ExternalLink>
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="panel p-5">
                <p className="meta">certifications</p>
                <ul className="mt-3 space-y-3">
                  {certifications.map((c) => (
                    <li key={c.name} className="text-[13.5px]">
                      <ExternalLink href={c.href} className="text-text">
                        {c.name}
                      </ExternalLink>
                      <span className="block font-mono text-[12px] text-muted">
                        {c.issuer} · {c.year}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel p-5">
                <p className="meta">profiles</p>
                <ul className="mt-3 space-y-3">
                  {profiles.map((p) => (
                    <li key={p.href} className="text-[13.5px]">
                      <ExternalLink href={p.href} className="text-text">
                        {p.label}
                      </ExternalLink>
                      <span className="block font-mono text-[12px] text-muted">{p.detail}</span>
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
