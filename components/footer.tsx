import { person, site } from "@/content/resume";

export function Footer({ builtAt }: { builtAt: string }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-6 font-mono text-[12px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {person.name} · v{site.version} · built {builtAt} · Next.js, Tailwind, Motion, Vercel
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={person.github} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
              github
            </a>
          </li>
          <li>
            <a href={person.linkedin} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
              linkedin
            </a>
          </li>
          <li>
            <a href={person.leetcode} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
              leetcode
            </a>
          </li>
          <li>
            <a href="#top" className="link-ul hover:text-text">
              top ↑
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
