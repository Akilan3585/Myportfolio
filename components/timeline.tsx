"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { hueVar, timeline, type Hue, type TimelineItem } from "@/content/resume";
import { Reveal } from "./motion/reveal";
import { Section } from "./section";

const kindMeta: Record<TimelineItem["kind"], { label: string; hue: Hue }> = {
  education: { label: "education", hue: "blue" },
  certification: { label: "certification", hue: "violet" },
  internship: { label: "internship", hue: "mint" },
  project: { label: "project", hue: "blue" },
  hackathon: { label: "hackathon", hue: "amber" },
  award: { label: "award", hue: "rose" },
  now: { label: "now", hue: "mint" },
};

/** [04] EXPERIENCE: a deployment history tree whose trunk draws itself on scroll. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 70%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  return (
    <Section
      id="experience"
      index="04"
      eyebrow="Deployment history"
      title="Every release so far, in order."
      lede="Education, hackathons, the internship and both certifications."
      note={`${timeline.length} entries`}
    >
      <ol ref={ref} className="relative pl-8 sm:pl-10">
        <div aria-hidden className="absolute top-2 bottom-2 left-[9px] w-px bg-line sm:left-[13px]" />
        <motion.div aria-hidden className="absolute top-2 bottom-2 left-[9px] w-px origin-top bg-accent sm:left-[13px]" style={{ scaleY }} />

        {timeline.map((item, i) => {
          const meta = kindMeta[item.kind];
          const hue = hueVar[meta.hue];
          const last = i === timeline.length - 1;
          return (
            <li key={`${item.year}-${item.title}`} className="relative pb-8 last:pb-0">
              {/* Branch */}
              <span aria-hidden className="absolute top-3 -left-8 h-px w-6 bg-line-strong sm:-left-10 sm:w-8" />
              <span aria-hidden className="absolute top-[7px] -left-[27px] h-[9px] w-[9px] border bg-bg sm:-left-[31px]" style={{ borderColor: hue, background: last ? hue : "var(--bg)" }} />

              <Reveal y={12}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[12px]">
                  <span className="text-text">{item.year}</span>
                  <span className="tracking-[0.12em] uppercase" style={{ color: hue }}>
                    {meta.label}
                  </span>
                  <span className="text-faint">{last ? "HEAD" : `rel-${String(timeline.length - i).padStart(2, "0")}`}</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="text-[14px] text-muted">{item.org}</p>
                {item.detail ? <p className="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-muted">{item.detail}</p> : null}
                {item.href ? (
                  <p className="mt-2 font-mono text-[12.5px]">
                    <a href={item.href} target="_blank" rel="noreferrer" className="link-ul text-accent">
                      {item.kind === "internship" ? "internship letter ↗" : "view certificate ↗"}
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
