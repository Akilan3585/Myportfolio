"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "span";
} & Omit<HTMLMotionProps<"div">, "children">;

/** Fade-and-rise when the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = false,
  once = true,
  className,
  as = "div",
  ...rest
}: RevealProps) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.75, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Staggers direct children that are `motion` elements using the `item` variants. */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
