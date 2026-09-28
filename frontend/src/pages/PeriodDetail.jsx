import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarRange,
  ShieldCheck,
  History,
  Lock,
  ArrowRight,
  AlertTriangle,
  GitBranch,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import { Field } from "@/components/profile/Field";
import { PeriodStatus, LifecycleStepper } from "@/components/periods/PeriodStatus";
import { usePeriods } from "@/context/PeriodsContext";
import { useUsers } from "@/context/UsersContext";
import { LIFECYCLE, TRANSITION_PERMISSION, TRANSITION_LABEL } from "@/data/mockPeriods";

const Card = ({ className = "", children }) => (
  <section className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5 ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ icon: Icon, children }) => (
  <h2 className="text-base font-semibold font-heading tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
    <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {children}
  </h2>
);

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

export default function PeriodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPeriod, advanceStatus, requestCorrection } = usePeriods();
  const { hasPermission, actingRole } = useUsers();
  const period = getPeriod(id);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!period) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
        <TopNav />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-slate-500 font-mono">Reporting period "{id}" not found.</p>
          <Button className="mt-4 bg-emerald-800 hover:bg-emerald-900 text-white" onClick={() => navigate("/periods")}>Back to Periods</Button>
        </div>
      </div>
    );
  }

  const isTerminal = period.status === "CLOSED";
  const nextPerm = TRANSITION_PERMISSION[period.status];
  const nextLabel = TRANSITION_LABEL[period.status];
  const canAdvance = nextPerm ? hasPermission(nextPerm) : false;
  const isLockedForData = LIFECYCLE.indexOf(period.status) >= LIFECYCLE.indexOf("VERIFIED");
  const canCorrect = hasPermission("Edit");

  const handleAdvance = () => {
    advanceStatus(period.id, actingRole);
    const idx = LIFECYCLE.indexOf(period.status);
    toast.success(`Period moved to ${LIFECYCLE[idx + 1]}`, {
      description: period.status === "VERIFIED" ? "Period closed and locked." : `${period.name} advanced.`,
    });
  };

  const handleCorrection = () => {
    requestCorrection(period.id, reason || "unspecified correction", actingRole);
    setCorrectionOpen(false);
    setReason("");
    toast.success("Recalculation version created", {
      description: "A controlled correction version was logged — original figures preserved.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <Link to="/periods" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400">
              <ArrowLeft className="h-3.5 w-3.5" /> Reporting Periods
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400">{period.id} · {period.type}</span>
              <PeriodStatus status={period.status} testId="period-detail-status" />
            </div>
            <h1 data-testid="period-detail-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
              {period.name}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" /> {fmt(period.start)} – {fmt(period.end)}
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            {nextLabel && (
              canAdvance ? (
                <Button
                  data-testid="advance-status-button"
                  onClick={handleAdvance}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11"
                >
                  {period.status === "VERIFIED" ? <Lock className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  {nextLabel}
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <Button data-testid="advance-status-button" disabled className="bg-emerald-800 text-white gap-2 h-11 disabled:opacity-50">
                          <Lock className="h-4 w-4" /> {nextLabel}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Role "{actingRole}" needs {nextPerm} permission.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            )}
            {isTerminal && <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5"><Lock className="h-3 w-3" /> Period closed</span>}
          </div>
        </div>

        {/* Lifecycle */}
        <Card>
          <SectionTitle icon={CalendarRange}>Audited Lifecycle</SectionTitle>
          <LifecycleStepper status={period.status} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Flow: OPEN → DATA LOCKED → SUBMITTED → VERIFIED → CLOSED. Each transition requires a specific role permission.
          </p>
        </Card>

        {/* Data-lock warning after VERIFIED */}
        {isLockedForData && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            data-testid="data-lock-banner"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">Underlying data is locked</div>
                <div className="text-xs text-amber-700 dark:text-amber-300/80">
                  This period is {period.status}. Data cannot be changed silently — any correction creates a controlled recalculation version.
                </div>
              </div>
            </div>
            {canCorrect ? (
              <Button
                variant="outline"
                data-testid="request-correction-button"
                onClick={() => setCorrectionOpen(true)}
                className="gap-2 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-300"
              >
                <GitBranch className="h-4 w-4" /> Request Correction
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button variant="outline" disabled data-testid="request-correction-button" className="gap-2 disabled:opacity-50">
                        <Lock className="h-4 w-4" /> Request Correction
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Role "{actingRole}" cannot request corrections (needs Edit).</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7">
            <SectionTitle icon={Building2}>Period Summary</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Period Type" value={period.type} />
              <Field label="Facilities Included" value={`${period.facilities} facilities`} mono />
              <Field label="Start Date" value={fmt(period.start)} mono />
              <Field label="End Date" value={fmt(period.end)} mono />
              <Field label="CCF Status" value={period.ccfStatus} />
              <Field label="Verification Status" value={period.verificationStatus} />
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Data Completeness</span>
                <span className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">{period.dataCompleteness}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${period.dataCompleteness >= 90 ? "bg-emerald-500" : period.dataCompleteness >= 70 ? "bg-amber-500" : "bg-slate-400"}`} style={{ width: `${period.dataCompleteness}%` }} />
              </div>
            </div>
          </Card>

          {/* Version history */}
          <Card className="lg:col-span-5">
            <SectionTitle icon={History}>Version & Recalculation History</SectionTitle>
            <div className="overflow-x-auto -mx-2">
              <Table data-testid="version-history-table">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {["Ver", "Change", "By", "Date"].map((h) => (
                      <TableHead key={h} className="text-[10px] uppercase font-mono tracking-wider text-slate-500">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...period.versions].reverse().map((v) => (
                    <TableRow key={v.version} className="border-slate-100 dark:border-slate-800">
                      <TableCell className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">v{v.version}</TableCell>
                      <TableCell className="text-xs text-slate-700 dark:text-slate-300 max-w-[180px]">{v.note}</TableCell>
                      <TableCell className="text-[11px] font-mono text-slate-500 whitespace-nowrap">{v.by}</TableCell>
                      <TableCell className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{fmt(v.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {/* Correction dialog */}
      <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
        <DialogContent data-testid="correction-modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl tracking-tight flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-amber-600" /> Request Correction
            </DialogTitle>
            <DialogDescription>
              Creates a new recalculation version for a verified period. Original figures are preserved for audit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Reason for correction</Label>
            <Input data-testid="correction-input-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Updated Scope 2 grid emission factor" className="h-10" />
          </div>
          <DialogFooter>
            <Button variant="outline" data-testid="correction-cancel-button" onClick={() => setCorrectionOpen(false)}>Cancel</Button>
            <Button data-testid="correction-submit-button" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleCorrection}>
              Create Recalculation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
