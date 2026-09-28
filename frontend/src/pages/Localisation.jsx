import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Settings2,
  Globe2,
  Ruler,
  Scale,
  ChevronRight,
  Banknote,
  Clock,
  Languages,
  Zap,
  Fuel,
  Weight,
  Cloud,
  FileText,
  MapPin,
  Database,
  Ship,
  Hash,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/TopNav";
import { Field } from "@/components/profile/Field";
import { ConfigureLocalisationModal } from "@/components/localisation/ConfigureLocalisationModal";
import { useLocalisation } from "@/context/LocalisationContext";
import { MARKET_ROADMAP } from "@/data/mockLocalisation";

const Card = ({ className = "", children }) => (
  <section className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5 ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ icon: Icon, children, sub }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-base font-semibold font-heading tracking-tight text-slate-900 dark:text-slate-100">{children}</h2>
      {sub && <p className="text-sm text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  </div>
);

const UnitTile = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-emerald-700 dark:text-emerald-400">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
    {children}
  </span>
);

const localeFor = { "1,234.56": "en-US", "1.234,56": "de-DE", "1,23,456.78": "en-IN" };

const previewNumber = (fmt) => {
  try {
    return new Intl.NumberFormat(localeFor[fmt] || "en-US").format(1234567.89);
  } catch {
    return "1,234,567.89";
  }
};
const previewDate = (fmt) => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (fmt === "MM/DD/YYYY") return `${mm}/${dd}/${yyyy}`;
  if (fmt === "YYYY-MM-DD") return `${yyyy}-${mm}-${dd}`;
  return `${dd}/${mm}/${yyyy}`;
};

export default function Localisation() {
  const { config, updateConfig } = useLocalisation();
  const [open, setOpen] = useState(false);

  const handleSave = (next) => {
    updateConfig(next);
    setOpen(false);
    toast.success("Localisation configured", { description: `Carbon Passport set for ${next.country}.` });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Organisation → Localisation</span>
              <h1 data-testid="localisation-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
                Localisation — {config.country}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Country, units and regulatory environment for this Carbon Passport.
              </p>
            </div>
          </div>
          <Button
            data-testid="configure-localisation-button"
            onClick={() => setOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11 px-5 w-full lg:w-auto"
          >
            <Settings2 className="h-4 w-4" /> Configure Localisation
          </Button>
        </div>

        {/* Market roadmap */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">Multi-jurisdiction roadmap — one architecture, per-market rules</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {MARKET_ROADMAP.map((m, i) => {
              const active = m === config.country || (m === "EU" && config.country === "European Union") || (m === "UK" && config.country === "United Kingdom");
              return (
                <div key={m} className="flex items-center gap-1.5 shrink-0">
                  <span
                    data-testid={`roadmap-${m}`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? "border-emerald-500 bg-emerald-600 text-white"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {m}
                  </span>
                  {i < MARKET_ROADMAP.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Regional & Units */}
          <Card className="lg:col-span-7">
            <SectionTitle icon={Globe2} sub="Regional defaults for this market">Regional Settings</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Country" value={config.country} testId="loc-country" />
              <Field label="Currency" value={config.currency} mono testId="loc-currency" />
              <Field label="Timezone" value={config.timezone} mono />
              <Field label="Language" value={config.language} />
              <Field label="Measurement System" value={config.measurement} span />
            </div>

            <Separator />

            <SectionTitle icon={Ruler} sub="Unit conventions used across calculations">Units of Measure</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitTile icon={Zap} label="Energy" value={config.energy} />
              <UnitTile icon={Fuel} label="Fuel" value={config.fuel} />
              <UnitTile icon={Weight} label="Mass" value={config.mass} />
              <UnitTile icon={Cloud} label="Emissions" value={config.emissions} />
            </div>
          </Card>

          {/* Regulatory */}
          <Card className="lg:col-span-5">
            <SectionTitle icon={Scale} sub="Jurisdiction-specific rules">Regulatory Configuration</SectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Reporting Frameworks</div>
                <div className="flex flex-wrap gap-2" data-testid="loc-frameworks">{config.frameworks.map((f) => <Chip key={f}>{f}</Chip>)}</div>
              </div>
              <Field label="Electricity Grid Factor Region" value={config.gridRegion} testId="loc-grid-region" />
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><Database className="h-3.5 w-3.5" /> Default Emission-Factor Datasets</div>
                <div className="flex flex-wrap gap-2">{config.datasets.map((d) => <Chip key={d}>{d}</Chip>)}</div>
              </div>
              <Field label="CBAM Destination Market" value={config.cbamMarket} testId="loc-cbam" />
            </div>
          </Card>

          {/* Formatting preview */}
          <Card className="lg:col-span-12">
            <SectionTitle icon={Hash} sub="How dates, numbers, currency and certificates render for this market">Formatting & Output</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Date · {config.dateFormat}</div>
                <div className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">{previewDate(config.dateFormat)}</div>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> Number · {config.numberFormat}</div>
                <div className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">{previewNumber(config.numberFormat)}</div>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5" /> Currency · {config.currency}</div>
                <div className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">{config.currency} {previewNumber(config.numberFormat)}</div>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" /> Certificate Language</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{config.certLanguage}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfigureLocalisationModal open={open} onOpenChange={setOpen} config={config} onSave={handleSave} />
    </div>
  );
}
