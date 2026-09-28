import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, CalendarRange, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopNav } from "@/components/TopNav";
import { PeriodStatus } from "@/components/periods/PeriodStatus";
import { CreatePeriodModal } from "@/components/periods/CreatePeriodModal";
import { usePeriods } from "@/context/PeriodsContext";
import { useUsers } from "@/context/UsersContext";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const verifTone = (v) => {
  if (v === "Verified") return "text-emerald-700 dark:text-emerald-400";
  if (v === "In Review") return "text-sky-600 dark:text-sky-400";
  if (v === "Verification Pending" || v === "Recalculation Pending") return "text-amber-600 dark:text-amber-400";
  return "text-slate-400";
};

export default function ReportingPeriods() {
  const { periods, createPeriod } = usePeriods();
  const { hasPermission, actingRole } = useUsers();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const canCreate = hasPermission("Create");

  const handleCreate = (form) => {
    const created = createPeriod({ ...form, by: actingRole });
    setCreateOpen(false);
    toast.success("Reporting period created", { description: `${created.name} opened.` });
    navigate(`/periods/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Organisation → Carbon Accounting
            </span>
            <h1 data-testid="periods-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
              Reporting Periods
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Time boundaries for carbon accounting — with an audited OPEN → CLOSED lifecycle.
            </p>
          </div>
          <Button
            data-testid="create-period-button"
            onClick={() => canCreate && setCreateOpen(true)}
            disabled={!canCreate}
            className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11 px-5 w-full lg:w-auto disabled:opacity-50"
          >
            {canCreate ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Create Reporting Period
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table data-testid="periods-table">
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  {["Reporting Period", "Start", "End", "Facilities", "CCF Status", "Completeness", "Verification", "Status"].map((h) => (
                    <TableHead key={h} className="text-[11px] uppercase font-mono tracking-wider text-slate-500 whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    data-testid={`period-row-${p.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    onClick={() => navigate(`/periods/${p.id}`)}
                    className="cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  >
                    <TableCell className="py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">{p.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{p.type} · {p.id}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">{fmt(p.start)}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">{fmt(p.end)}</TableCell>
                    <TableCell className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">{p.facilities} facilities</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.ccfStatus}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${p.dataCompleteness >= 90 ? "bg-emerald-500" : p.dataCompleteness >= 70 ? "bg-amber-500" : "bg-slate-400"}`} style={{ width: `${p.dataCompleteness}%` }} />
                        </div>
                        <span className="text-xs font-mono text-slate-500">{p.dataCompleteness}%</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-xs font-mono font-semibold whitespace-nowrap ${verifTone(p.verificationStatus)}`}>{p.verificationStatus}</TableCell>
                    <TableCell><PeriodStatus status={p.status} /></TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <CreatePeriodModal open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
    </div>
  );
}
