import { createContext, useContext, useState } from "react";
import { facilities as seed } from "@/data/mockFacilities";

const FacilitiesContext = createContext(null);

const countryCodes = { ghana: "GH", germany: "DE", brazil: "BR", "united kingdom": "GB", usa: "US", "united states": "US" };

export const FacilitiesProvider = ({ children }) => {
  const [facilities, setFacilities] = useState(seed);

  const addFacility = (form) => {
    const cc = countryCodes[form.country.toLowerCase()] || form.country.slice(0, 2).toUpperCase();
    const seq = String(facilities.length + 1).padStart(3, "0");
    const newFac = {
      id: `FAC-${cc}-${seq}`,
      name: form.name,
      type: form.type,
      country: form.country,
      countryCode: cc,
      address: form.address,
      status: form.status,
      processes: 0,
      devices: 0,
      dataCompleteness: 10,
      emissions: "0 tCO₂e",
      readiness: "Setup",
      geo: { lat: "—", lng: "—", timezone: "—" },
      productionCapacity: form.productionCapacity,
      operatingHours: form.operatingHours,
      manager: { name: form.managerName, title: "Facility Manager", email: "" },
      energySources: [],
      utilities: [],
      products: [],
      emissionSources: [],
      processTree: [],
    };
    setFacilities((f) => [newFac, ...f]);
    return newFac;
  };

  const updateFacility = (id, form) => {
    setFacilities((list) =>
      list.map((f) =>
        f.id === id
          ? {
              ...f,
              name: form.name,
              type: form.type,
              country: form.country,
              address: form.address,
              status: form.status,
              productionCapacity: form.productionCapacity,
              operatingHours: form.operatingHours,
              manager: { ...f.manager, name: form.managerName },
            }
          : f,
      ),
    );
  };

  const connectDevice = (facilityId, device) => {
    setFacilities((list) =>
      list.map((f) => {
        if (f.id !== facilityId) return f;
        const eq = {
          id: `EQ-${Math.floor(Math.random() * 900 + 100)}`,
          name: device.name,
          meter: device.meter,
          source: device.source,
        };
        let tree = f.processTree;
        if (tree.length === 0) {
          tree = [{ id: "PRC-NEW", name: "General Operations", lines: [{ id: "LINE-NEW", name: "Line 1", equipment: [eq] }] }];
        } else {
          tree = tree.map((p) => {
            if (p.id !== device.process) return p;
            const lines = [...p.lines];
            if (lines.length === 0) lines.push({ id: "LINE-NEW", name: "Line 1", equipment: [] });
            lines[0] = { ...lines[0], equipment: [...lines[0].equipment, eq] };
            return { ...p, lines };
          });
        }
        return { ...f, processTree: tree, devices: f.devices + 1 };
      }),
    );
  };

  const getFacility = (id) => facilities.find((f) => f.id === id);

  return (
    <FacilitiesContext.Provider value={{ facilities, addFacility, updateFacility, connectDevice, getFacility }}>
      {children}
    </FacilitiesContext.Provider>
  );
};

export const useFacilities = () => useContext(FacilitiesContext);
