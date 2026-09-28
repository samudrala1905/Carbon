import { createContext, useContext, useState } from "react";
import { users as seed, ROLES } from "@/data/mockUsers";

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(seed);
  // RBAC: the role the current session is acting as (demo switcher).
  const [actingRole, setActingRole] = useState("Organisation Admin");

  const hasPermission = (perm) => ROLES[actingRole]?.permissions.includes(perm);

  const inviteUser = (form) => {
    const seq = String(users.length + 1).padStart(3, "0");
    const newUser = {
      id: `USR-${seq}`,
      name: form.name,
      email: form.email,
      organisation: "EcoGlobal Logistics Corp",
      facilityAccess: form.facilityAccess.length ? form.facilityAccess : ["All Facilities"],
      role: form.role,
      lastLogin: "—",
      status: "Invited",
    };
    setUsers((u) => [newUser, ...u]);
    return newUser;
  };

  const assignRole = (userId, role, facilityAccess) => {
    setUsers((list) =>
      list.map((u) =>
        u.id === userId
          ? { ...u, role, facilityAccess: facilityAccess.length ? facilityAccess : ["All Facilities"] }
          : u,
      ),
    );
  };

  return (
    <UsersContext.Provider value={{ users, actingRole, setActingRole, hasPermission, inviteUser, assignRole }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
