import type { ReactNode } from "react";
import { Reveal } from "./motion/reveal";

type SectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/** Standard section shell: numbered eyebrow, display title, optional lede. */
export function Section({ id, index, eyebrow, title, lede, children, className = "" }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="max-w-[70ch]">
          <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">
            <span>{index}</span>
            <span className="h-px w-8 bg-accent/50" aria-hidden />
            <span>{eyebrow}</span>
          </p>
          <h2
            id={`${id}-title`}
            className="mt-4 font-display text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[3rem]"
          >
            {title}
          </h2>
          {lede ? <p className="mt-4 max-w-[60ch] text-lg text-muted">{lede}</p> : null}
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`link-ul font-medium text-accent ${className}`}
    >
      {children}
    </a>
  );
}

export function Tag({ children, hue }: { children: ReactNode; hue?: string }) {
  return (
    <li
      className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11.5px] text-muted"
      style={hue ? { borderColor: `color-mix(in oklab, ${hue} 35%, transparent)`, color: hue } : undefined}
    >
      {children}
    </li>
  );
}
