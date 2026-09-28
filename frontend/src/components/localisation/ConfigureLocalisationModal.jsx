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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Globe2, Ruler, Scale } from "lucide-react";
import {
  PRESETS,
  PRESET_KEYS,
  MEASUREMENT_SYSTEMS,
  ENERGY_UNITS,
  FUEL_UNITS,
  MASS_UNITS,
  EMISSION_UNITS,
  DATE_FORMATS,
  NUMBER_FORMATS,
} from "@/data/mockLocalisation";

const Group = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</Label>
    {children}
  </div>
);

const Sel = ({ value, onChange, options, testId }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger data-testid={testId} className="h-10"><SelectValue /></SelectTrigger>
    <SelectContent>
      {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
    </SelectContent>
  </Select>
);

export const ConfigureLocalisationModal = ({ open, onOpenChange, config, onSave }) => {
  const [form, setForm] = useState(config);

  useEffect(() => {
    if (open) setForm(config);
  }, [open, config]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const loadPreset = (key) => setForm({ ...PRESETS[key] });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="localisation-modal" className="max-w-3xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="font-heading text-xl tracking-tight">Configure Localisation</DialogTitle>
          <DialogDescription>
            Adapt Carbon Passport to a country's units and regulatory environment.
          </DialogDescription>
          <div className="flex items-center gap-2 pt-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Load preset</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_KEYS.map((k) => (
                <button
                  key={k}
                  data-testid={`preset-${k}`}
                  onClick={() => loadPreset(k)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.key === k
                      ? "border-emerald-500 bg-emerald-600 text-white"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="regional" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="regional" className="gap-1.5"><Globe2 className="h-4 w-4" /> Regional</TabsTrigger>
              <TabsTrigger value="units" className="gap-1.5"><Ruler className="h-4 w-4" /> Units</TabsTrigger>
              <TabsTrigger value="regulatory" className="gap-1.5"><Scale className="h-4 w-4" /> Regulatory</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="max-h-[52vh]">
            <div className="px-6 py-5">
              <TabsContent value="regional" className="mt-0 grid gap-4 sm:grid-cols-2">
                <Group label="Country"><Input data-testid="loc-input-country" value={form.country || ""} onChange={(e) => set("country", e.target.value)} className="h-10" /></Group>
                <Group label="Currency"><Input data-testid="loc-input-currency" value={form.currency || ""} onChange={(e) => set("currency", e.target.value)} className="h-10" /></Group>
                <Group label="Timezone"><Input data-testid="loc-input-timezone" value={form.timezone || ""} onChange={(e) => set("timezone", e.target.value)} className="h-10" /></Group>
                <Group label="Language"><Input data-testid="loc-input-language" value={form.language || ""} onChange={(e) => set("language", e.target.value)} className="h-10" /></Group>
                <Group label="Measurement System"><Sel testId="loc-select-measurement" value={form.measurement} onChange={(v) => set("measurement", v)} options={MEASUREMENT_SYSTEMS} /></Group>
              </TabsContent>

              <TabsContent value="units" className="mt-0 grid gap-4 sm:grid-cols-2">
                <Group label="Energy"><Sel testId="loc-select-energy" value={form.energy} onChange={(v) => set("energy", v)} options={ENERGY_UNITS} /></Group>
                <Group label="Fuel"><Sel testId="loc-select-fuel" value={form.fuel} onChange={(v) => set("fuel", v)} options={FUEL_UNITS} /></Group>
                <Group label="Mass"><Sel testId="loc-select-mass" value={form.mass} onChange={(v) => set("mass", v)} options={MASS_UNITS} /></Group>
                <Group label="Emissions"><Sel testId="loc-select-emissions" value={form.emissions} onChange={(v) => set("emissions", v)} options={EMISSION_UNITS} /></Group>
              </TabsContent>

              <TabsContent value="regulatory" className="mt-0 grid gap-4 sm:grid-cols-2">
                <Group label="Reporting Frameworks (comma-separated)">
                  <Input data-testid="loc-input-frameworks" value={(form.frameworks || []).join(", ")} onChange={(e) => set("frameworks", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="h-10" />
                </Group>
                <Group label="Electricity Grid Factor Region"><Input data-testid="loc-input-grid" value={form.gridRegion || ""} onChange={(e) => set("gridRegion", e.target.value)} className="h-10" /></Group>
                <Group label="Emission-Factor Datasets (comma-separated)">
                  <Input data-testid="loc-input-datasets" value={(form.datasets || []).join(", ")} onChange={(e) => set("datasets", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="h-10" />
                </Group>
                <Group label="CBAM Destination Market"><Input data-testid="loc-input-cbam" value={form.cbamMarket || ""} onChange={(e) => set("cbamMarket", e.target.value)} className="h-10" /></Group>
                <Group label="Date Format"><Sel testId="loc-select-date" value={form.dateFormat} onChange={(v) => set("dateFormat", v)} options={DATE_FORMATS} /></Group>
                <Group label="Number Format"><Sel testId="loc-select-number" value={form.numberFormat} onChange={(v) => set("numberFormat", v)} options={NUMBER_FORMATS} /></Group>
                <Group label="Certificate Language"><Input data-testid="loc-input-cert" value={form.certLanguage || ""} onChange={(e) => set("certLanguage", e.target.value)} className="h-10" /></Group>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <Button variant="outline" data-testid="loc-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button data-testid="loc-save-button" className="bg-emerald-800 hover:bg-emerald-900 text-white" onClick={() => onSave(form)}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
