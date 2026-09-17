"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

type Mode = "default" | "hover" | "view";

/**
 * Custom cursor for fine pointers. A small dot follows the pointer exactly and a
 * ring lags behind on a spring. Interactive elements expand the ring; elements
 * marked data-cursor="view" show a label.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });
  const [mode, setMode] = useState<Mode>("default");
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
      const view = target?.closest("[data-cursor='view']");
      if (view) {
        setMode("view");
        return;
      }
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
      setMode(interactive ? "hover" : "default");
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

  const size = mode === "view" ? 72 : mode === "hover" ? 44 : 28;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text/60 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-bg"
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
        animate={{
          width: size,
          height: size,
          backgroundColor: mode === "view" ? "rgba(233,237,245,1)" : "rgba(233,237,245,0)",
          borderColor: mode === "default" ? "rgba(233,237,245,0.55)" : "rgba(233,237,245,0.9)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <AnimatePresence>
          {mode === "view" ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
            >
              View
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
