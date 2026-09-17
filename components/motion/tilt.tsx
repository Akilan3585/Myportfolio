"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number;
};

/** Subtle 3D tilt plus a pointer-following sheen. Disabled on touch and reduced motion. */
export function Tilt({ children, className, max = 5 }: Props) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const active = fine && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgb(255 255 255 / 0.07), transparent 60%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      className={`group/tilt relative ${className ?? ""}`}
      style={{
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      {active ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{ background: sheen }}
        />
      ) : null}
    </motion.div>
  );
}
