import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Arrow } from "@/components/hero";
import { Reveal } from "@/components/motion/reveal";
import { Pipeline } from "@/components/pipeline";
import { ExternalLink, StatusDot, Tag } from "@/components/section";
import { hueVar, person, projects } from "@/content/resume";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.kind}. ${project.problem}`,
    openGraph: { title: `${project.title} · ${person.name}`, description: project.solution },
  };
}

function Manifest({ p }: { p: (typeof projects)[number] }) {
  const lines = [
    "apiVersion: portfolio/v1",
    "kind: Service",
    "metadata:",
    `  name: ${p.service}`,
    `  year: "${p.year}"`,
    `  status: ${p.status}`,
    "spec:",
    `  type: ${p.type}`,
    "  stack:",
    ...p.stack.map((s) => `    - ${s}`),
    "  links:",
    ...p.links.map((l) => `    - ${l.label.toLowerCase()}: ${l.href}`),
  ];
  return (
    <div className="term overflow-hidden">
      <div className="term-bar">
        <span>{p.service}.yaml</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[12.5px] leading-[1.7] text-text/90 sm:px-5">
        {lines.map((l, i) => {
          const [k, ...rest] = l.split(":");
          const hasVal = rest.length > 0 && !l.trim().startsWith("-");
          return (
            <span key={i} className="block">
              {hasVal ? (
                <>
                  <span className="text-accent-2">{k}</span>:{rest.join(":")}
                </>
              ) : (
                <span className={l.trim().startsWith("-") ? "text-muted" : "text-accent-2"}>{l}</span>
              )}
            </span>
          );
        })}
      </pre>
    </div>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const hue = hueVar[project.hue];
  const live = project.status === "live";

  return (
    <main id="main" className="flex-1 pt-24 pb-24 sm:pt-28">
      <article className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="meta flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <Link href="/#projects" className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
            <Arrow className="rotate-180 group-hover:-translate-x-1" />
            deployed systems
          </Link>
          <span>
            service #{project.number} · /projects/{project.slug}
          </span>
        </div>

        <header className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px]">
              <span className="flex items-center gap-2">
                <StatusDot tone={live ? "green" : "blue"} live={live} />
                <span className="tracking-[0.1em] text-text uppercase">{live ? "live" : "source"}</span>
              </span>
              <span className="text-muted">{project.type}</span>
              <span className="text-faint">{project.year}</span>
            </p>
            <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
              <h1 className="mt-4 font-display text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-[3.6rem]">{project.title}</h1>
            </ViewTransition>
            <p className="mt-5 max-w-[62ch] text-[17px] text-muted">{project.solution}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              {project.links.map((l) => (
                <ExternalLink key={l.href} href={l.href} className="font-mono text-[12.5px] tracking-[0.08em] uppercase">
                  {l.label} ↗
                </ExternalLink>
              ))}
            </div>
            <ViewTransition name={`project-metric-${project.slug}`} share="morph" default="none">
              <p className="mt-8 inline-block border border-line bg-bg px-4 py-3 font-mono text-[13px]">
                <span className="font-semibold" style={{ color: hue }}>
                  {project.metric}
                </span>
                <span className="text-muted"> · {project.metricLabel}</span>
              </p>
            </ViewTransition>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <Manifest p={project} />
          </div>
        </header>

        <Reveal className="mt-14">
          <p className="meta">system diagram · how it flows</p>
          <div className="ticks panel mt-3 p-4 sm:p-6">
            <Pipeline steps={project.pipeline} hue={hue} />
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="meta">problem</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-4">
            <h2 className="meta">solution</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{project.solution}</p>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4">
            <h2 className="meta">key technical feature</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-text">{project.keyFeature}</p>
          </Reveal>
        </div>

        <Reveal className="mt-12 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
          {(
            [
              ["input", project.io.input],
              ["process", project.io.process],
              ["output", project.io.output],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <h2 className="meta">{k}</h2>
              <p className="mt-2 font-mono text-[13px] text-text/90">{v}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="meta">stack</h2>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
            {project.stack.map((s) => (
              <Tag key={s} hue={hue}>
                {s}
              </Tag>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-16 border-t border-line pt-8">
          <p className="meta">next service</p>
          <Link
            href={`/projects/${next.slug}`}
            data-cursor="VIEW SYSTEM"
            className="group mt-3 inline-flex items-center gap-3 font-display text-[1.8rem] font-semibold tracking-tight transition-colors hover:text-accent sm:text-[2.2rem]"
          >
            {next.title}
            <Arrow className="h-6 w-6 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </article>
    </main>
  );
}
