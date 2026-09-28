import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Cpu,
  MapPin,
  Building2,
  Gauge,
  Clock,
  User,
  Zap,
  Droplets,
  Factory,
  Flame,
  Package,
  Network,
  ChevronRight,
  Sigma,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/TopNav";
import { Field } from "@/components/profile/Field";
import { FacilityStatus, ReadinessPill } from "@/components/facilities/FacilityStatus";
import { FacilityFormModal } from "@/components/facilities/FacilityFormModal";
import { ConnectDeviceModal } from "@/components/facilities/ConnectDeviceModal";
import { useFacilities } from "@/context/FacilitiesContext";

const Card = ({ className = "", children, ...props }) => (
  <section
    className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5 ${className}`}
    {...props}
  >
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

export default function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFacility, updateFacility, connectDevice } = useFacilities();
  const facility = getFacility(id);
  const [editOpen, setEditOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);

  if (!facility) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
        <TopNav />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-slate-500 font-mono">Facility "{id}" not found.</p>
          <Button className="mt-4 bg-emerald-800 hover:bg-emerald-900 text-white" onClick={() => navigate("/facilities")}>
            Back to Facilities
          </Button>
        </div>
      </div>
    );
  }

  const handleEditSave = (form) => {
    updateFacility(facility.id, form);
    setEditOpen(false);
    toast.success("Facility updated", { description: `${form.name} details saved.` });
  };

  const handleConnect = (device) => {
    connectDevice(facility.id, device);
    setDeviceOpen(false);
    toast.success("Device connected", { description: `${device.name} (${device.meter}) linked as a data source.` });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb + actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <Link to="/facilities" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400">
              <ArrowLeft className="h-3.5 w-3.5" /> Facilities Registry
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400">{facility.id}</span>
              <FacilityStatus status={facility.status} testId="facility-detail-status" />
              <ReadinessPill readiness={facility.readiness} />
            </div>
            <h1 data-testid="facility-detail-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
              {facility.name}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {facility.country} · {facility.type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              data-testid="connect-device-button"
              onClick={() => setDeviceOpen(true)}
              className="gap-2 h-11"
            >
              <Cpu className="h-4 w-4" /> Connect Device
            </Button>
            <Button
              data-testid="edit-facility-button"
              onClick={() => setEditOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11"
            >
              <Pencil className="h-4 w-4" /> Edit Facility
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Details */}
          <Card className="lg:col-span-7">
            <SectionTitle icon={Building2}>Facility Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Facility ID" value={facility.id} mono />
              <Field label="Type" value={facility.type} />
              <Field label="Production Capacity" value={facility.productionCapacity} />
              <Field label="Operating Hours" value={facility.operatingHours} />
              <Field label="Address" value={facility.address} span />
            </div>
            <Separator />
            <SectionTitle icon={User}>Responsible Manager</SectionTitle>
            <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{facility.manager.name || "Unassigned"}</p>
              <p className="text-xs text-slate-500">{facility.manager.title}</p>
              {facility.manager.email && (
                <a href={`mailto:${facility.manager.email}`} className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline">{facility.manager.email}</a>
              )}
            </div>
          </Card>

          {/* Location + capacity metrics */}
          <Card className="lg:col-span-5">
            <SectionTitle icon={MapPin}>Geographical Location</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude" value={facility.geo.lat} mono />
              <Field label="Longitude" value={facility.geo.lng} mono />
              <Field label="Timezone" value={facility.geo.timezone} span />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-3 text-center">
                <div className="text-lg font-bold font-heading text-emerald-800 dark:text-emerald-300">{facility.devices}</div>
                <div className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400">Devices</div>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 text-center">
                <div className="text-lg font-bold font-heading text-slate-900 dark:text-slate-100">{facility.dataCompleteness}%</div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Complete</div>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 text-center">
                <div className="text-sm font-bold font-heading text-slate-900 dark:text-slate-100 mt-1">{facility.emissions}</div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Emissions</div>
              </div>
            </div>
          </Card>

          {/* Energy / Utilities / Products / Emission sources */}
          <Card className="lg:col-span-6">
            <SectionTitle icon={Zap}>Energy Sources</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {facility.energySources.length ? facility.energySources.map((e) => <Chip key={e}>{e}</Chip>) : <span className="text-xs text-slate-400 italic">None recorded</span>}
            </div>
            <Separator />
            <SectionTitle icon={Droplets}>Utility Connections</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {facility.utilities.length ? facility.utilities.map((u) => <Chip key={u}>{u}</Chip>) : <span className="text-xs text-slate-400 italic">None recorded</span>}
            </div>
          </Card>

          <Card className="lg:col-span-6">
            <SectionTitle icon={Package}>Products Manufactured</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {facility.products.length ? facility.products.map((p) => <Chip key={p}>{p}</Chip>) : <span className="text-xs text-slate-400 italic">None recorded</span>}
            </div>
            <Separator />
            <SectionTitle icon={Flame}>Emission Sources</SectionTitle>
            <div className="space-y-2">
              {facility.emissionSources.length ? facility.emissionSources.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 px-3 py-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{s.scope}</span>
                </div>
              )) : <span className="text-xs text-slate-400 italic">None recorded</span>}
            </div>
          </Card>

          {/* Hierarchy */}
          <Card className="lg:col-span-12">
            <div className="flex items-center justify-between">
              <SectionTitle icon={Network}>Data Hierarchy</SectionTitle>
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                Organisation <ChevronRight className="h-3 w-3" /> Facility <ChevronRight className="h-3 w-3" /> Process <ChevronRight className="h-3 w-3" /> Line <ChevronRight className="h-3 w-3" /> Equipment <ChevronRight className="h-3 w-3" /> Data Source
              </span>
            </div>
            <HierarchyTree facility={facility} />
          </Card>
        </div>
      </div>

      <FacilityFormModal open={editOpen} onOpenChange={setEditOpen} facility={facility} onSave={handleEditSave} />
      <ConnectDeviceModal open={deviceOpen} onOpenChange={setDeviceOpen} processes={facility.processTree} onConnect={handleConnect} />
    </div>
  );
}

const TreeNode = ({ label, sub, icon: Icon, tone, children, testId }) => (
  <div className="relative pl-6">
    <span className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
    <div className="relative">
      <span className="absolute -left-6 top-3 h-px w-6 bg-slate-200 dark:bg-slate-800" />
      <div data-testid={testId} className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${tone}`}>
        <Icon className="h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{label}</div>
          {sub && <div className="text-[11px] font-mono opacity-70 truncate">{sub}</div>}
        </div>
      </div>
      {children && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  </div>
);

const HierarchyTree = ({ facility }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-emerald-900 dark:text-emerald-200">
      <Factory className="h-4 w-4" />
      <div>
        <div className="text-sm font-semibold">{facility.name}</div>
        <div className="text-[11px] font-mono opacity-70">{facility.id} · Facility</div>
      </div>
    </div>
    <div className="space-y-2">
      {facility.processTree.length === 0 ? (
        <div className="pl-6 text-xs text-slate-400 italic">No processes yet — connect a device to begin building the hierarchy.</div>
      ) : (
        facility.processTree.map((proc) => (
          <TreeNode
            key={proc.id}
            testId={`process-${proc.id}`}
            label={proc.name}
            sub={`${proc.id} · Process`}
            icon={Sigma}
            tone="border-sky-200 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200"
          >
            {proc.lines.map((line) => (
              <TreeNode
                key={line.id}
                label={line.name}
                sub={`${line.id} · Production Line`}
                icon={Gauge}
                tone="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
              >
                {line.equipment.map((eq) => (
                  <TreeNode
                    key={eq.id}
                    label={eq.name}
                    sub={`${eq.id} · Equipment`}
                    icon={Cpu}
                    tone="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                  >
                    <TreeNode
                      label={`${eq.meter} → ${eq.source}`}
                      sub="Meter · Data Source"
                      icon={Clock}
                      tone="border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                    />
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))
      )}
    </div>
  </div>
);
