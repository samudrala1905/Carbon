import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Scale, Users } from "lucide-react";

const FieldInput = ({ label, value, onChange, testId, placeholder }) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
      {label}
    </Label>
    <Input
      data-testid={testId}
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-10"
    />
  </div>
);

export const EditProfileModal = ({ open, onOpenChange, profile, onSave }) => {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  const set = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const setNested = (group, key, val) =>
    setDraft((d) => ({ ...d, [group]: { ...d[group], [key]: val } }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="edit-profile-modal"
        className="max-w-3xl p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="font-heading text-xl tracking-tight">
            Edit Organisation Profile
          </DialogTitle>
          <DialogDescription className="text-sm">
            Update your company's legal identity and carbon accounting boundary.
            Changes are recorded in the audit trail.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="legal" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="legal" data-testid="tab-legal" className="gap-1.5">
                <Building2 className="h-4 w-4" /> Legal Identity
              </TabsTrigger>
              <TabsTrigger value="boundary" data-testid="tab-boundary" className="gap-1.5">
                <Scale className="h-4 w-4" /> Carbon Boundary
              </TabsTrigger>
              <TabsTrigger value="contacts" data-testid="tab-contacts" className="gap-1.5">
                <Users className="h-4 w-4" /> Contacts
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="max-h-[55vh]">
            <div className="px-6 py-5">
              <TabsContent value="legal" className="mt-0 grid gap-4 sm:grid-cols-2">
                <FieldInput label="Legal Name" value={draft.legalName} onChange={(v) => set("legalName", v)} testId="input-legal-name" />
                <FieldInput label="Trading Name" value={draft.tradingName} onChange={(v) => set("tradingName", v)} testId="input-trading-name" />
                <FieldInput label="Registration Number" value={draft.registrationNumber} onChange={(v) => set("registrationNumber", v)} testId="input-registration-number" />
                <FieldInput label="Country of Incorporation" value={draft.countryOfIncorporation} onChange={(v) => set("countryOfIncorporation", v)} testId="input-country" />
                <div className="sm:col-span-2">
                  <FieldInput label="Registered Address" value={draft.registeredAddress} onChange={(v) => set("registeredAddress", v)} testId="input-address" />
                </div>
                <FieldInput label="Headquarters" value={draft.headquarters} onChange={(v) => set("headquarters", v)} testId="input-hq" />
                <FieldInput label="Industry / Sector" value={draft.industry} onChange={(v) => set("industry", v)} testId="input-industry" />
                <FieldInput label="Primary Commodities / Products" value={draft.primaryProducts} onChange={(v) => set("primaryProducts", v)} testId="input-products" />
                <FieldInput label="Website" value={draft.website} onChange={(v) => set("website", v)} testId="input-website" />
                <FieldInput label="Tax / VAT / GST ID" value={draft.taxId} onChange={(v) => set("taxId", v)} testId="input-tax-id" />
                <FieldInput label="LEI" value={draft.lei} onChange={(v) => set("lei", v)} testId="input-lei" />
              </TabsContent>

              <TabsContent value="boundary" className="mt-0 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    Consolidation Approach
                  </Label>
                  <Select
                    value={draft.boundary.consolidationApproach}
                    onValueChange={(v) => setNested("boundary", "consolidationApproach", v)}
                  >
                    <SelectTrigger data-testid="select-consolidation" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operational Control">Operational Control</SelectItem>
                      <SelectItem value="Financial Control">Financial Control</SelectItem>
                      <SelectItem value="Equity Share">Equity Share</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FieldInput label="Base Year" value={draft.boundary.baseYear} onChange={(v) => setNested("boundary", "baseYear", v)} testId="input-base-year" />
                <FieldInput label="Reporting Currency" value={draft.boundary.reportingCurrency} onChange={(v) => setNested("boundary", "reportingCurrency", v)} testId="input-currency" />
                <FieldInput label="Default Units" value={draft.boundary.defaultUnits} onChange={(v) => setNested("boundary", "defaultUnits", v)} testId="input-units" />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    GHG Reporting Standard
                  </Label>
                  <Select
                    value={draft.boundary.ghgStandard}
                    onValueChange={(v) => setNested("boundary", "ghgStandard", v)}
                  >
                    <SelectTrigger data-testid="select-ghg-standard" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GHG Protocol Corporate Standard">GHG Protocol Corporate Standard</SelectItem>
                      <SelectItem value="ISO 14064-1">ISO 14064-1</SelectItem>
                      <SelectItem value="PCAF Standard">PCAF Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    Organisation Status
                  </Label>
                  <Select value={draft.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger data-testid="select-status" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="mt-0 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold font-heading mb-3 text-slate-900 dark:text-slate-100">
                    Primary Contact
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldInput label="Name" value={draft.primaryContact.name} onChange={(v) => setNested("primaryContact", "name", v)} testId="input-primary-name" />
                    <FieldInput label="Title" value={draft.primaryContact.title} onChange={(v) => setNested("primaryContact", "title", v)} testId="input-primary-title" />
                    <FieldInput label="Email" value={draft.primaryContact.email} onChange={(v) => setNested("primaryContact", "email", v)} testId="input-primary-email" />
                    <FieldInput label="Phone" value={draft.primaryContact.phone} onChange={(v) => setNested("primaryContact", "phone", v)} testId="input-primary-phone" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-heading mb-3 text-slate-900 dark:text-slate-100">
                    Sustainability / Compliance Contact
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldInput label="Name" value={draft.sustainabilityContact.name} onChange={(v) => setNested("sustainabilityContact", "name", v)} testId="input-sustain-name" />
                    <FieldInput label="Title" value={draft.sustainabilityContact.title} onChange={(v) => setNested("sustainabilityContact", "title", v)} testId="input-sustain-title" />
                    <FieldInput label="Email" value={draft.sustainabilityContact.email} onChange={(v) => setNested("sustainabilityContact", "email", v)} testId="input-sustain-email" />
                    <FieldInput label="Phone" value={draft.sustainabilityContact.phone} onChange={(v) => setNested("sustainabilityContact", "phone", v)} testId="input-sustain-phone" />
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <Button
            variant="outline"
            data-testid="cancel-profile-changes-button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            data-testid="save-profile-changes-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onSave(draft)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
