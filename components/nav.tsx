"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { nav, person } from "@/content/resume";
import { Magnetic } from "./motion/magnetic";

type SectionId = (typeof nav)[number]["id"];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    if (next !== solid) setSolid(next);
  });

  // Track the section in view on the home page.
  useEffect(() => {
    if (!isHome) return;
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
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

  // Close the mobile menu on route change and lock scroll while open.
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
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid || open ? "glass" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="Home">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent-2 font-display text-sm font-bold text-bg">
              {person.initials}
            </span>
            <span className="whitespace-nowrap font-display text-[17px] font-semibold tracking-tight">{person.name}</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = isHome && active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={hrefFor(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                        isActive ? "text-text" : "text-muted hover:text-text"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-surface-2"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Magnetic>
                <a
                  href={`mailto:${person.email}`}
                  className="inline-flex h-9 items-center rounded-full bg-text px-4 text-[14px] font-medium text-bg transition-colors hover:bg-accent hover:text-text"
                >
                  Contact
                </a>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-text transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-text transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-bg/[0.97] pt-24 backdrop-blur-md lg:hidden"
          >
            <nav aria-label="Mobile" className="px-6">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  >
                    <a
                      href={hrefFor(item.id)}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line py-4 font-display text-3xl font-semibold tracking-tight"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-muted"
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
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
