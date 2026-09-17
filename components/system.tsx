import { about, internship, site, terminal } from "@/content/resume";
import { Reveal } from "./motion/reveal";
import { ExternalLink, Section, StatusDot } from "./section";
import { Terminal } from "./terminal";

type Props = { githubLive: boolean; builtAt: string };

/** [01] SYSTEM: who this is, as a terminal session plus a status board. */
export function System({ githubLive, builtAt }: Props) {
  const board = [
    { name: "portfolio", value: `v${site.version} · built ${builtAt}`, tone: "green" as const },
    { name: "github feed", value: githubLive ? "connected · refreshed daily" : "unavailable · links only", tone: githubLive ? ("green" as const) : ("amber" as const) },
    { name: "availability", value: "open to internships", tone: "green" as const },
    { name: "résumé", value: "pdf attached", tone: "blue" as const },
  ];

  return (
    <Section id="system" index="01" eyebrow="System" title="Full-stack by trade, ops by habit." note="static board">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Terminal entries={terminal.whoami} title="akilan@portfolio: ~" className="h-full" />
        </Reveal>

        <div className="grid gap-6 lg:col-span-7">
          <Reveal delay={0.08}>
            <p className="max-w-[60ch] font-display text-[1.35rem] leading-[1.4] tracking-[-0.01em] sm:text-[1.6rem]">
              {about.statement.map((part, i) =>
                part.highlight ? (
                  <span key={i} className="border-b border-accent/60 font-medium text-text">
                    {part.text}
                  </span>
                ) : (
                  <span key={i} className="text-muted">
                    {part.text}
                  </span>
                ),
              )}
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {about.facts.map((f) => (
                <div key={f.label} className="border-l border-line-strong pl-4">
                  <dt className="meta">{f.label}</dt>
                  <dd className="mt-1.5 text-[14.5px] text-text">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal delay={0.12}>
              <article className="panel ticks h-full p-5">
                <p className="meta text-accent">most recent · {internship.year}</p>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
                  {internship.title} <span className="text-muted">@</span> {internship.org}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{internship.detail}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-[12px]">
                  <div className="border border-line bg-bg px-3 py-2">
                    <dd className="text-xl font-semibold text-text">60%</dd>
                    <dt className="text-faint">less manual deploy effort</dt>
                  </div>
                  <div className="border border-line bg-bg px-3 py-2">
                    <dd className="text-xl font-semibold text-text">5+</dd>
                    <dt className="text-faint">services on Kubernetes</dt>
                  </div>
                </dl>
                <p className="mt-4 text-[13px]">
                  <ExternalLink href={internship.href}>Internship letter</ExternalLink>
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="panel h-full p-5">
                <div className="flex items-center justify-between">
                  <p className="meta">system status</p>
                  <p className="meta text-faint/80">static, not live monitoring</p>
                </div>
                <ul className="mt-4 divide-y divide-line font-mono text-[12.5px]">
                  {board.map((row) => (
                    <li key={row.name} className="flex items-start gap-3 py-2.5">
                      <StatusDot tone={row.tone} live={row.tone === "green"} className="mt-1.5 shrink-0" />
                      <span className="w-28 shrink-0 text-muted uppercase tracking-[0.08em]">{row.name}</span>
                      <span className="min-w-0 text-text">{row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
