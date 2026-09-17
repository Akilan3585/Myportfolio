import type { PipelineStep } from "@/content/resume";

type Props = {
  steps: PipelineStep[];
  hue: string;
  compact?: boolean;
  className?: string;
};

/**
 * Data-flow diagram: a row of nodes joined by animated dashed connectors.
 * Stacks vertically on small screens. Pure CSS animation, so it works in server components.
 */
export function Pipeline({ steps, hue, compact = false, className = "" }: Props) {
  return (
    <ol className={`flex flex-col md:flex-row md:items-stretch ${className}`} style={{ ["--hue" as string]: hue }} aria-label="System pipeline">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="flex min-w-0 flex-col md:flex-1 md:flex-row md:items-center">
            <div
              className={`relative flex-1 rounded-[4px] border bg-bg ${compact ? "px-3 py-2" : "px-4 py-3"}`}
              style={{
                borderColor: last ? hue : "var(--line-strong)",
                borderLeftWidth: 3,
                borderLeftColor: hue,
              }}
            >
              <p className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase">{String(i + 1).padStart(2, "0")}</p>
              <p className={`mt-0.5 font-mono font-medium leading-tight ${compact ? "text-[12.5px]" : "text-[14px]"} ${last ? "" : "text-text"}`} style={last ? { color: hue } : undefined}>
                {step.label}
              </p>
              <p className={`mt-0.5 leading-snug text-muted ${compact ? "text-[11px]" : "text-[12.5px]"}`}>{step.detail}</p>
            </div>

            {!last ? (
              <>
                <svg className={`hidden shrink-0 md:block ${compact ? "w-5" : "w-8"}`} height="20" viewBox="0 0 32 20" preserveAspectRatio="none" aria-hidden>
                  <line x1="0" y1="10" x2="32" y2="10" stroke={hue} strokeOpacity="0.8" strokeWidth="1.4" className="flow-line" style={{ animationDelay: `${i * 0.18}s` }} />
                </svg>
                <svg className="ml-4 h-5 w-4 md:hidden" viewBox="0 0 16 20" aria-hidden>
                  <line x1="8" y1="0" x2="8" y2="20" stroke={hue} strokeOpacity="0.8" strokeWidth="1.4" className="flow-line" style={{ animationDelay: `${i * 0.18}s` }} />
                </svg>
              </>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
