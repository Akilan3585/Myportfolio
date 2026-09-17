"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { nav, person } from "@/content/resume";
import { StatusDot } from "./section";

type SectionId = (typeof nav)[number]["id"];

/** Control-panel navigation: indexed links, an animated active marker, and a status readout. */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 16;
    if (next !== solid) setSolid(next);
  });

  useEffect(() => {
    if (!isHome) return;
    const sections = nav.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best as SectionId | null);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          solid || open ? "border-line bg-bg/95" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 font-mono text-[13px] tracking-[0.08em]" aria-label="Home">
            <span className="flex h-6 w-6 items-center justify-center border border-accent/60 text-[10px] font-semibold text-accent">
              {person.initials}
            </span>
            <span className="text-text">
              akilan<span className="text-faint">.b</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item, i) => {
                const isActive = isHome && active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={hrefFor(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative flex items-center gap-2 px-3 py-1.5 font-mono text-[11.5px] tracking-[0.14em] uppercase transition-colors ${
                        isActive ? "text-text" : "text-muted hover:text-text"
                      }`}
                    >
                      <span className="text-faint">[{String(i + 1).padStart(2, "0")}]</span>
                      <span className="relative">{item.label}</span>
                      {isActive ? (
                        <motion.span
                          layoutId="nav-marker"
                          className="absolute inset-x-3 -bottom-px h-px bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <p className="meta hidden items-center gap-2 lg:flex">
              <span className="text-faint">status</span>
              <StatusDot tone="green" live />
              <span className="text-text">online</span>
            </p>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-9 w-9 items-center justify-center border border-line lg:hidden"
            >
              <span className={`absolute h-px w-4 bg-text transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-4 bg-text transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg pt-20 lg:hidden"
          >
            <nav aria-label="Mobile" className="px-6">
              <ul className="border-t border-line">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.3 }}
                  >
                    <a
                      href={hrefFor(item.id)}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-line py-4 font-mono"
                    >
                      <span className="text-[12px] text-faint">[{String(i + 1).padStart(2, "0")}]</span>
                      <span className="text-2xl tracking-[0.06em] text-text uppercase">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[13px] text-muted"
              >
                <a href={person.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={person.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={person.resumePdf} target="_blank" rel="noreferrer">
                  Résumé
                </a>
              </motion.div>
              <p className="meta mt-8 flex items-center gap-2">
                <span>status</span>
                <StatusDot tone="green" live />
                <span className="text-text">online</span>
              </p>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
