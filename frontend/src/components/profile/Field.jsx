export const Field = ({ label, value, mono = false, testId, span = false }) => (
  <div
    className={`flex flex-col gap-1 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 ${
      span ? "sm:col-span-2" : ""
    }`}
  >
    <span className="text-[11px] font-mono font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <span
      data-testid={testId}
      className={`text-sm text-slate-900 dark:text-slate-100 break-words ${
        mono ? "font-mono font-medium" : "font-medium"
      }`}
    >
      {value || <span className="text-slate-400 italic font-normal">Not provided</span>}
    </span>
  </div>
);
