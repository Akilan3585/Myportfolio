import { person } from "@/content/resume";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-8 font-mono text-[12.5px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {person.name}. Built with Next.js, Tailwind and Motion, deployed on Vercel.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={person.github} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
              GitHub
            </a>
          </li>
          <li>
            <a href={person.linkedin} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={person.leetcode} target="_blank" rel="noreferrer" className="link-ul hover:text-text">
              LeetCode
            </a>
          </li>
          <li>
            <a href="#top" className="link-ul hover:text-text">
              Back to top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
