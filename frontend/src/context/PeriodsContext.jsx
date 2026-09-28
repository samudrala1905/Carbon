import { createContext, useContext, useState } from "react";
import { periods as seed, LIFECYCLE } from "@/data/mockPeriods";

const PeriodsContext = createContext(null);

const today = () => new Date().toISOString().slice(0, 10);

export const PeriodsProvider = ({ children }) => {
  const [periods, setPeriods] = useState(seed);

  const createPeriod = (form) => {
    const newPeriod = {
      id: `RP-${Date.now().toString().slice(-6)}`,
      name: form.name,
      type: form.type,
      start: form.start,
      end: form.end,
      facilities: form.facilities,
      ccfStatus: "Not Started",
      dataCompleteness: 0,
      verificationStatus: "Not Started",
      status: "OPEN",
      versions: [{ version: 1, note: "Initial period created", by: form.by || "Organisation Admin", date: today() }],
    };
    setPeriods((p) => [newPeriod, ...p]);
    return newPeriod;
  };

  const advanceStatus = (id, actingRole) => {
    setPeriods((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        const idx = LIFECYCLE.indexOf(p.status);
        if (idx < 0 || idx >= LIFECYCLE.length - 1) return p;
        const next = LIFECYCLE[idx + 1];
        const patch = { status: next };
        if (next === "DATA LOCKED") patch.ccfStatus = "Calculated";
        if (next === "SUBMITTED") patch.verificationStatus = "In Review";
        if (next === "VERIFIED") { patch.verificationStatus = "Verified"; patch.ccfStatus = "Locked"; }
        return { ...p, ...patch };
      }),
    );
  };

  // Controlled correction after VERIFIED/CLOSED — never silently mutate; create a new version.
  const requestCorrection = (id, reason, actingRole) => {
    setPeriods((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        const nextVersion = (p.versions[p.versions.length - 1]?.version || 1) + 1;
        return {
          ...p,
          verificationStatus: "Recalculation Pending",
          versions: [...p.versions, { version: nextVersion, note: `Recalculation — ${reason}`, by: actingRole, date: today() }],
        };
      }),
    );
  };

  const getPeriod = (id) => periods.find((p) => p.id === id);

  return (
    <PeriodsContext.Provider value={{ periods, createPeriod, advanceStatus, requestCorrection, getPeriod }}>
      {children}
    </PeriodsContext.Provider>
  );
};

export const usePeriods = () => useContext(PeriodsContext);
