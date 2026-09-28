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
import { Cpu } from "lucide-react";
import { deviceProtocols } from "@/data/mockFacilities";

const blank = { name: "", meter: "", source: "Modbus PLC", process: "" };

export const ConnectDeviceModal = ({ open, onOpenChange, processes = [], onConnect }) => {
  const [form, setForm] = useState(blank);

  useEffect(() => {
    if (open) setForm({ ...blank, process: processes[0]?.id || "" });
  }, [open, processes]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="connect-device-modal" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-700" /> Connect Device
          </DialogTitle>
          <DialogDescription>
            Attach a meter or equipment data source to this facility's process hierarchy.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Equipment / Device Name</Label>
            <Input data-testid="device-input-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Rotary Roaster R3" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Meter ID</Label>
            <Input data-testid="device-input-meter" value={form.meter} onChange={(e) => set("meter", e.target.value)} placeholder="e.g. MTR-106" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Data Source Protocol</Label>
            <Select value={form.source} onValueChange={(v) => set("source", v)}>
              <SelectTrigger data-testid="device-select-source" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {deviceProtocols.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {processes.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Attach to Process</Label>
              <Select value={form.process} onValueChange={(v) => set("process", v)}>
                <SelectTrigger data-testid="device-select-process" className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {processes.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" data-testid="device-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            data-testid="device-connect-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onConnect(form)}
            disabled={!form.name || !form.meter}
          >
            Connect Device
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
