import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ROLE_NAMES, ROLES } from "@/data/mockUsers";
import { FacilityAccessPicker } from "@/components/users/InviteUserModal";

export const AssignRoleModal = ({ open, onOpenChange, user, onAssign }) => {
  const [role, setRole] = useState("Viewer");
  const [facilityAccess, setFacilityAccess] = useState([]);

  useEffect(() => {
    if (open && user) {
      setRole(user.role);
      setFacilityAccess(user.facilityAccess);
    }
  }, [open, user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="assign-role-modal" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight">Assign Role</DialogTitle>
          <DialogDescription>
            Update role and facility access for <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger data-testid="assign-select-role" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_NAMES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">{ROLES[role].description}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {ROLES[role].permissions.map((p) => (
                <span key={p} className="text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5">{p}</span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Facility Access</Label>
            <FacilityAccessPicker value={facilityAccess} onChange={setFacilityAccess} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" data-testid="assign-cancel-button" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            data-testid="assign-save-button"
            className="bg-emerald-800 hover:bg-emerald-900 text-white"
            onClick={() => onAssign(user.id, role, facilityAccess)}
          >
            Save Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
