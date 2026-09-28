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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { facilityTypes, facilityStatuses } from "@/data/mockFacilities";

const blank = {
  name: "",
  type: "Production Facility",
  country: "",
  address: "",
  status: "Onboarding",
  productionCapacity: "",
  operatingHours: "",
  managerName: "",
};

export const FacilityFormModal = ({ open, onOpenChange, facility, onSave }) => {
  const [form, setForm] = useState(blank);
  const isEdit = Boolean(facility);

  useEffect(() => {
    if (open) {
      setForm(
        facility
          ? {
              name: facility.name,
              type: facility.type,
              country: facility.country,
              address: facility.address,
              status: facility.status,
              productionCapacity: facility.productionCapacity || "",
              operatingHours: facility.operatingHours || "",
              managerName: facility.manager?.name || "",
            }
          : blank,
      );
    }
  }, [open, facility]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="facility-form-modal" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight">
            {isEdit ? "Edit Facility" : "Add Facility"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this operating location's details."
              : "Register a new physical operating location for the organisation."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2 py-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Facility Name</Label>
            <Input data-testid="facility-input-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Tema Processing Plant" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger data-testid="facility-select-type" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {facilityTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger data-testid="facility-select-status" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {facilityStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Country</Label>
            <Input data-testid="facility-input-country" value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g. Ghana" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Production Capacity</Label>
            <Input data-testid="facility-input-capacity" value={form.productionCapacity} onChange={(e) => set("productionCapacity", e.target.value)} placeholder="e.g. 84,000 tonnes / year" className="h-10" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Address</Label>
            <Textarea data-testid="facility-input-address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full physical address" className="min-h-[64px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Operating Hours</Label>
            <Input data-testid="facility-input-hours" value={form.operatingHours} onChange={(e) => set("operatingHours", e.target.value)} placeholder="e.g. 24/7 · 3 shifts" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Responsible Manager</Label>
            <Input data-testid="facility-input-manager" value={form.managerName} onChange={(e) => set("managerName", e.target.value)} placeholder="Manager name" className="h-10" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" data-testid="facility-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            data-testid="facility-save-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onSave(form, isEdit)}
            disabled={!form.name || !form.country}
          >
            {isEdit ? "Save Changes" : "Add Facility"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
