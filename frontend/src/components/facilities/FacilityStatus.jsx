import { cn } from "@/lib/utils";

const styles = {
  Active: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Onboarding: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  Inactive: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
};
const dot = {
  Active: "bg-emerald-500",
  Onboarding: "bg-amber-500",
  Inactive: "bg-slate-400",
};

export const FacilityStatus = ({ status, className, testId }) => (
  <span
    data-testid={testId}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono tracking-wide",
      styles[status] || styles.Inactive,
      className,
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", dot[status] || dot.Inactive)} />
    {status}
  </span>
);

const readinessStyles = {
  "Audit-Ready": "text-emerald-700 dark:text-emerald-400",
  "In Progress": "text-amber-600 dark:text-amber-400",
  Setup: "text-slate-500 dark:text-slate-400",
};

export const ReadinessPill = ({ readiness }) => (
  <span className={cn("text-xs font-semibold font-mono", readinessStyles[readiness] || readinessStyles.Setup)}>
    {readiness}
  </span>
);
