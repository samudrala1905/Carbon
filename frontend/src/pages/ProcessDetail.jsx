import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Workflow,
  ArrowRight,
  Zap,
  Gauge,
  Flame,
  Package2,
  Boxes,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/TopNav";
import { Field } from "@/components/profile/Field";
import { ScopeBadge } from "@/components/processes/ScopeBadge";
import { useProcesses } from "@/context/ProcessesContext";

const Card = ({ className = "", children }) => (
  <section className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5 ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ icon: Icon, children }) => (
  <h2 className="text-base font-semibold font-heading tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
    <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {children}
  </h2>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
    {children}
  </span>
);

const statusTone = {
  Active: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Draft: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  "Under Review": "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
};

const pcfTrace = [
  { label: "Product", icon: Package2 },
  { label: "Batch", icon: Boxes },
  { label: "Process", icon: Workflow },
  { label: "Activity", icon: Layers },
  { label: "Emission Source", icon: Flame },
];

export default function ProcessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProcess, getFacilityProcesses } = useProcesses();
  const process = getProcess(id);

  if (!process) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
        <TopNav />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-slate-500 font-mono">Process "{id}" not found.</p>
          <Button className="mt-4 bg-emerald-800 hover:bg-emerald-900 text-white" onClick={() => navigate("/processes")}>
            Back to Processes
          </Button>
        </div>
      </div>
    );
  }

  const siblings = getFacilityProcesses(process.facilityId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link to="/processes" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400">
            <ArrowLeft className="h-3.5 w-3.5" /> Processes
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400">{process.id}</span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono ${statusTone[process.status] || statusTone.Draft}`}>{process.status}</span>
          </div>
          <h1 data-testid="process-detail-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
            {process.name}
          </h1>
          <Link to={`/facilities/${process.facilityId}`} className="text-sm text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 inline-flex items-center gap-1.5">
            <Workflow className="h-3.5 w-3.5" /> {process.facilityName}
          </Link>
        </div>

        {/* Process flow within facility */}
        <Card>
          <SectionTitle icon={Workflow}>Process Flow — {process.facilityName}</SectionTitle>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2" data-testid="process-flow-strip">
            {siblings.map((p, i) => (
              <div key={p.id} className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => navigate(`/processes/${p.id}`)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    p.id === process.id
                      ? "border-emerald-500 bg-emerald-600 text-white"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-emerald-400"
                  }`}
                >
                  <span className="block text-[10px] font-mono opacity-70">Step {p.order}</span>
                  {p.name}
                </button>
                {i < siblings.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>

          {/* Input -> process -> output */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">Input</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{process.input}</div>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-600 mx-auto rotate-90 sm:rotate-0 shrink-0" />
            <div className="flex-1 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-center">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">Process</div>
              <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{process.name}</div>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-600 mx-auto rotate-90 sm:rotate-0 shrink-0" />
            <div className="flex-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">Output</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{process.output}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Carbon sources */}
          <Card className="lg:col-span-7">
            <SectionTitle icon={Flame}>Associated Carbon Sources</SectionTitle>
            <div className="space-y-2" data-testid="carbon-sources-list">
              {process.carbonSources.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <ArrowRight className="h-3.5 w-3.5" />
                    <ScopeBadge scope={s.scope} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Meta */}
          <Card className="lg:col-span-5">
            <SectionTitle icon={Gauge}>Process Attributes</SectionTitle>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Facility" value={process.facilityName} />
              <Field label="Production Line" value={process.productionLine} />
              <Field label="Step Order" value={`Step ${process.order}`} mono />
            </div>
            <Separator />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Energy Sources</div>
              <div className="flex flex-wrap gap-2">{process.energySources.map((e) => <Chip key={e}>{e}</Chip>)}</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /> Meters / Data Sources</div>
              <div className="flex flex-wrap gap-2">{process.meters.map((m) => <Chip key={m}>{m}</Chip>)}</div>
            </div>
          </Card>

          {/* PCF trace */}
          <Card className="lg:col-span-12">
            <SectionTitle icon={Layers}>PCF Emission Trace</SectionTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
              Product Carbon Footprint calculations trace emissions along this chain — this process is a link in that path.
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {pcfTrace.map((t, i) => (
                <div key={t.label} className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${t.label === "Process" ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"}`}>
                    <t.icon className="h-4 w-4" />
                    <span className="text-sm font-medium whitespace-nowrap">{t.label}</span>
                  </div>
                  {i < pcfTrace.length - 1 && <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
