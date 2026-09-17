import type { ReactNode } from "react";
import { SectionTransition } from "./motion/section-transition";

type SectionProps = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
  /** Optional note rendered in the metadata row, e.g. "static" or "live data". */
  note?: string;
};

/**
 * Section shell styled like a panel in a control surface: a thin top rule with
 * mono metadata (index, label, route) and a plain sans title.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  className = "",
  note,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-20 py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionTransition>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <p className="meta flex items-center gap-3 text-accent">
              <span>[{index}]</span>
              <span className="text-text">{eyebrow}</span>
            </p>
            <p className="meta hidden sm:block">
              sec-{index} · /#{id}
              {note ? ` · ${note}` : ""}
            </p>
          </div>
          <h2
            id={`${id}-title`}
            className="mt-6 max-w-[24ch] font-display text-[2rem] leading-[1.08] font-semibold tracking-[-0.02em] sm:text-[2.75rem]"
          >
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 max-w-[62ch] text-[17px] text-muted">{lede}</p>
          ) : null}
          <div className="mt-10 sm:mt-14">{children}</div>
        </SectionTransition>
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
      className="rounded-[3px] border border-line bg-bg px-2 py-0.5 font-mono text-[11.5px] text-muted"
      style={
        hue
          ? {
              borderColor: `color-mix(in oklab, ${hue} 40%, transparent)`,
              color: hue,
            }
          : undefined
      }
    >
      {children}
    </li>
  );
}

export function StatusDot({
  tone = "green",
  live = false,
  className = "",
}: {
  tone?: "green" | "amber" | "blue" | "faint";
  live?: boolean;
  className?: string;
}) {
  const color =
    tone === "green"
      ? "text-green"
      : tone === "amber"
        ? "text-amber"
        : tone === "blue"
          ? "text-accent"
          : "text-faint";
  return (
    <span
      aria-hidden
      className={`dot ${live ? "dot-live" : ""} ${color} ${className}`}
    />
  );
}
