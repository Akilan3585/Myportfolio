"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { hueVar, type Project } from "@/content/resume";
import { Arrow } from "./hero";
import { Reveal } from "./motion/reveal";
import { Tilt } from "./motion/tilt";
import { Pipeline } from "./pipeline";
import { ExternalLink, Tag } from "./section";

export function ProjectCard({ project, flip }: { project: Project; flip: boolean }) {
  const hue = hueVar[project.hue];
  const href = `/projects/${project.slug}`;

  return (
    <article className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Visual */}
      <Reveal className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Tilt className="rounded-3xl">
          <Link
            href={href}
            data-cursor="view"
            aria-label={`Open case study: ${project.title}`}
            className="panel relative block overflow-hidden rounded-3xl p-5 sm:p-7"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: `radial-gradient(closest-side, ${hue}, transparent 70%)`, filter: "blur(30px)" }}
            />
            <div className="relative flex items-start justify-between gap-6">
              <ViewTransition name={`project-metric-${project.slug}`} share="morph" default="none">
                <div>
                  <p
                    className="font-display text-[3rem] font-bold leading-none tracking-[-0.03em] sm:text-[3.75rem]"
                    style={{ color: hue, fontVariationSettings: '"opsz" 96, "wdth" 86' }}
                  >
                    {project.metric}
                  </p>
                  <p className="mt-2 max-w-[22ch] text-sm text-muted">{project.metricLabel}</p>
                </div>
              </ViewTransition>
              <p className="font-mono text-[12px] tracking-[0.2em] text-faint">{project.number}</p>
            </div>

            <div className="relative mt-8 transition-transform duration-500 group-hover:translate-x-1">
              <Pipeline steps={project.pipeline} hue={hue} compact />
            </div>

            <div className="relative mt-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              <span>{project.kind}</span>
              <span className="flex items-center gap-2 text-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Open case study <Arrow />
              </span>
            </div>
          </Link>
        </Tilt>
      </Reveal>

      {/* Copy */}
      <Reveal delay={0.1} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: hue }}>
          {project.number} · {project.kind}
        </p>
        <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
          <h3 className="mt-3 font-display text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.4rem]">
            <Link href={href} className="hover:text-accent transition-colors">
              {project.title}
            </Link>
          </h3>
        </ViewTransition>
        <dl className="mt-5 space-y-4">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Problem</dt>
            <dd className="mt-1 text-[15.5px] text-muted">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Key technical feature</dt>
            <dd className="mt-1 text-[15.5px]">{project.keyFeature}</dd>
          </div>
        </dl>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
          <Link href={href} className="group/l inline-flex items-center gap-2 font-medium text-text">
            Case study
            <Arrow className="group-hover/l:translate-x-1" />
          </Link>
          {project.links.map((l) => (
            <ExternalLink key={l.href} href={l.href}>
              {l.label}
            </ExternalLink>
          ))}
        </div>
      </Reveal>
    </article>
  );
}
