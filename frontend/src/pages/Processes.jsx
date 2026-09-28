import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Workflow, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopNav } from "@/components/TopNav";
import { ScopeBadge } from "@/components/processes/ScopeBadge";
import { ProcessFormModal } from "@/components/processes/ProcessFormModal";
import { useProcesses } from "@/context/ProcessesContext";
import { useFacilities } from "@/context/FacilitiesContext";

const statusTone = {
  Active: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  Draft: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  "Under Review": "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
};

const uniqueScopes = (sources) => {
  const set = new Set();
  sources.forEach((s) => String(s.scope).replace("Scope ", "").split("/").forEach((n) => set.add(n.trim())));
  return [...set].sort().map((n) => `Scope ${n}`);
};

export default function Processes() {
  const { processes, addProcess } = useProcesses();
  const { facilities } = useFacilities();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [facilityFilter, setFacilityFilter] = useState(params.get("facility") || "all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = processes
    .filter((p) => (facilityFilter === "all" ? true : p.facilityId === facilityFilter))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase()),
    );

  const grouped = filtered.reduce((acc, p) => {
    (acc[p.facilityName] = acc[p.facilityName] || []).push(p);
    return acc;
  }, {});
  Object.values(grouped).forEach((arr) => arr.sort((a, b) => a.order - b.order));

  const handleSave = (form) => {
    const created = addProcess(form);
    setAddOpen(false);
    toast.success("Process added", { description: `${created.name} (${created.id}) created.` });
    navigate(`/processes/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Organisation → Facility → Processes
            </span>
            <h1 data-testid="processes-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
              Processes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              What actually happens inside each facility — inputs, outputs and carbon sources per step.
            </p>
          </div>
          <Button
            data-testid="add-process-button"
            onClick={() => setAddOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11 px-5 w-full lg:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Process
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input data-testid="process-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search process name or ID…" className="pl-9 h-10" />
          </div>
          <Select value={facilityFilter} onValueChange={setFacilityFilter}>
            <SelectTrigger data-testid="process-facility-filter" className="h-10 w-full sm:w-64"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All facilities</SelectItem>
              {facilities.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Grouped tables per facility */}
        {Object.entries(grouped).map(([facName, procs]) => (
          <div key={facName} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold font-heading text-slate-700 dark:text-slate-200">
              <Workflow className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {facName}
            </div>

            {/* Flow strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              {procs.map((p, i) => (
                <div key={p.id} className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => navigate(`/processes/${p.id}`)}
                    data-testid={`flow-chip-${p.id}`}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors whitespace-nowrap"
                  >
                    {p.name}
                  </button>
                  {i < procs.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      {["Process ID", "Name", "Input", "Output", "Production Line", "Energy Source", "Meters / Data", "Scope", "Status"].map((h) => (
                        <TableHead key={h} className="text-[11px] uppercase font-mono tracking-wider text-slate-500 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procs.map((p) => (
                      <TableRow
                        key={p.id}
                        data-testid={`process-row-${p.id}`}
                        onClick={() => navigate(`/processes/${p.id}`)}
                        className="cursor-pointer border-slate-100 dark:border-slate-800"
                      >
                        <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">{p.id}</TableCell>
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{p.name}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300 max-w-[160px] truncate">{p.input}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300 max-w-[160px] truncate">{p.output}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.productionLine}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-500 max-w-[140px] truncate">{p.energySources.join(", ")}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-500 max-w-[140px] truncate">{p.meters.join(", ")}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {uniqueScopes(p.carbonSources).map((s) => <ScopeBadge key={s} scope={s} />)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono ${statusTone[p.status] || statusTone.Draft}`}>{p.status}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-mono text-sm">No processes match your filters.</div>
        )}
      </div>

      <ProcessFormModal open={addOpen} onOpenChange={setAddOpen} defaultFacilityId={facilityFilter !== "all" ? facilityFilter : undefined} onSave={handleSave} />
    </div>
  );
}
