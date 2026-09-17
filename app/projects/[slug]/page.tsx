import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Arrow } from "@/components/hero";
import { Reveal } from "@/components/motion/reveal";
import { Pipeline } from "@/components/pipeline";
import { ExternalLink, Tag } from "@/components/section";
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

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const hue = hueVar[project.hue];

  return (
    <main id="main" className="flex-1 pt-28 pb-24 sm:pt-36">
      <article className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Link href="/#projects" className="group inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-text">
          <Arrow className="rotate-180 group-hover:-translate-x-1" />
          All projects
        </Link>

        <header className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-[12px] tracking-[0.2em] uppercase" style={{ color: hue }}>
              {project.number} · {project.kind} · {project.year}
            </p>
            <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
              <h1
                className="mt-4 font-display text-[2.6rem] leading-[1] font-bold tracking-[-0.03em] sm:text-[4rem]"
                style={{ fontVariationSettings: '"opsz" 96, "wdth" 92' }}
              >
                {project.title}
              </h1>
            </ViewTransition>
            <p className="mt-6 max-w-[62ch] text-lg text-muted">{project.solution}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
              {project.links.map((l) => (
                <ExternalLink key={l.href} href={l.href}>
                  {l.label}
                </ExternalLink>
              ))}
            </div>
          </div>
          <ViewTransition name={`project-metric-${project.slug}`} share="morph" default="none">
            <div className="panel rounded-3xl p-6 lg:col-span-4">
              <p
                className="font-display text-[3.5rem] leading-none font-bold tracking-[-0.03em]"
                style={{ color: hue, fontVariationSettings: '"opsz" 96, "wdth" 86' }}
              >
                {project.metric}
              </p>
              <p className="mt-3 text-muted">{project.metricLabel}</p>
            </div>
          </ViewTransition>
        </header>

        <Reveal className="mt-16">
          <h2 className="font-mono text-[12px] tracking-[0.2em] text-faint uppercase">How it flows</h2>
          <div className="panel mt-4 rounded-3xl p-5 sm:p-7">
            <Pipeline steps={project.pipeline} hue={hue} />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="font-mono text-[12px] tracking-[0.2em] text-faint uppercase">Problem</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4">
            <h2 className="font-mono text-[12px] tracking-[0.2em] text-faint uppercase">Solution</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{project.solution}</p>
          </Reveal>
          <Reveal delay={0.16} className="lg:col-span-4">
            <h2 className="font-mono text-[12px] tracking-[0.2em] text-faint uppercase">Key technical feature</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-text">{project.keyFeature}</p>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <h2 className="font-mono text-[12px] tracking-[0.2em] text-faint uppercase">Stack</h2>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
            {project.stack.map((s) => (
              <Tag key={s} hue={hue}>
                {s}
              </Tag>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-20 border-t border-line pt-10">
          <p className="font-mono text-[12px] tracking-[0.2em] text-faint uppercase">Next project</p>
          <Link href={`/projects/${next.slug}`} className="group mt-3 inline-flex items-center gap-3 font-display text-[2rem] font-semibold tracking-tight transition-colors hover:text-accent sm:text-[2.5rem]">
            {next.title}
            <Arrow className="h-6 w-6 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </article>
    </main>
  );
}
