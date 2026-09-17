"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const LINES = [
  "INITIALIZING PORTFOLIO...",
  "[OK] Loading developer profile",
  "[OK] Loading deployed systems",
  "[OK] Loading infrastructure map",
  "[OK] Establishing connection",
  "SYSTEM READY",
];

const STEP_MS = 170;
const KEY = "akilan-boot-seen";

/**
 * Short boot sequence shown once per session (about 1.2s). Skipped for repeat
 * visits in the same tab, under reduced motion, and on click or keypress.
 */
export function Boot() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen || reduced) {
      // Deferred so the effect does not set state synchronously.
      const t = window.setTimeout(() => setShow(false), 0);
      return () => clearTimeout(t);
    }
    document.documentElement.dataset.boot = "on";
    const timers: number[] = [];
    LINES.forEach((_, i) => timers.push(window.setTimeout(() => setCount(i + 1), (i + 1) * STEP_MS)));
    timers.push(window.setTimeout(() => finish(), LINES.length * STEP_MS + 320));
    function finish() {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setShow(false);
    }
    function skip() {
      timers.forEach(clearTimeout);
      finish();
    }
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [reduced]);

  useEffect(() => {
    if (!show) delete document.documentElement.dataset.boot;
  }, [show]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="boot"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[90] flex items-center bg-bg px-6"
        >
          <div className="mx-auto w-full max-w-[520px] font-mono text-[13px] leading-[1.9] sm:text-[14px]">
            {LINES.slice(0, count).map((line, i) => {
              const ok = line.startsWith("[OK]");
              const last = i === LINES.length - 1;
              return (
                <p key={line} className={last ? "mt-3 text-text" : ok ? "text-muted" : "text-faint"}>
                  {ok ? (
                    <>
                      <span className="text-green">[OK]</span>
                      {line.slice(4)}
                    </>
                  ) : (
                    line
                  )}
                </p>
              );
            })}
            {count < LINES.length ? <p className="caret text-faint" /> : null}
            <p className="meta mt-8 text-faint/70">press any key to skip</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
