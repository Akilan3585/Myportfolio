"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type Mode = { kind: "default" | "hover" | "label"; label?: string };

/**
 * Technical cursor for fine pointers: a small square dot with a lagging ring.
 * Elements with data-cursor="<LABEL>" show the label (e.g. VIEW SYSTEM, INSPECT).
 * Disabled on touch devices and under reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });
  const [mode, setMode] = useState<Mode>({ kind: "default" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.dataset.cursor = "on";

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) {
        setMode({ kind: "label", label: labelled.dataset.cursor });
        return;
      }
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label, summary");
      setMode({ kind: interactive ? "hover" : "default" });
    }
    function onLeave() {
      setVisible(false);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete root.dataset.cursor;
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode.kind === "label" ? 28 : mode.kind === "hover" ? 34 : 22;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-text"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-text/50"
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
        animate={{ width: size, height: size, borderColor: mode.kind === "default" ? "rgba(230,232,235,0.45)" : "rgba(47,155,255,0.9)" }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      />
      <AnimatePresence>
        {mode.kind === "label" ? (
          <motion.span
            aria-hidden
            key={mode.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none fixed top-0 left-0 z-[70] translate-x-4 translate-y-4 border border-accent/60 bg-bg px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-accent uppercase"
            style={{ x: rx, y: ry }}
          >
            {mode.label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </>
  );
}
