import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Building2,
  Scale,
  ShieldCheck,
  History,
  Pencil,
  Leaf,
  Mail,
  Phone,
  Fingerprint,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field } from "@/components/profile/Field";
import { StatusBadge } from "@/components/profile/StatusBadge";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { initialProfile, auditTrail } from "@/data/mockProfile";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-lg font-semibold font-heading tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  </div>
);

const Card = ({ className = "", children, ...props }) => (
  <section
    className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 transition-colors hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
    {...props}
  >
    {children}
  </section>
);

export default function OrganisationProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editOpen, setEditOpen] = useState(false);

  const handleSave = (draft) => {
    setProfile(draft);
    setEditOpen(false);
    toast.success("Organisation profile updated", {
      description: "Changes have been recorded in the audit trail.",
    });
  };

  const monogram = profile.legalName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      {/* Top bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                Carbon Passport
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Organisation Registry
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-xs font-mono text-slate-400">
            <span>Registry</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-200">Profile</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header / Command bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white font-heading font-bold text-xl shadow-inner">
                {monogram}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Legal Identity
                  </span>
                  <StatusBadge
                    status={profile.status}
                    testId="organisation-status-badge"
                  />
                </div>
                <h1
                  data-testid="organisation-profile-title"
                  className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100"
                >
                  {profile.legalName}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {profile.organisationId} · {profile.tradingName}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <Button
                data-testid="edit-organisation-profile-button"
                onClick={() => setEditOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 px-5 h-11"
              >
                <Pencil className="h-4 w-4" />
                Edit Organisation Profile
              </Button>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Last audit: {auditTrail[0].timestamp}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Legal Identity */}
          <Card
            data-testid="company-legal-identity-panel"
            className="lg:col-span-7"
          >
            <SectionHeader
              icon={Building2}
              title="Company Legal Identity"
              subtitle="Registered legal information of the entity"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Legal Name" value={profile.legalName} testId="company-legal-name" />
              <Field label="Trading Name" value={profile.tradingName} />
              <Field label="Organisation ID" value={profile.organisationId} mono testId="company-org-id" />
              <Field label="Registration / Incorporation No." value={profile.registrationNumber} mono />
              <Field label="Country of Incorporation" value={profile.countryOfIncorporation} />
              <Field label="Headquarters" value={profile.headquarters} />
              <Field label="Registered Address" value={profile.registeredAddress} span />
              <Field label="Industry / Sector" value={profile.industry} />
              <Field label="Classification Code" value={profile.naceCode} mono />
              <Field label="Primary Commodities / Products" value={profile.primaryProducts} span />
              <Field label="Website" value={profile.website} mono />
              <Field label="Tax / VAT / GST ID" value={profile.taxId} mono />
              <Field label="LEI (Legal Entity Identifier)" value={profile.lei} mono testId="company-lei-number" span />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactBlock title="Primary Contact" contact={profile.primaryContact} />
              <ContactBlock title="Sustainability / Compliance" contact={profile.sustainabilityContact} />
            </div>
          </Card>

          {/* Carbon Boundary */}
          <Card data-testid="carbon-boundary-panel" className="lg:col-span-5">
            <SectionHeader
              icon={Scale}
              title="Carbon Accounting Boundary"
              subtitle="Consolidation approach & reporting basis"
            />
            <div className="grid grid-cols-1 gap-3">
              <Field
                label="Consolidation Approach"
                value={profile.boundary.consolidationApproach}
                testId="boundary-consolidation-approach"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Base Year" value={profile.boundary.baseYear} mono testId="boundary-base-year" />
                <Field label="Reporting Currency" value={profile.boundary.reportingCurrency} mono />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Default Units" value={profile.boundary.defaultUnits} mono />
                <Field label="Reporting Period" value={profile.boundary.reportingPeriod} />
              </div>
              <Field
                label="GHG Reporting Standard"
                value={profile.boundary.ghgStandard}
                testId="boundary-ghg-standard"
              />
              <div className="flex items-center justify-between rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-3">
                <span className="text-[11px] font-mono font-medium tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                  Organisation Status
                </span>
                <StatusBadge status={profile.status} />
              </div>
            </div>
          </Card>

          {/* Registration & Verification */}
          <Card
            data-testid="registration-verification-panel"
            className="lg:col-span-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <SectionHeader
                icon={ShieldCheck}
                title="Registration & Verification Status"
                subtitle="Independent third-party assurance details"
              />
              <div
                data-testid="verification-status-badge"
                className="flex items-center gap-2 rounded-lg bg-emerald-800 text-white px-4 py-2 text-sm font-semibold"
              >
                <ShieldCheck className="h-4 w-4" />
                {profile.status === "Verified" ? "Independently Verified" : "Verification Pending"}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Field label="Verification Provider" value={profile.verification.provider} testId="auditor-provider-name" />
              <Field label="Accreditor ID" value={profile.verification.accreditorId} mono />
              <Field label="Assurance Standard" value={profile.verification.standard} mono />
              <Field label="Assurance Level" value={profile.verification.assuranceLevel} />
              <Field label="Verified Date" value={profile.verification.verifiedDate} mono />
              <Field label="Expiry Date" value={profile.verification.expiryDate} mono />
              <Field label="Certificate Hash" value={profile.verification.certificateHash} mono span />
            </div>
          </Card>

          {/* Audit Trail */}
          <Card className="lg:col-span-12 p-0 overflow-hidden">
            <div className="p-6 pb-4">
              <SectionHeader
                icon={History}
                title="Audit Trail"
                subtitle="Immutable record of who changed company information"
              />
            </div>
            <div className="overflow-x-auto">
              <Table data-testid="audit-trail-table">
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    {["Timestamp", "User & Role", "Section / Field", "Previous", "Updated", "Change Hash"].map(
                      (h) => (
                        <TableHead
                          key={h}
                          className="text-[11px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          {h}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditTrail.map((row) => (
                    <TableRow
                      key={row.id}
                      data-testid="audit-trail-row-item"
                      className="border-slate-100 dark:border-slate-800"
                    >
                      <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                        {row.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {row.user}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">{row.role}</div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                        {row.section}
                      </TableCell>
                      <TableCell className="text-sm text-slate-400 line-through">
                        {row.previous}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        {row.updated}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">
                        {row.hash}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Fingerprint className="h-3.5 w-3.5" />
              {auditTrail.length} records · cryptographically chained · read-only
            </div>
          </Card>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSave={handleSave}
      />
    </div>
  );
}

const ContactBlock = ({ title, contact }) => (
  <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2">
    <span className="text-[11px] font-mono font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
      {title}
    </span>
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{contact.name}</p>
      <p className="text-xs text-slate-500">{contact.title}</p>
    </div>
    <div className="space-y-1 pt-1">
      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 hover:underline">
        <Mail className="h-3.5 w-3.5" /> {contact.email}
      </a>
      <span className="flex items-center gap-2 text-xs text-slate-500 font-mono">
        <Phone className="h-3.5 w-3.5" /> {contact.phone}
      </span>
    </div>
  </div>
);
