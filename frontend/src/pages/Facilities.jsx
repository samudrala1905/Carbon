import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  Rows3,
  Cpu,
  MapPin,
  Factory,
  Gauge,
  Activity,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopNav } from "@/components/TopNav";
import { FacilityStatus, ReadinessPill } from "@/components/facilities/FacilityStatus";
import { FacilityFormModal } from "@/components/facilities/FacilityFormModal";
import { useFacilities } from "@/context/FacilitiesContext";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">{value}</div>
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  </div>
);

const CompletenessBar = ({ value }) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-mono text-slate-500">Data Completeness</span>
      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{value}%</span>
    </div>
    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div
        className={`h-full rounded-full ${value >= 90 ? "bg-emerald-500" : value >= 70 ? "bg-amber-500" : "bg-slate-400"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default function Facilities() {
  const { facilities, addFacility } = useFacilities();
  const navigate = useNavigate();
  const [view, setView] = useState("cards");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.id.toLowerCase().includes(query.toLowerCase()) ||
      f.country.toLowerCase().includes(query.toLowerCase()),
  );

  const totals = {
    count: facilities.length,
    devices: facilities.reduce((s, f) => s + f.devices, 0),
    active: facilities.filter((f) => f.status === "Active").length,
    avgCompleteness: Math.round(
      facilities.reduce((s, f) => s + f.dataCompleteness, 0) / (facilities.length || 1),
    ),
  };

  const handleSave = (form) => {
    const created = addFacility(form);
    setAddOpen(false);
    toast.success("Facility added", { description: `${created.name} (${created.id}) registered.` });
    navigate(`/facilities/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Organisation → Facilities
            </span>
            <h1
              data-testid="facilities-title"
              className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100"
            >
              Facilities Registry
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Every physical operating location belonging to the organisation.
            </p>
          </div>
          <Button
            data-testid="add-facility-button"
            onClick={() => setAddOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11 px-5 w-full lg:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Facility
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Factory} label="Total Facilities" value={totals.count} />
          <StatCard icon={Activity} label="Active Sites" value={totals.active} />
          <StatCard icon={Cpu} label="Connected Devices" value={totals.devices} />
          <StatCard icon={Gauge} label="Avg Completeness" value={`${totals.avgCompleteness}%`} />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              data-testid="facility-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID or country…"
              className="pl-9 h-10"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-white dark:bg-slate-900 self-start">
            <button
              data-testid="view-cards"
              onClick={() => setView("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "cards" ? "bg-emerald-800 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"}`}
            >
              <LayoutGrid className="h-4 w-4" /> Cards
            </button>
            <button
              data-testid="view-table"
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "table" ? "bg-emerald-800 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"}`}
            >
              <Rows3 className="h-4 w-4" /> Table
            </button>
          </div>
        </div>

        {/* Cards view */}
        {view === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((f, i) => (
              <motion.button
                key={f.id}
                data-testid={`facility-card-${f.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                onClick={() => navigate(`/facilities/${f.id}`)}
                className="text-left rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">{f.id}</span>
                    <h3 className="text-base font-semibold font-heading text-slate-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                      {f.name}
                    </h3>
                  </div>
                  <FacilityStatus status={f.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <MapPin className="h-3.5 w-3.5" /> {f.country} · {f.type}
                </div>
                <CompletenessBar value={f.dataCompleteness} />
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-3">
                    <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> {f.devices}</span>
                    <span className="flex items-center gap-1"><Factory className="h-3.5 w-3.5" /> {f.processes}</span>
                    <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {f.emissions}</span>
                  </div>
                  <div className="pt-3"><ReadinessPill readiness={f.readiness} /></div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table data-testid="facilities-table">
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    {["Facility ID", "Name", "Type", "Country", "Status", "Processes", "Devices", "Completeness", "Emissions", "Readiness"].map((h) => (
                      <TableHead key={h} className="text-[11px] uppercase font-mono tracking-wider text-slate-500 whitespace-nowrap">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((f) => (
                    <TableRow
                      key={f.id}
                      data-testid={`facility-row-${f.id}`}
                      onClick={() => navigate(`/facilities/${f.id}`)}
                      className="cursor-pointer border-slate-100 dark:border-slate-800"
                    >
                      <TableCell className="font-mono text-xs text-slate-500">{f.id}</TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">{f.name}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">{f.type}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">{f.country}</TableCell>
                      <TableCell><FacilityStatus status={f.status} /></TableCell>
                      <TableCell className="font-mono text-sm">{f.processes}</TableCell>
                      <TableCell className="font-mono text-sm">{f.devices}</TableCell>
                      <TableCell className="font-mono text-sm">{f.dataCompleteness}%</TableCell>
                      <TableCell className="font-mono text-sm whitespace-nowrap">{f.emissions}</TableCell>
                      <TableCell><ReadinessPill readiness={f.readiness} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-mono text-sm">No facilities match your search.</div>
        )}
      </div>

      <FacilityFormModal open={addOpen} onOpenChange={setAddOpen} facility={null} onSave={handleSave} />
    </div>
  );
}
