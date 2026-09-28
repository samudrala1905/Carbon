import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  Paperclip,
  MessageSquare,
  History,
  ShieldAlert,
  Check,
  Undo2,
  X,
  User,
  Lock,
} from "lucide-react";
import { RiskBadge, ApprovalStatus } from "@/components/approvals/RiskBadge";
import { IN_FLIGHT } from "@/data/mockApprovals";

const Block = ({ icon: Icon, title, children }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold font-heading text-slate-900 dark:text-slate-100 flex items-center gap-2">
      <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {title}
    </h3>
    {children}
  </div>
);

export const ApprovalDetailModal = ({ open, onOpenChange, request, actingRole, canAct, sod, onDecision }) => {
  const [comment, setComment] = useState("");
  useEffect(() => { if (open) setComment(""); }, [open, request]);
  if (!request) return null;

  const inFlight = IN_FLIGHT.includes(request.status);
  const actionable = inFlight && canAct && !sod;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="approval-detail-modal" className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400">{request.id} · {request.type}</span>
            <RiskBadge risk={request.risk} />
            <ApprovalStatus status={request.status} />
          </div>
          <DialogTitle className="font-heading text-xl tracking-tight mt-1">{request.title}</DialogTitle>
          <DialogDescription>{request.target}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[52vh]">
          <div className="px-6 py-5 space-y-5">
            {/* What changed */}
            <Block icon={ArrowRight} title="What Changed">
              <div className="space-y-2" data-testid="what-changed">
                {request.changed.map((c) => (
                  <div key={c.field} className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">{c.field}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-slate-400 line-through">{c.oldValue}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{c.newValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Block>

            {/* Evidence */}
            <Block icon={Paperclip} title="Supporting Evidence">
              <div className="flex flex-wrap gap-2">
                {request.evidence.map((e) => (
                  <span key={e.name} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                    <Paperclip className="h-3.5 w-3.5 text-slate-400" /> {e.name}
                    <span className="text-[10px] text-slate-400">· {e.type}</span>
                  </span>
                ))}
              </div>
            </Block>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Submitted by</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{request.submittedBy}</span>
              <span className="text-[11px] font-mono text-slate-400">({request.submittedByRole})</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs text-slate-500">{request.submittedDate}</span>
            </div>

            <Separator />

            {/* Comments */}
            <Block icon={MessageSquare} title="Comments">
              <div className="space-y-2">
                {request.comments.map((c, i) => (
                  <div key={i} className="rounded-lg bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{c.by} <span className="font-mono text-[10px] text-slate-400">({c.role})</span></span>
                      <span className="font-mono text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </Block>

            {/* Approval history */}
            <Block icon={History} title="Approval History">
              <div className="space-y-0">
                {request.history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.action}</span>
                    <span className="text-xs text-slate-500">by {h.by}</span>
                    <span className="font-mono text-[10px] text-slate-400 ml-auto">{h.date}</span>
                  </div>
                ))}
              </div>
            </Block>
          </div>
        </ScrollArea>

        {/* SoD / action footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
          {sod && inFlight && (
            <div data-testid="sod-warning" className="flex items-start gap-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-3">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 dark:text-rose-300">
                <span className="font-semibold">Segregation of duties:</span> you prepared/submitted this request as {actingRole} and cannot self-approve it. It must be actioned by a different authorised approver.
              </div>
            </div>
          )}
          {!canAct && inFlight && !sod && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5" /> Your role ({actingRole}) lacks {request.requiredPermission} permission for this request.
            </div>
          )}
          {inFlight ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                data-testid="decision-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (required for return/reject)…"
                className="h-10 flex-1"
                disabled={!actionable}
              />
              <div className="flex gap-2">
                <Button data-testid="reject-button" variant="outline" disabled={!actionable} onClick={() => onDecision(request.id, "reject", comment)} className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-40">
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button data-testid="return-button" variant="outline" disabled={!actionable} onClick={() => onDecision(request.id, "return", comment)} className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40">
                  <Undo2 className="h-4 w-4" /> Return
                </Button>
                <Button data-testid="approve-button" disabled={!actionable} onClick={() => onDecision(request.id, "approve", comment)} className="gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-40">
                  <Check className="h-4 w-4" /> Approve
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 font-mono">This request is {request.status.toLowerCase()} — no further action.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
