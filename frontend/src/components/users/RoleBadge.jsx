import { cn } from "@/lib/utils";
import { ROLES } from "@/data/mockUsers";

export const RoleBadge = ({ role, className, testId }) => (
  <span
    data-testid={testId}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono tracking-wide whitespace-nowrap",
      ROLES[role]?.tone || ROLES.Viewer.tone,
      className,
    )}
  >
    {role}
  </span>
);

const statusTone = {
  Active: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Invited: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  Suspended: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
};
const dot = { Active: "bg-emerald-500", Invited: "bg-amber-500", Suspended: "bg-rose-500" };

export const UserStatus = ({ status, testId }) => (
  <span
    data-testid={testId}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono",
      statusTone[status] || statusTone.Invited,
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", dot[status] || dot.Invited)} />
    {status}
  </span>
);
