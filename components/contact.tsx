"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { person } from "@/content/resume";
import { Arrow } from "./hero";
import { Reveal } from "./motion/reveal";
import { SectionTransition } from "./motion/section-transition";
import { Terminal } from "./terminal";

const ease = [0.2, 0.7, 0.2, 1] as const;

const ENTRIES = [
  {
    cmd: "connect --with akilan",
    out: [
      "Initializing connection...",
      "",
      "[EMAIL]     " + person.email,
      "[PHONE]     " + person.phone,
      "[LINKEDIN]  akilan-balraman",
      "[GITHUB]    " + person.githubUser,
      "",
      "Connection ready.",
    ],
  },
];

/** [07] CONTACT: opening a connection. */
export function Contact() {
  const [armed, setArmed] = useState(false);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionTransition>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <p className="meta flex items-center gap-3 text-accent">
              <span>[07]</span>
              <span className="text-text">Contact</span>
            </p>
            <p className="meta hidden sm:block">
              sec-07 · /#contact · {person.availability.toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Reveal>
                <h2
                  id="contact-title"
                  className="max-w-[16ch] font-display text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[3.4rem]"
                >
                  Need someone who ships and keeps it running?
                </h2>
                <p className="mt-5 max-w-[46ch] text-[17px] text-muted">
                  {person.availability}. Email is fastest, and I reply to every
                  message.
                </p>
              </Reveal>
              <Reveal
                delay={0.1}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href={`mailto:${person.email}`}
                  onPointerEnter={() => setArmed(true)}
                  onPointerLeave={() => setArmed(false)}
                  onFocus={() => setArmed(true)}
                  onBlur={() => setArmed(false)}
                  data-cursor="OPEN"
                  className="group inline-flex h-12 items-center gap-2 border border-accent bg-accent px-6 font-mono text-[13px] tracking-[0.08em] text-bg uppercase transition-colors hover:bg-accent-strong"
                >
                  Start a conversation
                  <Arrow className="group-hover:translate-x-1" />
                </a>
                <a
                  href={person.phoneHref}
                  className="inline-flex h-12 items-center border border-line-strong px-6 font-mono text-[13px] tracking-[0.08em] text-text uppercase transition-colors hover:border-accent hover:text-accent"
                >
                  {person.phone}
                </a>
              </Reveal>
              <Reveal delay={0.15} className="mt-8">
                {/* Connection line that draws when the CTA is armed */}
                <svg
                  viewBox="0 0 320 24"
                  className="h-6 w-full max-w-[320px]"
                  aria-hidden
                >
                  <line x1="0" y1="12" x2="320" y2="12" stroke="var(--line)" />
                  <motion.line
                    x1="0"
                    y1="12"
                    x2="320"
                    y2="12"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: armed ? 1 : 0 }}
                    transition={{ duration: 0.5, ease }}
                  />
                  <circle cx="0" cy="12" r="3" fill="var(--accent)" />
                  <motion.circle
                    cx="320"
                    cy="12"
                    r="3"
                    fill="var(--accent)"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: armed ? 1 : 0.2 }}
                  />
                </svg>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12.5px] text-muted">
                  <li>
                    <a
                      href={person.github}
                      target="_blank"
                      rel="noreferrer"
                      className="link-ul hover:text-text"
                    >
                      github ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="link-ul hover:text-text"
                    >
                      linkedin ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href={person.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      className="link-ul hover:text-text"
                    >
                      leetcode ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href={person.resumePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="link-ul hover:text-text"
                    >
                      résumé.pdf ↗
                    </a>
                  </li>
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="lg:col-span-6">
              <Terminal entries={ENTRIES} title="connect" />
            </Reveal>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
