"use client";

import { motion } from "motion/react";
import { person, certifications } from "@/content/resume";
import { HeroGraphic } from "./hero-graphic";
import { Magnetic } from "./motion/magnetic";
import { TextReveal } from "./motion/text-reveal";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={`transition-transform duration-300 ${className}`}
    >
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const aws = certifications[0];
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[12px] tracking-[0.16em] text-muted uppercase"
          >
            <span className="blink h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {person.badge}
          </motion.p>

          <TextReveal
            as="h1"
            text={person.headline}
            highlight={["pipelines"]}
            delay={0.15}
            className="mt-6 font-display text-[2.9rem] font-bold leading-[0.98] tracking-[-0.03em] sm:text-[4rem] lg:text-[5rem]"
            style={{ fontVariationSettings: '"opsz" 96, "wdth" 92' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
            className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted"
          >
            {person.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.85 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-text px-6 text-[15px] font-medium text-bg transition-colors hover:bg-accent"
              >
                See the work
                <Arrow className="group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={person.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[15px] font-medium text-text transition-colors hover:border-accent hover:text-accent"
              >
                Résumé
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M8 2v9M4.5 7.5 8 11l3.5-3.5M3 13.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-10 grid max-w-[40rem] grid-cols-1 gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-[12.5px] sm:grid-cols-3"
          >
            <div>
              <dt className="text-faint uppercase tracking-[0.16em]">Status</dt>
              <dd className="mt-1 text-text">{person.availability}</dd>
            </div>
            <div>
              <dt className="text-faint uppercase tracking-[0.16em]">Certified</dt>
              <dd className="mt-1 text-text">
                <a href={aws.href} target="_blank" rel="noreferrer" className="link-ul">
                  AWS Cloud Practitioner · {aws.detail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-faint uppercase tracking-[0.16em]">Based in</dt>
              <dd className="mt-1 text-text">{person.location}</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          className="relative mx-auto aspect-square w-full max-w-[520px] lg:col-span-5"
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: "radial-gradient(closest-side, rgb(62 200 184 / 0.18), transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <HeroGraphic className="relative h-full w-full" />
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            control plane → workers → pods
          </p>
        </motion.div>
      </div>
    </section>
  );
}
