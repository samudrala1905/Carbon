import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  ShieldCheck,
  Users2,
  Check,
  X,
  Lock,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import { RoleBadge, UserStatus } from "@/components/users/RoleBadge";
import { InviteUserModal } from "@/components/users/InviteUserModal";
import { AssignRoleModal } from "@/components/users/AssignRoleModal";
import { useUsers } from "@/context/UsersContext";
import { PERMISSIONS, ROLES, ROLE_NAMES } from "@/data/mockUsers";

export default function UsersRoles() {
  const { users, actingRole, setActingRole, hasPermission, inviteUser, assignRole } = useUsers();
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [assignUser, setAssignUser] = useState(null);

  const canCreate = hasPermission("Create");
  const canEdit = hasPermission("Edit");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()),
  );

  const handleInvite = (form) => {
    inviteUser(form);
    setInviteOpen(false);
    toast.success("Invitation sent", { description: `${form.name} invited as ${form.role}.` });
  };

  const handleAssign = (userId, role, facilityAccess) => {
    assignRole(userId, role, facilityAccess);
    setAssignUser(null);
    toast.success("Role assigned", { description: `Updated to ${role}.` });
  };

  const GatedButton = ({ allowed, children, ...props }) =>
    allowed ? (
      children
    ) : (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">{children}</span>
          </TooltipTrigger>
          <TooltipContent>Your role ({actingRole}) lacks the required permission.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Organisation → Access Control
            </span>
            <h1 data-testid="users-title" className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
              Users & Roles
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Role-based access control — who can do what inside Carbon Passport.
            </p>
          </div>
          <GatedButton allowed={canCreate}>
            <Button
              data-testid="invite-user-button"
              onClick={() => canCreate && setInviteOpen(true)}
              disabled={!canCreate}
              className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2 h-11 px-5 w-full lg:w-auto disabled:opacity-50"
            >
              {canCreate ? <UserPlus className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Invite User
            </Button>
          </GatedButton>
        </div>

        {/* RBAC session bar */}
        <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">RBAC Preview — acting as a role</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Switch roles to see how actions below are enabled or locked.</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-wrap gap-1 max-w-md justify-end">
              {ROLES[actingRole].permissions.map((p) => (
                <span key={p} className="text-[10px] font-mono rounded bg-white/70 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5">{p}</span>
              ))}
            </div>
            <Select value={actingRole} onValueChange={setActingRole}>
              <SelectTrigger data-testid="acting-role-select" className="h-10 w-52 bg-white dark:bg-slate-900"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_NAMES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="members">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="members" data-testid="tab-members" className="gap-1.5"><Users2 className="h-4 w-4" /> Team Members</TabsTrigger>
            <TabsTrigger value="roles" data-testid="tab-roles" className="gap-1.5"><ShieldCheck className="h-4 w-4" /> Roles & Permissions</TabsTrigger>
          </TabsList>

          {/* Members */}
          <TabsContent value="members" className="mt-5 space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input data-testid="user-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or role…" className="pl-9 h-10" />
            </div>
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="overflow-x-auto">
                <Table data-testid="users-table">
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      {["Name", "Email", "Organisation", "Facility Access", "Role", "Last Login", "Status", ""].map((h) => (
                        <TableHead key={h} className="text-[11px] uppercase font-mono tracking-wider text-slate-500 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow key={u.id} data-testid={`user-row-${u.id}`} className="border-slate-100 dark:border-slate-800">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-heading">
                              {u.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">{u.email}</TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{u.organisation}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {u.facilityAccess.map((f) => (
                              <span key={f} className="text-[11px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 whitespace-nowrap">{f}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell><RoleBadge role={u.role} /></TableCell>
                        <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">{u.lastLogin}</TableCell>
                        <TableCell><UserStatus status={u.status} /></TableCell>
                        <TableCell>
                          <GatedButton allowed={canEdit}>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`assign-role-button-${u.id}`}
                              onClick={() => canEdit && setAssignUser(u)}
                              disabled={!canEdit}
                              className="h-8 gap-1.5 disabled:opacity-50"
                            >
                              {canEdit ? <SlidersHorizontal className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />} Assign Role
                            </Button>
                          </GatedButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-slate-400 font-mono text-sm">No users match your search.</div>}
          </TabsContent>

          {/* Roles & permissions matrix */}
          <TabsContent value="roles" className="mt-5 space-y-6">
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <h2 className="text-base font-semibold font-heading text-slate-900 dark:text-slate-100">Permission Matrix</h2>
              </div>
              <div className="overflow-x-auto">
                <Table data-testid="permission-matrix">
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <TableHead className="text-[11px] uppercase font-mono tracking-wider text-slate-500 sticky left-0 bg-slate-50 dark:bg-slate-800/60">Role</TableHead>
                      {PERMISSIONS.map((p) => (
                        <TableHead key={p} className="text-[11px] uppercase font-mono tracking-wider text-slate-500 text-center whitespace-nowrap">{p}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ROLE_NAMES.map((role) => (
                      <TableRow key={role} data-testid={`matrix-row-${role.replace(/\s+/g, "-").toLowerCase()}`} className="border-slate-100 dark:border-slate-800">
                        <TableCell className="sticky left-0 bg-white dark:bg-slate-900"><RoleBadge role={role} /></TableCell>
                        {PERMISSIONS.map((perm) => {
                          const allowed = ROLES[role].permissions.includes(perm);
                          return (
                            <TableCell key={perm} className="text-center">
                              {allowed ? (
                                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-auto" />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLE_NAMES.map((role, i) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <RoleBadge role={role} />
                    <span className="text-[11px] font-mono text-slate-400">{ROLES[role].permissions.length}/{PERMISSIONS.length} perms</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{ROLES[role].description}</p>
                  <div className="flex flex-wrap gap-1">
                    {ROLES[role].permissions.map((p) => (
                      <span key={p} className="text-[10px] font-mono rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900 px-1.5 py-0.5">{p}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} onInvite={handleInvite} />
      <AssignRoleModal open={Boolean(assignUser)} onOpenChange={(o) => !o && setAssignUser(null)} user={assignUser} onAssign={handleAssign} />
    </div>
  );
}
