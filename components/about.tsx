"use client";

import { motion } from "motion/react";
import { about, internship } from "@/content/resume";
import { Reveal } from "./motion/reveal";
import { ExternalLink, Section } from "./section";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function About() {
  return (
    <Section id="about" index="01" eyebrow="Who" title="Full-stack by trade, ops by habit.">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="font-display text-[1.6rem] leading-[1.35] tracking-[-0.01em] sm:text-[2rem]">
              {about.statement.map((part, i) =>
                part.highlight ? (
                  <motion.span
                    key={i}
                    initial={{ backgroundSize: "0% 100%" }}
                    whileInView={{ backgroundSize: "100% 100%" }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.08 }}
                    className="rounded-sm px-1 font-semibold text-text"
                    style={{
                      backgroundImage: "linear-gradient(120deg, rgb(62 200 184 / 0.28), rgb(255 180 84 / 0.22))",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "0 100%",
                      boxDecorationBreak: "clone",
                      WebkitBoxDecorationBreak: "clone",
                    }}
                  >
                    {part.text}
                  </motion.span>
                ) : (
                  <span key={i} className="text-muted">
                    {part.text}
                  </span>
                ),
              )}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <dl className="grid gap-5 sm:grid-cols-3">
              {about.facts.map((f) => (
                <div key={f.label} className="border-l border-line pl-4">
                  <dt className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">{f.label}</dt>
                  <dd className="mt-1.5 text-[15px] text-text">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Things I work with daily">
            {about.labels.map((l, i) => (
              <li
                key={l}
                className="float-y rounded-full border border-line bg-surface px-3 py-1 font-mono text-[12px] text-muted"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                {l}
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.2} className="lg:col-span-5">
          <article className="panel relative overflow-hidden rounded-3xl p-6 sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-50"
              style={{ background: "radial-gradient(closest-side, var(--hue-mint), transparent 70%)", filter: "blur(30px)" }}
            />
            <p className="relative font-mono text-[11px] tracking-[0.2em] text-accent uppercase">Most recent · {internship.year}</p>
            <h3 className="relative mt-3 font-display text-2xl font-semibold tracking-tight">
              {internship.title}
              <span className="text-muted"> at </span>
              {internship.org}
            </h3>
            <p className="relative mt-4 text-[15px] leading-relaxed text-muted">{internship.detail}</p>
            <ul className="relative mt-5 grid grid-cols-2 gap-3 font-mono text-[12.5px]">
              <li className="rounded-xl border border-line bg-bg/60 px-3 py-2.5">
                <span className="block text-2xl font-semibold text-text">60%</span>
                <span className="text-faint">less manual deploy effort</span>
              </li>
              <li className="rounded-xl border border-line bg-bg/60 px-3 py-2.5">
                <span className="block text-2xl font-semibold text-text">5+</span>
                <span className="text-faint">services on Kubernetes</span>
              </li>
            </ul>
            <p className="relative mt-5 text-[14px]">
              <ExternalLink href={internship.href}>Internship letter</ExternalLink>
            </p>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
