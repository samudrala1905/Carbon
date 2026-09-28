import { createContext, useContext, useState } from "react";
import { processes as seed } from "@/data/mockProcesses";

const ProcessesContext = createContext(null);

const splitList = (str) =>
  (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState(seed);

  const addProcess = (form) => {
    const cc = form.facilityId.split("-")[1] || "XX";
    const count = processes.filter((p) => p.facilityId === form.facilityId).length;
    const seq = String(processes.length + 1).padStart(3, "0");
    const carbonSources = splitList(form.carbonSources).map((name) => ({
      name,
      scope: form.defaultScope,
    }));
    const newProc = {
      id: `PROC-${cc}-${seq}`,
      name: form.name,
      facilityId: form.facilityId,
      facilityName: form.facilityName,
      order: count + 1,
      input: form.input,
      output: form.output,
      productionLine: form.productionLine,
      status: form.status,
      energySources: splitList(form.energySources),
      meters: splitList(form.meters),
      carbonSources,
    };
    setProcesses((p) => [...p, newProc]);
    return newProc;
  };

  const getProcess = (id) => processes.find((p) => p.id === id);
  const getFacilityProcesses = (facilityId) =>
    processes.filter((p) => p.facilityId === facilityId).sort((a, b) => a.order - b.order);

  return (
    <ProcessesContext.Provider value={{ processes, addProcess, getProcess, getFacilityProcesses }}>
      {children}
    </ProcessesContext.Provider>
  );
};

export const useProcesses = () => useContext(ProcessesContext);
