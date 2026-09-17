"use client";

import { person } from "@/content/resume";
import { ContactParticles } from "./contact-particles";
import { Arrow } from "./hero";
import { Magnetic } from "./motion/magnetic";
import { Reveal } from "./motion/reveal";
import { TextRevealInView } from "./motion/text-reveal-in-view";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-24 overflow-hidden py-28 sm:py-40">
      <ContactParticles className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-[60ch] text-center">
          <p className="flex items-center justify-center gap-3 font-mono text-[12px] tracking-[0.2em] text-accent uppercase">
            <span>07</span>
            <span className="h-px w-8 bg-accent/50" aria-hidden />
            <span>Contact</span>
          </p>
        </Reveal>
        <TextRevealInView
          as="h2"
          id="contact-title"
          text="Need someone who ships and keeps it running?"
          highlight={["ships", "running?"]}
          className="mx-auto mt-5 max-w-[16ch] text-center font-display text-[2.5rem] leading-[1.02] font-bold tracking-[-0.03em] sm:text-[4rem]"
        />
        <Reveal delay={0.2} className="mx-auto mt-6 max-w-[48ch] text-center text-lg text-muted">
          <p>{person.availability}. Email is fastest, and I reply to every message.</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a
              href={`mailto:${person.email}`}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-text px-7 text-[15px] font-medium text-bg transition-colors hover:bg-accent"
            >
              {person.email}
              <Arrow className="group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={person.phoneHref}
              className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 text-[15px] font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {person.phone}
            </a>
          </Magnetic>
        </Reveal>
        <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[13px] text-muted">
          <a href={person.github} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
            GitHub
          </a>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
            LinkedIn
          </a>
          <a href={person.leetcode} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
            LeetCode
          </a>
          <a href={person.resumePdf} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
            Résumé (PDF)
          </a>
        </Reveal>
      </div>
    </section>
  );
}
