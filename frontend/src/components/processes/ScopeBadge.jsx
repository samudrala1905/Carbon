import { cn } from "@/lib/utils";

const tone = (scope) => {
  const s = String(scope);
  if (s.includes("1/2") || s.includes("2/1"))
    return "bg-gradient-to-r from-orange-100 to-sky-100 text-slate-800 border-slate-300 dark:from-orange-950/50 dark:to-sky-950/50 dark:text-slate-200 dark:border-slate-700";
  if (s.includes("1"))
    return "bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900";
  if (s.includes("2"))
    return "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900";
  if (s.includes("3"))
    return "bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900";
  return "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
};

export const ScopeBadge = ({ scope, className, testId }) => (
  <span
    data-testid={testId}
    className={cn(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-mono font-semibold tracking-wide whitespace-nowrap",
      tone(scope),
      className,
    )}
  >
    {scope}
  </span>
);
