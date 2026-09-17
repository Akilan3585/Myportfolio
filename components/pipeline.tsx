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
    <ol
      className={`flex flex-col md:flex-row md:items-stretch ${className}`}
      style={{ ["--hue" as string]: hue }}
      aria-label="System pipeline"
    >
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.label} className="flex flex-col md:flex-1 md:flex-row md:items-center">
            <div
              className={`relative flex-1 rounded-xl border bg-bg/60 ${compact ? "px-3 py-2.5" : "px-4 py-3.5"} ${
                last ? "pulse-ring" : ""
              }`}
              style={{
                borderColor: last ? hue : "var(--line)",
                color: last ? hue : undefined,
                boxShadow: last ? `0 0 0 1px color-mix(in oklab, ${hue} 30%, transparent), 0 10px 30px -14px ${hue}` : undefined,
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className={`mt-0.5 font-medium leading-tight ${compact ? "text-[13px]" : "text-[15px]"} ${last ? "" : "text-text"}`}>
                {step.label}
              </p>
              <p className={`mt-0.5 leading-snug text-muted ${compact ? "text-[11px]" : "text-[12.5px]"}`}>{step.detail}</p>
            </div>

            {!last ? (
              <>
                {/* Horizontal connector */}
                <svg
                  className={`hidden shrink-0 md:block ${compact ? "w-6" : "w-9"}`}
                  height="24"
                  viewBox="0 0 36 24"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <line
                    x1="0"
                    y1="12"
                    x2="36"
                    y2="12"
                    stroke={hue}
                    strokeOpacity="0.8"
                    strokeWidth="1.5"
                    className="flow-line"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                </svg>
                {/* Vertical connector */}
                <svg className="ml-5 h-6 w-4 md:hidden" viewBox="0 0 16 24" aria-hidden>
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="24"
                    stroke={hue}
                    strokeOpacity="0.8"
                    strokeWidth="1.5"
                    className="flow-line"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                </svg>
              </>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
