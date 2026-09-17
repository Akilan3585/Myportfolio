import { person, projects } from "@/content/resume";

export type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  topics?: string[];
};

export type GitHubUser = {
  login: string;
  html_url: string;
  public_repos: number;
  followers: number;
  created_at: string;
  avatar_url: string;
};

export type Cell = { date: string; score: number; x: number; y: number };

export type GitHubData = {
  user: GitHubUser;
  repos: Repo[];
  cells: Cell[];
  totalContributions: number;
};

const headers = {
  "User-Agent": `${person.githubUser}-portfolio`,
  Accept: "application/vnd.github+json",
};

const IGNORE = new Set([person.githubUser.toLowerCase(), "portfolio", "my_portfolio", "powerbi-session-oct-2025"]);

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers, next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchCalendar(): Promise<Cell[]> {
  try {
    const res = await fetch(`https://ghchart.rshah.org/3ec8b8/${person.githubUser}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const svg = await res.text();
    const cells: Cell[] = [];
    const re = /data-score="(\d+)"\s+data-date="([\d-]+)"\s+x="([\d.]+)"\s+y="([\d.]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(svg))) {
      cells.push({ score: Number(m[1]), date: m[2], x: Number(m[3]), y: Number(m[4]) });
    }
    return cells;
  } catch {
    return [];
  }
}

export async function getGitHubData(): Promise<GitHubData | null> {
  const [user, repos, cells] = await Promise.all([
    fetchJson<GitHubUser>(`https://api.github.com/users/${person.githubUser}`),
    fetchJson<Repo[]>(`https://api.github.com/users/${person.githubUser}/repos?per_page=100&sort=pushed`),
    fetchCalendar(),
  ]);
  if (!user || !repos) return null;

  const featured = new Set(projects.map((p) => p.repo?.toLowerCase()).filter(Boolean));
  const filtered = repos
    .filter((r) => !r.fork && r.language && !IGNORE.has(r.name.toLowerCase()))
    .sort((a, b) => {
      const fa = featured.has(a.name.toLowerCase()) ? 1 : 0;
      const fb = featured.has(b.name.toLowerCase()) ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    })
    .slice(0, 6);

  return {
    user,
    repos: filtered,
    cells,
    totalContributions: cells.reduce((sum, c) => sum + c.score, 0),
  };
}
