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
import { processStatuses } from "@/data/mockProcesses";
import { useFacilities } from "@/context/FacilitiesContext";

const scopeOptions = ["Scope 1", "Scope 2", "Scope 1/2", "Scope 3"];

const Group = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</Label>
    {children}
  </div>
);

export const ProcessFormModal = ({ open, onOpenChange, defaultFacilityId, onSave }) => {
  const { facilities } = useFacilities();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (open) {
      const fid = defaultFacilityId || facilities[0]?.id || "";
      const fac = facilities.find((f) => f.id === fid);
      setForm({
        name: "",
        facilityId: fid,
        facilityName: fac?.name || "",
        input: "",
        output: "",
        productionLine: "",
        status: "Draft",
        energySources: "",
        meters: "",
        carbonSources: "",
        defaultScope: "Scope 2",
      });
    }
  }, [open, defaultFacilityId, facilities]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setFacility = (fid) => {
    const fac = facilities.find((f) => f.id === fid);
    setForm((f) => ({ ...f, facilityId: fid, facilityName: fac?.name || "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="process-form-modal" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight">Add Process</DialogTitle>
          <DialogDescription>
            Define a production step inside a facility and its associated carbon sources.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2 py-2">
          <Group label="Process Name">
            <Input data-testid="process-input-name" value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Cocoa Butter Refining" className="h-10" />
          </Group>
          <Group label="Facility">
            <Select value={form.facilityId} onValueChange={setFacility}>
              <SelectTrigger data-testid="process-select-facility" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {facilities.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Group>
          <Group label="Input">
            <Input data-testid="process-input-input" value={form.input || ""} onChange={(e) => set("input", e.target.value)} placeholder="e.g. Crude cocoa butter" className="h-10" />
          </Group>
          <Group label="Output">
            <Input data-testid="process-input-output" value={form.output || ""} onChange={(e) => set("output", e.target.value)} placeholder="e.g. Refined cocoa butter" className="h-10" />
          </Group>
          <Group label="Production Line">
            <Input data-testid="process-input-line" value={form.productionLine || ""} onChange={(e) => set("productionLine", e.target.value)} placeholder="e.g. Refining Line" className="h-10" />
          </Group>
          <Group label="Status">
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger data-testid="process-select-status" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {processStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Group>
          <Group label="Energy Sources (comma-separated)">
            <Input data-testid="process-input-energy" value={form.energySources || ""} onChange={(e) => set("energySources", e.target.value)} placeholder="Grid electricity, Steam" className="h-10" />
          </Group>
          <Group label="Meters / Data Sources (comma-separated)">
            <Input data-testid="process-input-meters" value={form.meters || ""} onChange={(e) => set("meters", e.target.value)} placeholder="MTR-105, MTR-201" className="h-10" />
          </Group>
          <Group label="Carbon Sources (comma-separated)">
            <Input data-testid="process-input-carbon" value={form.carbonSources || ""} onChange={(e) => set("carbonSources", e.target.value)} placeholder="Electricity, Diesel boiler, Steam" className="h-10" />
          </Group>
          <Group label="Default Scope for Sources">
            <Select value={form.defaultScope} onValueChange={(v) => set("defaultScope", v)}>
              <SelectTrigger data-testid="process-select-scope" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {scopeOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Group>
        </div>

        <DialogFooter>
          <Button variant="outline" data-testid="process-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            data-testid="process-save-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onSave(form)}
            disabled={!form.name || !form.facilityId}
          >
            Add Process
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
