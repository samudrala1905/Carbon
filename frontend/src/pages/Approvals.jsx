import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Inbox, Send, CheckCircle2, XCircle, Clock3, Eye } from "lucide-react";
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
import { RiskBadge, ApprovalStatus } from "@/components/approvals/RiskBadge";
import { ApprovalDetailModal } from "@/components/approvals/ApprovalDetailModal";
import { useApprovals } from "@/context/ApprovalsContext";
import { useUsers } from "@/context/UsersContext";
import { IN_FLIGHT } from "@/data/mockApprovals";

const daysUntil = (d) => (d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null);

const SummaryTile = ({ icon: Icon, label, value, active, onClick, tone, testId }) => (
  <button
    data-testid={testId}
    onClick={onClick}
    className={`text-left rounded-xl border p-4 transition-all ${
      active
        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500/40"
        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
    }`}
  >
    <div className="flex items-center justify-between">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></div>
      <span className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">{value}</span>
    </div>
    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mt-2">{label}</div>
  </button>
);

export default function Approvals() {
  const { approvals, act } = useApprovals();
  const { hasPermission, actingRole } = useUsers();
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState("pending");

  const canActOn = (r) => hasPermission(r.requiredPermission);
  const isSod = (r) => r.submittedByRole === actingRole; // same person who prepared cannot self-approve

  const buckets = {
    pending: approvals.filter((r) => IN_FLIGHT.includes(r.status) && canActOn(r) && !isSod(r)),
    submitted: approvals.filter((r) => IN_FLIGHT.includes(r.status)),
    approved: approvals.filter((r) => r.status === "Approved"),
    rejected: approvals.filter((r) => r.status === "Rejected" || r.status === "Returned"),
    expiring: approvals.filter((r) => IN_FLIGHT.includes(r.status) && daysUntil(r.expiryDate) !== null && daysUntil(r.expiryDate) <= 14),
  };

  const rows = buckets[filter] || approvals;

  const handleDecision = (id, decision, comment) => {
    if ((decision === "return" || decision === "reject") && !comment.trim()) {
      toast.error("A comment is required to return or reject.");
      return;
    }
    act(id, decision, actingRole, comment);
    setDetail(null);
    const label = { approve: "approved", return: "returned for correction", reject: "rejected" }[decision];
    toast.success(`Request ${label}`, { description: `${id} · ${label} by ${actingRole}.` });
  };

  const openDetail = (r) => setDetail(r);
  const current = detail ? approvals.find((r) => r.id === detail.id) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Organisation → Governance</span>
          <h1 data-testid="approvals-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">Approvals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and action carbon data changes — with segregation of duties enforced. Acting as <span className="font-semibold text-slate-700 dark:text-slate-200">{actingRole}</span>.
          </p>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryTile testId="tile-pending" icon={Inbox} label="Pending My Approval" value={buckets.pending.length} tone="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" active={filter === "pending"} onClick={() => setFilter("pending")} />
          <SummaryTile testId="tile-submitted" icon={Send} label="Submitted" value={buckets.submitted.length} tone="bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300" active={filter === "submitted"} onClick={() => setFilter("submitted")} />
          <SummaryTile testId="tile-approved" icon={CheckCircle2} label="Approved" value={buckets.approved.length} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" active={filter === "approved"} onClick={() => setFilter("approved")} />
          <SummaryTile testId="tile-rejected" icon={XCircle} label="Rejected / Returned" value={buckets.rejected.length} tone="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" active={filter === "rejected"} onClick={() => setFilter("rejected")} />
          <SummaryTile testId="tile-expiring" icon={Clock3} label="Expiring" value={buckets.expiring.length} tone="bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300" active={filter === "expiring"} onClick={() => setFilter("expiring")} />
        </div>

        {/* Queue */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table data-testid="approval-queue">
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  {["Request", "Type", "Facility / Product", "Submitted By", "Submitted", "Risk", "Status", "Action"].map((h) => (
                    <TableHead key={h} className="text-[11px] uppercase font-mono tracking-wider text-slate-500 whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => {
                  const expDays = daysUntil(r.expiryDate);
                  return (
                    <motion.tr
                      key={r.id}
                      data-testid={`approval-row-${r.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <TableCell className="py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">{r.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">{r.id}{expDays !== null && expDays <= 14 && IN_FLIGHT.includes(r.status) ? ` · expires in ${expDays}d` : ""}</div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{r.type}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{r.target}</TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap">{r.submittedBy}</div>
                        <div className="text-[11px] font-mono text-slate-400">{r.submittedByRole}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">{r.submittedDate}</TableCell>
                      <TableCell><RiskBadge risk={r.risk} /></TableCell>
                      <TableCell><ApprovalStatus status={r.status} /></TableCell>
                      <TableCell>
                        <Button data-testid={`review-button-${r.id}`} size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => openDetail(r)}>
                          <Eye className="h-3.5 w-3.5" /> Review
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {rows.length === 0 && <div className="text-center py-12 text-slate-400 font-mono text-sm">No requests in this view.</div>}
        </div>
      </div>

      <ApprovalDetailModal
        open={Boolean(detail)}
        onOpenChange={(o) => !o && setDetail(null)}
        request={current}
        actingRole={actingRole}
        canAct={current ? canActOn(current) : false}
        sod={current ? isSod(current) : false}
        onDecision={handleDecision}
      />
    </div>
  );
}
