"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Scroll-entry transition for a whole section: the top rule draws across, then
 * the content settles in from a slight offset and blur. Runs once per section.
 * Motion's reducedMotion="user" config (see Providers) disables the movement.
 */
export function SectionTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
      className={`relative ${className}`}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-accent"
        variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: [0, 1, 0], transition: { duration: 1.1, ease } } }}
      />
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
          show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease, delay: 0.1 } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
