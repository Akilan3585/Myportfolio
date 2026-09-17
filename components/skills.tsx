"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { hueVar, person, skillGraph } from "@/content/resume";
import { Section, Tag } from "./section";

const SIZE = 820;
const C = SIZE / 2;
const R_GROUP = 175;
const R_ITEM = 340;
const ARC = Math.PI * 0.42; // spread of items around each group

function polar(r: number, angle: number) {
  return { x: C + Math.cos(angle) * r, y: C + Math.sin(angle) * r };
}

export function Skills() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = hovered ?? pinned;

  const groups = skillGraph.map((g, gi) => {
    const angle = -Math.PI / 2 + (gi / skillGraph.length) * Math.PI * 2;
    const pos = polar(R_GROUP, angle);
    const items = g.items.map((item, ii) => {
      const t = g.items.length === 1 ? 0.5 : ii / (g.items.length - 1);
      const a = angle - ARC / 2 + t * ARC;
      return { label: item, ...polar(R_ITEM, a), angle: a };
    });
    return { ...g, angle, pos, items, index: gi };
  });

  return (
    <Section
      id="skills"
      index="02"
      eyebrow="Stack"
      title="The tools behind the systems."
      lede="Hover a cluster to focus it, click to pin it. Every node is something I have deployed with, not just read about."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
        {/* Graph (sm and up) */}
        <div className="panel relative hidden overflow-hidden rounded-3xl p-2 sm:block">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full" role="img" aria-label="Skill map">
            <defs>
              <radialGradient id="skill-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgb(124 140 255 / 0.25)" />
                <stop offset="100%" stopColor="rgb(124 140 255 / 0)" />
              </radialGradient>
            </defs>
            <circle cx={C} cy={C} r={R_ITEM + 40} fill="url(#skill-glow)" />
            <circle cx={C} cy={C} r={R_GROUP} fill="none" stroke="var(--line)" strokeDasharray="2 6" />
            <circle cx={C} cy={C} r={R_ITEM} fill="none" stroke="var(--line)" strokeDasharray="2 6" />

            {groups.map((g) => {
              const dim = active !== null && active !== g.index;
              const hue = hueVar[g.hue];
              return (
                <motion.g
                  key={g.name}
                  animate={{ opacity: dim ? 0.18 : 1 }}
                  transition={{ duration: 0.35 }}
                  onPointerEnter={() => setHovered(g.index)}
                  onPointerLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  <line x1={C} y1={C} x2={g.pos.x} y2={g.pos.y} stroke={hue} strokeOpacity={0.5} strokeWidth={1.2} />
                  {g.items.map((it) => (
                    <line
                      key={it.label}
                      x1={g.pos.x}
                      y1={g.pos.y}
                      x2={it.x}
                      y2={it.y}
                      stroke={hue}
                      strokeOpacity={active === g.index ? 0.55 : 0.22}
                      strokeWidth={1}
                    />
                  ))}
                  {g.items.map((it, ii) => (
                    <motion.g
                      key={it.label}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4 + (ii % 3), repeat: Infinity, ease: "easeInOut", delay: ii * 0.3 }}
                    >
                      <circle cx={it.x} cy={it.y} r={active === g.index ? 6 : 4.5} fill={hue} />
                      <text
                        x={it.x + (Math.cos(it.angle) >= 0 ? 12 : -12)}
                        y={it.y + 4}
                        textAnchor={Math.cos(it.angle) >= 0 ? "start" : "end"}
                        fontSize={13}
                        fill="var(--text)"
                        fillOpacity={active === g.index ? 1 : 0.75}
                        fontFamily="var(--font-geist-mono)"
                      >
                        {it.label}
                      </text>
                    </motion.g>
                  ))}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-pressed={pinned === g.index}
                    aria-label={`${g.name}: ${g.items.join(", ")}`}
                    onClick={() => setPinned((p) => (p === g.index ? null : g.index))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPinned((p) => (p === g.index ? null : g.index));
                      }
                    }}
                    onFocus={() => setHovered(g.index)}
                    onBlur={() => setHovered(null)}
                    style={{ outline: "none" }}
                  >
                    <circle cx={g.pos.x} cy={g.pos.y} r={34} fill="var(--bg)" stroke={hue} strokeWidth={active === g.index ? 2 : 1.2} />
                    <circle cx={g.pos.x} cy={g.pos.y} r={34} fill={hue} fillOpacity={active === g.index ? 0.18 : 0.08} />
                    <text
                      x={g.pos.x}
                      y={g.pos.y + 4}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={600}
                      fill="var(--text)"
                      fontFamily="var(--font-geist)"
                    >
                      {g.name}
                    </text>
                  </g>
                </motion.g>
              );
            })}

            <circle cx={C} cy={C} r={54} fill="var(--bg)" stroke="var(--line-strong)" />
            <circle cx={C} cy={C} r={54} fill="url(#skill-glow)" />
            <text x={C} y={C - 4} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--text)" fontFamily="var(--font-bricolage)">
              {person.initials}
            </text>
            <text x={C} y={C + 14} textAnchor="middle" fontSize={10} fill="var(--muted)" fontFamily="var(--font-geist-mono)" letterSpacing={1.5}>
              OPS × WEB
            </text>
          </svg>
        </div>

        {/* Detail panel / mobile list */}
        <div className="space-y-3">
          {skillGraph.map((g, i) => {
            const expanded = active === null || active === i;
            const hue = hueVar[g.hue];
            return (
              <div
                key={g.name}
                className="panel rounded-2xl p-5 transition-colors"
                style={active === i ? { borderColor: `color-mix(in oklab, ${hue} 45%, transparent)` } : undefined}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => setPinned((p) => (p === i ? null : i))}
                  aria-expanded={expanded}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: hue }} aria-hidden />
                  <span className="font-display text-lg font-semibold tracking-tight">{g.name}</span>
                  <span className="ml-auto font-mono text-[12px] text-faint">{g.items.length}</span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-wrap gap-1.5 overflow-hidden pt-3"
                    >
                      {g.items.map((item) => (
                        <Tag key={item} hue={active === i ? hue : undefined}>
                          {item}
                        </Tag>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
