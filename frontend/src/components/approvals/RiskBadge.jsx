import { cn } from "@/lib/utils";

const riskTone = {
  Low: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Medium: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  High: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
};
const riskDot = { Low: "bg-emerald-500", Medium: "bg-amber-500", High: "bg-rose-500" };

export const RiskBadge = ({ risk, testId }) => (
  <span
    data-testid={testId}
    className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono", riskTone[risk] || riskTone.Medium)}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", riskDot[risk] || riskDot.Medium)} />
    {risk}
  </span>
);

const statusTone = {
  "Awaiting Approval": "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  Submitted: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
  "Awaiting Verifier": "bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
  "Awaiting Authorised Approver": "bg-violet-50 text-violet-800 border-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800",
  Approved: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Rejected: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
  Returned: "bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-900",
};

export const ApprovalStatus = ({ status, testId }) => (
  <span
    data-testid={testId}
    className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono whitespace-nowrap", statusTone[status] || statusTone.Submitted)}
  >
    {status}
  </span>
);
