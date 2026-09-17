"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { hueVar, timeline, type Hue, type TimelineItem } from "@/content/resume";
import { Reveal } from "./motion/reveal";
import { Section } from "./section";

const kindMeta: Record<TimelineItem["kind"], { label: string; hue: Hue }> = {
  education: { label: "Education", hue: "blue" },
  certification: { label: "Certification", hue: "violet" },
  internship: { label: "Internship", hue: "mint" },
  project: { label: "Project", hue: "blue" },
  hackathon: { label: "Hackathon", hue: "amber" },
  award: { label: "Milestone", hue: "rose" },
  now: { label: "Now", hue: "mint" },
};

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  return (
    <Section
      id="experience"
      index="04"
      eyebrow="Path"
      title="School to cluster, in order."
      lede="Education, hackathons, the internship and both certifications, in the order they happened."
    >
      <ol ref={ref} className="relative">
        {/* Track */}
        <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          aria-hidden
          className="absolute left-[11px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent md:left-1/2 md:-translate-x-1/2"
          style={{ scaleY }}
        />

        {timeline.map((item, i) => {
          const meta = kindMeta[item.kind];
          const hue = hueVar[meta.hue];
          const left = i % 2 === 0;
          return (
            <li
              key={`${item.year}-${item.title}`}
              className="relative grid gap-4 pb-12 pl-10 last:pb-0 md:grid-cols-[1fr_48px_1fr] md:pl-0"
            >
              {/* Dot */}
              <span
                aria-hidden
                className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center md:left-1/2 md:-translate-x-1/2"
              >
                <span className="absolute h-6 w-6 rounded-full" style={{ background: `color-mix(in oklab, ${hue} 18%, transparent)` }} />
                <span className="relative h-2.5 w-2.5 rounded-full border-2 border-bg" style={{ background: hue }} />
              </span>

              <Reveal
                className={`md:col-span-1 ${left ? "md:col-start-1 md:text-right" : "md:col-start-3"}`}
                y={18}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-faint">
                  <span style={{ color: hue }}>{meta.label}</span>
                  <span className="mx-2 text-line-strong">/</span>
                  {item.year}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight">{item.title}</h3>
                <p className="mt-1 text-muted">{item.org}</p>
                {item.detail ? <p className={`mt-3 max-w-[52ch] text-[15px] text-muted ${left ? "md:ml-auto" : ""}`}>{item.detail}</p> : null}
                {item.href ? (
                  <p className="mt-2 text-[14px]">
                    <a href={item.href} target="_blank" rel="noreferrer" className="link-ul font-medium text-accent">
                      {item.kind === "internship" ? "Internship letter" : "View certificate"}
                    </a>
                  </p>
                ) : null}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
