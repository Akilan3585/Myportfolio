"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type TermEntry = { cmd: string; out: string[] };

type Props = {
  entries: TermEntry[];
  title?: string;
  prompt?: string;
  className?: string;
  /** Characters per second while typing a command. */
  speed?: number;
};

/**
 * Terminal window that types each command when scrolled into view, then prints
 * its output. Under reduced motion everything is printed at once.
 */
export function Terminal({ entries, title = "bash", prompt = "$", className = "", speed = 28 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();
  const total = entries.length;
  // step: index of the entry being typed; typed: chars typed of that entry.
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const done = reduced || step >= total;

  useEffect(() => {
    if (!inView || reduced || step >= total) return;
    const cmd = entries[step].cmd;
    if (typed < cmd.length) {
      const t = setTimeout(() => setTyped((v) => v + 1), 1000 / speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setTyped(0);
    }, 260);
    return () => clearTimeout(t);
  }, [inView, reduced, step, typed, entries, total, speed]);

  const sr = entries.map((e) => `${prompt} ${e.cmd}\n${e.out.join("\n")}`).join("\n");

  return (
    <div ref={ref} className={`term overflow-hidden ${className}`}>
      <div className="term-bar">
        <span>{title}</span>
      </div>
      <pre className="sr-only">{sr}</pre>
      <div className="px-4 py-3 text-[13px] sm:px-5" aria-hidden>
        {entries.map((e, i) => {
          if (!done && i > step) return null;
          const typing = !done && i === step;
          const cmdText = typing ? e.cmd.slice(0, typed) : e.cmd;
          const showOut = done || i < step;
          return (
            <div key={e.cmd} className={i > 0 ? "mt-3" : ""}>
              <p className="text-muted">
                <span className="text-accent">{prompt}</span> <span className={`text-text ${typing ? "caret" : ""}`}>{cmdText}</span>
              </p>
              {showOut
                ? e.out.map((line, j) => (
                    <p key={j} className="whitespace-pre-wrap text-text/90">
                      {line}
                    </p>
                  ))
                : null}
            </div>
          );
        })}
        {done ? (
          <p className="mt-3 text-muted">
            <span className="text-accent">{prompt}</span> <span className="caret" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
