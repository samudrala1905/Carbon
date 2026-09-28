// Mock facilities registry for Carbon Passport demo.
export const facilities = [
  {
    id: "FAC-GH-001",
    name: "Tema Processing Plant",
    type: "Production Facility",
    country: "Ghana",
    countryCode: "GH",
    address: "Heavy Industrial Area, Tema, Greater Accra, Ghana",
    status: "Active",
    processes: 6,
    devices: 18,
    dataCompleteness: 96,
    emissions: "12,480 tCO₂e",
    readiness: "Audit-Ready",
    geo: { lat: "5.6698° N", lng: "0.0166° W", timezone: "GMT (UTC+0)" },
    productionCapacity: "84,000 tonnes / year",
    operatingHours: "24/7 · 3 shifts",
    manager: {
      name: "Kwame Mensah",
      title: "Plant Operations Manager",
      email: "k.mensah@ecoglobal-freight.com",
    },
    energySources: ["Grid electricity (VRA)", "On-site solar 1.2 MW", "Diesel backup gensets"],
    utilities: ["Ghana Water Company", "Natural gas pipeline", "Fibre + industrial LAN"],
    products: ["Refined cocoa liquor", "Cocoa butter", "Packaged cocoa powder"],
    emissionSources: [
      { name: "Stationary combustion (gensets)", scope: "Scope 1" },
      { name: "Purchased electricity", scope: "Scope 2" },
      { name: "Process refrigerants", scope: "Scope 1" },
      { name: "Inbound logistics", scope: "Scope 3" },
    ],
    processTree: [
      {
        id: "PRC-001",
        name: "Bean Roasting & Grinding",
        lines: [
          {
            id: "LINE-01",
            name: "Roasting Line A",
            equipment: [
              { id: "EQ-101", name: "Rotary Roaster R1", meter: "MTR-101", source: "Modbus PLC" },
              { id: "EQ-102", name: "Grinder Mill G1", meter: "MTR-102", source: "IoT Gateway" },
            ],
          },
          {
            id: "LINE-02",
            name: "Roasting Line B",
            equipment: [
              { id: "EQ-103", name: "Rotary Roaster R2", meter: "MTR-103", source: "Modbus PLC" },
            ],
          },
        ],
      },
      {
        id: "PRC-002",
        name: "Pressing & Refining",
        lines: [
          {
            id: "LINE-03",
            name: "Hydraulic Press Line",
            equipment: [
              { id: "EQ-104", name: "Cocoa Press P1", meter: "MTR-104", source: "OPC-UA" },
              { id: "EQ-105", name: "Butter Filter F1", meter: "MTR-105", source: "Manual entry" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "FAC-DE-002",
    name: "Hamburg Distribution Hub",
    type: "Warehouse & Logistics",
    country: "Germany",
    countryCode: "DE",
    address: "Am Ballinkai 1, 21129 Hamburg, Germany",
    status: "Active",
    processes: 3,
    devices: 11,
    dataCompleteness: 88,
    emissions: "4,210 tCO₂e",
    readiness: "In Progress",
    geo: { lat: "53.5169° N", lng: "9.9330° E", timezone: "CET (UTC+1)" },
    productionCapacity: "220,000 pallets / year throughput",
    operatingHours: "Mon–Sat · 06:00–22:00",
    manager: {
      name: "Greta Bauer",
      title: "Hub Logistics Lead",
      email: "g.bauer@ecoglobal-freight.com",
    },
    energySources: ["Grid electricity (green tariff)", "Rooftop solar 800 kW"],
    utilities: ["Hamburg Wasser", "District heating", "5G private network"],
    products: ["Cross-dock freight", "Cold-chain storage"],
    emissionSources: [
      { name: "Purchased electricity", scope: "Scope 2" },
      { name: "Forklift fuel", scope: "Scope 1" },
      { name: "Outbound distribution", scope: "Scope 3" },
    ],
    processTree: [
      {
        id: "PRC-101",
        name: "Cold Storage",
        lines: [
          {
            id: "LINE-11",
            name: "Refrigeration Bank 1",
            equipment: [
              { id: "EQ-201", name: "Chiller Unit C1", meter: "MTR-201", source: "BMS Integration" },
              { id: "EQ-202", name: "Chiller Unit C2", meter: "MTR-202", source: "BMS Integration" },
            ],
          },
        ],
      },
      {
        id: "PRC-102",
        name: "Material Handling",
        lines: [
          {
            id: "LINE-12",
            name: "Forklift Fleet",
            equipment: [
              { id: "EQ-203", name: "Electric Forklift Fleet", meter: "MTR-203", source: "Telematics API" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "FAC-BR-003",
    name: "São Paulo Assembly Line",
    type: "Manufacturing",
    country: "Brazil",
    countryCode: "BR",
    address: "Av. das Nações Unidas, 12000, São Paulo, SP, Brazil",
    status: "Onboarding",
    processes: 4,
    devices: 7,
    dataCompleteness: 62,
    emissions: "6,905 tCO₂e",
    readiness: "Setup",
    geo: { lat: "23.5505° S", lng: "46.6333° W", timezone: "BRT (UTC-3)" },
    productionCapacity: "45,000 units / year",
    operatingHours: "Mon–Fri · 2 shifts",
    manager: {
      name: "Rafael Costa",
      title: "Manufacturing Supervisor",
      email: "r.costa@ecoglobal-freight.com",
    },
    energySources: ["Grid electricity (hydro-dominant)", "Biomass boiler"],
    utilities: ["SABESP water", "Compressed air plant", "Industrial ethernet"],
    products: ["EV delivery vans", "Battery modules"],
    emissionSources: [
      { name: "Purchased electricity", scope: "Scope 2" },
      { name: "Biomass combustion", scope: "Scope 1" },
      { name: "Purchased components", scope: "Scope 3" },
    ],
    processTree: [
      {
        id: "PRC-201",
        name: "Battery Assembly",
        lines: [
          {
            id: "LINE-21",
            name: "Cell Module Line",
            equipment: [
              { id: "EQ-301", name: "Module Welder W1", meter: "MTR-301", source: "Manual entry" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "FAC-GH-004",
    name: "Kumasi Solar Depot",
    type: "Renewable Energy Site",
    country: "Ghana",
    countryCode: "GH",
    address: "Suame Industrial Enclave, Kumasi, Ashanti, Ghana",
    status: "Inactive",
    processes: 1,
    devices: 4,
    dataCompleteness: 41,
    emissions: "0 tCO₂e",
    readiness: "Setup",
    geo: { lat: "6.6885° N", lng: "1.6244° W", timezone: "GMT (UTC+0)" },
    productionCapacity: "3.5 MW installed solar",
    operatingHours: "Daylight generation",
    manager: {
      name: "Abena Owusu",
      title: "Site Coordinator",
      email: "a.owusu@ecoglobal-freight.com",
    },
    energySources: ["Solar PV array", "Battery storage 2 MWh"],
    utilities: ["Grid export connection"],
    products: ["Exported renewable electricity"],
    emissionSources: [{ name: "Grid import (maintenance)", scope: "Scope 2" }],
    processTree: [
      {
        id: "PRC-301",
        name: "Power Generation",
        lines: [
          {
            id: "LINE-31",
            name: "Inverter Bank",
            equipment: [
              { id: "EQ-401", name: "String Inverter Cluster", meter: "MTR-401", source: "SCADA" },
            ],
          },
        ],
      },
    ],
  },
];

export const facilityTypes = [
  "Production Facility",
  "Manufacturing",
  "Warehouse & Logistics",
  "Renewable Energy Site",
  "Office / Administrative",
  "Data Centre",
];

export const facilityStatuses = ["Active", "Onboarding", "Inactive"];

export const deviceProtocols = [
  "Modbus PLC",
  "OPC-UA",
  "IoT Gateway",
  "BMS Integration",
  "SCADA",
  "Telematics API",
  "Manual entry",
];
