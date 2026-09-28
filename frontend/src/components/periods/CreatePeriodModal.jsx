import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PERIOD_TYPES } from "@/data/mockPeriods";
import { useFacilities } from "@/context/FacilitiesContext";

const y = new Date().getFullYear();

const presetFor = (type) => {
  switch (type) {
    case "Monthly":
      return { name: `${new Date().toLocaleString("en", { month: "short" })} ${y}`, start: `${y}-06-01`, end: `${y}-06-30` };
    case "Quarterly":
      return { name: `Q2 ${y}`, start: `${y}-04-01`, end: `${y}-06-30` };
    case "Financial Year":
      return { name: `FY ${y}`, start: `${y}-01-01`, end: `${y}-12-31` };
    case "Calendar Year":
      return { name: `CY ${y}`, start: `${y}-01-01`, end: `${y}-12-31` };
    default:
      return { name: `Custom ${y}`, start: "", end: "" };
  }
};

export const CreatePeriodModal = ({ open, onOpenChange, onCreate }) => {
  const { facilities } = useFacilities();
  const [form, setForm] = useState({ type: "Financial Year", ...presetFor("Financial Year"), facilities: facilities.length });

  useEffect(() => {
    if (open) setForm({ type: "Financial Year", ...presetFor("Financial Year"), facilities: facilities.length });
  }, [open, facilities.length]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const changeType = (type) => setForm((f) => ({ ...f, type, ...presetFor(type) }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="create-period-modal" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight">Create Reporting Period</DialogTitle>
          <DialogDescription>Define the time boundary for carbon accounting. Opens in OPEN state.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2 py-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Period Type</Label>
            <Select value={form.type} onValueChange={changeType}>
              <SelectTrigger data-testid="period-select-type" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERIOD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Period Name</Label>
            <Input data-testid="period-input-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. FY 2027" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Start Date</Label>
            <Input data-testid="period-input-start" type="date" value={form.start} onChange={(e) => set("start", e.target.value)} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">End Date</Label>
            <Input data-testid="period-input-end" type="date" value={form.end} onChange={(e) => set("end", e.target.value)} className="h-10" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Facilities Included</Label>
            <Input data-testid="period-input-facilities" type="number" min="1" value={form.facilities} onChange={(e) => set("facilities", Number(e.target.value))} className="h-10" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" data-testid="period-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            data-testid="period-create-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onCreate(form)}
            disabled={!form.name || !form.start || !form.end}
          >
            Create Period
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
