import { cn } from "@/lib/utils";
import { LIFECYCLE } from "@/data/mockPeriods";

const tone = {
  OPEN: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  "DATA LOCKED": "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  SUBMITTED: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
  VERIFIED: "bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
  CLOSED: "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export const PeriodStatus = ({ status, className, testId }) => (
  <span
    data-testid={testId}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold font-mono tracking-wider",
      tone[status] || tone.OPEN,
      className,
    )}
  >
    {status}
  </span>
);

export const LifecycleStepper = ({ status }) => {
  const currentIdx = LIFECYCLE.indexOf(status);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1" data-testid="lifecycle-stepper">
      {LIFECYCLE.map((stage, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={stage} className="flex items-center gap-1 shrink-0">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold transition-colors",
                active
                  ? "border-emerald-500 bg-emerald-600 text-white"
                  : done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-white" : done ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")} />
              {stage}
            </div>
            {i < LIFECYCLE.length - 1 && (
              <span className={cn("h-px w-4 shrink-0", done ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700")} />
            )}
          </div>
        );
      })}
    </div>
  );
};
