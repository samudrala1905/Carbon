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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROLE_NAMES, ROLES } from "@/data/mockUsers";
import { useFacilities } from "@/context/FacilitiesContext";

export const FacilityAccessPicker = ({ value, onChange }) => {
  const { facilities } = useFacilities();
  const allSelected = value.includes("All Facilities");

  const toggleAll = () => onChange(allSelected ? [] : ["All Facilities"]);
  const toggleOne = (name) => {
    const next = value.includes("All Facilities") ? [] : [...value];
    if (next.includes(name)) onChange(next.filter((n) => n !== name));
    else onChange([...next, name]);
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-44 overflow-y-auto">
      <label className="flex items-center gap-2.5 px-3 py-2 cursor-pointer bg-slate-50/60 dark:bg-slate-800/40">
        <Checkbox checked={allSelected} onCheckedChange={toggleAll} data-testid="facility-access-all" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">All Facilities</span>
      </label>
      {facilities.map((f) => (
        <label key={f.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer">
          <Checkbox
            checked={!allSelected && value.includes(f.name)}
            disabled={allSelected}
            onCheckedChange={() => toggleOne(f.name)}
            data-testid={`facility-access-${f.id}`}
          />
          <span className={`text-sm ${allSelected ? "text-slate-400" : "text-slate-700 dark:text-slate-300"}`}>{f.name}</span>
        </label>
      ))}
    </div>
  );
};

export const InviteUserModal = ({ open, onOpenChange, onInvite }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "Viewer", facilityAccess: [] });

  useEffect(() => {
    if (open) setForm({ name: "", email: "", role: "Viewer", facilityAccess: [] });
  }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="invite-user-modal" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight">Invite User</DialogTitle>
          <DialogDescription>Send an invitation and assign an initial role & facility access.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Full Name</Label>
            <Input data-testid="invite-input-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Jordan Blake" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Email</Label>
            <Input data-testid="invite-input-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@company.com" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Role</Label>
            <Select value={form.role} onValueChange={(v) => set("role", v)}>
              <SelectTrigger data-testid="invite-select-role" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_NAMES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">{ROLES[form.role].description}</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Facility Access</Label>
            <FacilityAccessPicker value={form.facilityAccess} onChange={(v) => set("facilityAccess", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" data-testid="invite-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            data-testid="invite-send-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onInvite(form)}
            disabled={!form.name || !form.email}
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
