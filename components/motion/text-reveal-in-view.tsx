"use client";

import { motion } from "motion/react";

type Props = {
  text: string;
  className?: string;
  id?: string;
  as?: "h1" | "h2" | "p";
  highlight?: string[];
};

/** Same word-mask reveal as TextReveal, but triggered when scrolled into view. */
export function TextRevealInView({ text, className, id, as = "h2", highlight = [] }: Props) {
  const words = text.split(" ");
  const Tag = as;
  return (
    <Tag id={id} className={className} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[^\w%+-]/g, "").toLowerCase();
        const isHighlight = highlight.map((h) => h.toLowerCase()).includes(clean);
        return (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
            <motion.span
              className={`inline-block ${isHighlight ? "text-gradient" : ""}`}
              initial={{ y: "110%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.07 }}
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
