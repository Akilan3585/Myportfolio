"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  as?: "h1" | "h2" | "p";
  /** Words to render with the gradient treatment. */
  highlight?: string[];
};

/** Word-by-word mask reveal with a blur-to-sharp settle. */
export function TextReveal({ text, className, style, delay = 0, as = "h1", highlight = [] }: Props) {
  const words = text.split(" ");
  const Tag = as;
  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[^\w%+-]/g, "").toLowerCase();
        const isHighlight = highlight.map((h) => h.toLowerCase()).includes(clean);
        return (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
            <motion.span
              className={`inline-block will-change-transform ${isHighlight ? "text-gradient" : ""}`}
              initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                ease: [0.2, 0.7, 0.2, 1],
                delay: delay + i * 0.06,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}
