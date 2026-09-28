import { cn } from "@/lib/utils";

const styles = {
  Verified:
    "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Active:
    "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
  Draft:
    "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
};

const dot = {
  Verified: "bg-emerald-500",
  Active: "bg-sky-500",
  Draft: "bg-amber-500",
};

export const StatusBadge = ({ status, className, testId }) => (
  <span
    data-testid={testId}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold font-mono tracking-wide",
      styles[status] || styles.Draft,
      className,
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", dot[status] || dot.Draft)} />
    {status}
  </span>
);
