"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { certifications, person, site } from "@/content/resume";
import { DeliveryDiagram } from "./delivery-diagram";
import { TextReveal } from "./motion/text-reveal";
import { StatusDot } from "./section";

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
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const aws = certifications[0];
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 640], [1, 0.1]);
  const lift = useTransform(scrollY, [0, 640], [0, -72]);
  return (
    <section
      id="top"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="meta flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4"
        >
          <span className="flex items-center gap-2">
            <StatusDot tone="green" live />
            system online · v{site.version}
          </span>
          <span className="hidden sm:inline">{person.location}</span>
          <span>sec-00 · /</span>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { opacity: fade, y: lift }}
          className="grid grid-cols-1 items-start gap-12 pt-12 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.05 }}
              className="font-mono text-[12px] tracking-[0.18em] text-accent uppercase"
            >
              {person.name} · {person.role}
            </motion.p>

            <TextReveal
              as="h1"
              text={person.headline}
              highlight={["commit", "container", "cluster", "product."]}
              delay={0.15}
              className="mt-5 max-w-[16ch] font-display text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4rem]"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.75 }}
              className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-muted"
            >
              {person.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.9 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#projects"
                data-cursor="VIEW SYSTEMS"
                className="group inline-flex h-11 items-center gap-2 border border-accent bg-accent px-5 font-mono text-[13px] tracking-[0.08em] text-bg uppercase transition-colors hover:bg-accent-strong"
              >
                Deployed systems
                <Arrow className="group-hover:translate-x-1" />
              </a>
              <a
                href={person.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 border border-line-strong px-5 font-mono text-[13px] tracking-[0.08em] text-text uppercase transition-colors hover:border-accent hover:text-accent"
              >
                résumé.pdf
              </a>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-10 grid max-w-[36rem] grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-5 font-mono text-[12.5px] sm:grid-cols-3"
            >
              <div>
                <dt className="meta">status</dt>
                <dd className="mt-1 text-text">{person.availability}</dd>
              </div>
              <div>
                <dt className="meta">certified</dt>
                <dd className="mt-1 text-text">
                  <a
                    href={aws.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-ul"
                  >
                    AWS CCP · {aws.detail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="meta">graduating</dt>
                <dd className="mt-1 text-text">
                  2027 · B.E. CSE (AI &amp; ML)
                </dd>
              </div>
            </motion.dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="ticks panel relative p-3 sm:p-4 lg:col-span-6"
          >
            <div className="meta flex items-center justify-between px-1 pb-3">
              <span>delivery path · how code reaches users</span>
              <span className="hidden sm:inline">schematic</span>
            </div>
            <DeliveryDiagram />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
