import { person } from "@/content/resume";
import type { Cell, GitHubData } from "@/lib/github";
import { Reveal } from "./motion/reveal";
import { ExternalLink, Section } from "./section";

const LEVEL = ["rgb(255 255 255 / 0.05)", "rgb(47 155 255 / 0.3)", "rgb(47 155 255 / 0.55)", "rgb(47 155 255 / 0.8)", "#2f9bff"];

function Calendar({ cells }: { cells: Cell[] }) {
  if (cells.length === 0) return null;
  const xs = Array.from(new Set(cells.map((c) => c.x))).sort((a, b) => a - b);
  const ys = Array.from(new Set(cells.map((c) => c.y))).sort((a, b) => a - b);
  const col = new Map(xs.map((x, i) => [x, i]));
  const row = new Map(ys.map((y, i) => [y, i]));
  const size = 11;
  const gap = 3;
  const w = xs.length * (size + gap);
  const h = ys.length * (size + gap);
  const max = Math.max(1, ...cells.map((c) => c.score));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="GitHub contribution calendar for the last year">
      {cells.map((c) => {
        const level = c.score === 0 ? 0 : Math.min(4, 1 + Math.floor((c.score / max) * 3.99));
        return (
          <rect key={c.date} x={(col.get(c.x) ?? 0) * (size + gap)} y={(row.get(c.y) ?? 0) * (size + gap)} width={size} height={size} rx={2} fill={LEVEL[level]}>
            <title>{`${c.date}: ${c.score} contribution${c.score === 1 ? "" : "s"}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function pad(s: string, n: number) {
  return s.length >= n ? s.slice(0, n - 1) + "…" : s + " ".repeat(n - s.length);
}

/** [06] SOURCE: a repository terminal fed by real GitHub data, or links only. */
export function GitHubActivity({ data }: { data: GitHubData | null }) {
  return (
    <Section
      id="source"
      index="06"
      eyebrow="Source code"
      title="What the repositories say."
      lede={
        data
          ? `Pulled from GitHub at build time and refreshed daily: ${data.user.public_repos} public repositories and the last year of contributions.`
          : "Live GitHub data is unavailable right now, so this section only links out. Nothing here is made up."
      }
      note={data ? "live data" : "offline"}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="term h-full overflow-hidden">
            <div className="term-bar">
              <span>gh repo list {person.githubUser}</span>
            </div>
            <div className="overflow-x-auto px-4 py-3 sm:px-5">
              <p className="text-muted">
                <span className="text-accent">$</span> gh repo list {person.githubUser} --limit {data ? data.repos.length : 0} --sort pushed
              </p>
              {data ? (
                <table className="mt-2 w-full border-collapse font-mono text-[12.5px]">
                  <thead className="sr-only">
                    <tr>
                      <th>Repository</th>
                      <th>Language</th>
                      <th>Last push</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.repos.map((r) => (
                      <tr key={r.name} className="group">
                        <td className="py-1 pr-4 whitespace-pre">
                          <a href={r.html_url} target="_blank" rel="noreferrer" className="link-ul text-text group-hover:text-accent">
                            {pad(`${person.githubUser}/${r.name}`, 34)}
                          </a>
                        </td>
                        <td className="py-1 pr-4 whitespace-pre text-muted">{pad(r.language ?? "", 12)}</td>
                        <td className="py-1 whitespace-pre text-faint">
                          {new Date(r.pushed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-2 text-amber">error: GitHub API unavailable. Open the profile instead.</p>
              )}
              <p className="mt-3 text-muted">
                <span className="text-accent">$</span> <span className="caret" />
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0 lg:col-span-5">
          <div className="panel ticks h-full p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="meta">contributions · last 12 months</p>
                <p className="mt-1 font-display text-3xl font-semibold tracking-tight">{data ? data.totalContributions : "—"}</p>
              </div>
              <ExternalLink href={person.github} className="font-mono text-[12.5px]">
                @{person.githubUser} ↗
              </ExternalLink>
            </div>
            {data && data.cells.length > 0 ? (
              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[520px]">
                  <Calendar cells={data.cells} />
                </div>
              </div>
            ) : (
              <p className="mt-5 font-mono text-[12.5px] text-muted">Calendar unavailable.</p>
            )}
            {data ? (
              <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 font-mono text-[12px]">
                <div>
                  <dt className="meta">repos</dt>
                  <dd className="mt-1 text-text">{data.user.public_repos}</dd>
                </div>
                <div>
                  <dt className="meta">followers</dt>
                  <dd className="mt-1 text-text">{data.user.followers}</dd>
                </div>
                <div>
                  <dt className="meta">since</dt>
                  <dd className="mt-1 text-text">{new Date(data.user.created_at).getFullYear()}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
