import { person } from "@/content/resume";
import { getGitHubData, type Cell } from "@/lib/github";
import { Reveal } from "./motion/reveal";
import { ExternalLink, Section } from "./section";

const LEVEL = [
  "rgb(255 255 255 / 0.05)",
  "rgb(62 200 184 / 0.3)",
  "rgb(62 200 184 / 0.55)",
  "rgb(62 200 184 / 0.8)",
  "#3ec8b8",
];

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
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full"
      role="img"
      aria-label="GitHub contribution calendar for the last year"
    >
      {cells.map((c) => {
        const level =
          c.score === 0
            ? 0
            : Math.min(4, 1 + Math.floor((c.score / max) * 3.99));
        return (
          <rect
            key={c.date}
            x={(col.get(c.x) ?? 0) * (size + gap)}
            y={(row.get(c.y) ?? 0) * (size + gap)}
            width={size}
            height={size}
            rx={2.5}
            fill={LEVEL[level]}
          >
            <title>{`${c.date}: ${c.score} contribution${c.score === 1 ? "" : "s"}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

export async function GitHubActivity() {
  const data = await getGitHubData();

  return (
    <Section
      id="github"
      index="06"
      eyebrow="Live"
      title="What the commits say."
      lede={
        data
          ? `Pulled from GitHub and refreshed daily: ${data.user.public_repos} public repositories and the last year of contributions.`
          : "Everything on this page has source. Browse the repositories directly."
      }
    >
      {data ? (
        <div className="space-y-6">
          <Reveal className="min-w-0">
            <div className="panel overflow-hidden rounded-3xl p-5 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">
                    Contributions, last 12 months
                  </p>
                  <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
                    {data.totalContributions}
                  </p>
                </div>
                <ExternalLink href={data.user.html_url}>
                  @{data.user.login}
                </ExternalLink>
              </div>
              {data.cells.length > 0 ? (
                <div className="mt-5 overflow-x-auto">
                  <div className="min-w-[640px]">
                    <Calendar cells={data.cells} />
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.repos.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.05} className="min-w-0">
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="panel group flex h-full flex-col rounded-2xl p-5 transition-colors hover:border-accent/50"
                >
                  <p className="truncate font-mono text-[14px] font-medium text-text group-hover:text-accent">
                    {r.name}
                  </p>
                  <p className="mt-2 line-clamp-2 min-h-[2.6em] text-[13.5px] text-muted">
                    {r.description ?? "No description yet."}
                  </p>
                  <p className="mt-auto flex items-center gap-3 pt-4 font-mono text-[11.5px] text-faint">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full bg-accent"
                        aria-hidden
                      />
                      {r.language}
                    </span>
                    <span>
                      pushed{" "}
                      {new Date(r.pushed_at).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      ) : (
        <Reveal>
          <div className="panel flex flex-col items-start gap-4 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">
              Live GitHub data is unavailable right now.
            </p>
            <ExternalLink href={person.github}>
              Open GitHub profile
            </ExternalLink>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
