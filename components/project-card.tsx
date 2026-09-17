"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { hueVar, type Project } from "@/content/resume";
import { Arrow } from "./hero";
import { Reveal } from "./motion/reveal";
import { Pipeline } from "./pipeline";
import { ExternalLink, StatusDot, Tag } from "./section";

/** A project rendered as a deployed service: manifest on the left, live pipeline on the right. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hue = hueVar[project.hue];
  const href = `/projects/${project.slug}`;
  const live = project.status === "live";

  return (
    <Reveal delay={index * 0.05}>
      <article className="scan panel group relative overflow-hidden" style={{ ["--hue" as string]: hue }}>
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-5 py-3 font-mono text-[12px] sm:px-6">
          <p className="flex items-center gap-3">
            <span className="text-faint">service:</span>
            <span className="font-semibold tracking-[0.06em] text-text">{project.service}</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <StatusDot tone={live ? "green" : "blue"} live={live} />
              <span className="tracking-[0.08em] text-text uppercase">{live ? "live" : "source"}</span>
            </span>
            <span className="text-faint">{project.year}</span>
            <span className="text-faint">#{project.number}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 p-5 sm:p-6 lg:grid-cols-12 lg:gap-10">
          {/* Manifest */}
          <div className="lg:col-span-5">
            <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
              <h3 className="font-display text-[1.7rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2rem]">
                <Link href={href} data-cursor="VIEW SYSTEM" className="transition-colors hover:text-accent">
                  {project.title}
                </Link>
              </h3>
            </ViewTransition>
            <p className="mt-1 font-mono text-[12px] text-muted">{project.type}</p>

            <dl className="mt-5 grid gap-3 font-mono text-[12.5px]">
              {(
                [
                  ["input", project.io.input],
                  ["process", project.io.process],
                  ["output", project.io.output],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
                  <dt className="meta pt-0.5">{k}</dt>
                  <dd className="text-text/90">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
              {project.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
              <Link href={href} data-cursor="VIEW SYSTEM" className="group/l inline-flex items-center gap-2 font-mono text-[12.5px] tracking-[0.08em] text-text uppercase">
                View architecture
                <Arrow className="group-hover/l:translate-x-1" />
              </Link>
              {project.links.map((l) => (
                <ExternalLink key={l.href} href={l.href} className="font-mono text-[12.5px] tracking-[0.08em] uppercase">
                  {l.label}
                </ExternalLink>
              ))}
            </div>
          </div>

          {/* System diagram */}
          <div className="min-w-0 lg:col-span-7">
            <div className="ticks relative border border-line bg-bg-2 p-4">
              <div className="meta flex items-center justify-between pb-3">
                <span>system diagram</span>
                <ViewTransition name={`project-metric-${project.slug}`} share="morph" default="none">
                  <span className="font-semibold" style={{ color: hue }}>
                    {project.metric} · {project.metricLabel}
                  </span>
                </ViewTransition>
              </div>
              <Pipeline steps={project.pipeline} hue={hue} compact />
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 font-mono text-[11.5px] text-faint sm:grid-cols-4">
                <p>
                  <span className="text-muted">problem</span>
                  <span className="block truncate text-faint">{project.problem.split(".")[0]}.</span>
                </p>
                <p className="hidden sm:block">
                  <span className="text-muted">key feature</span>
                  <span className="block truncate">{project.keyFeature.split(":")[0]}</span>
                </p>
                <p className="hidden sm:block">
                  <span className="text-muted">steps</span>
                  <span className="block">{project.pipeline.length}</span>
                </p>
                <p className="text-right sm:text-left">
                  <span className="text-muted">state</span>
                  <span className="block" style={{ color: hue }}>
                    {live ? "serving" : "source available"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
