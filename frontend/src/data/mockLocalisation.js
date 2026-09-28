// Localisation presets for multi-jurisdiction Carbon Passport support.

export const MARKET_ROADMAP = ["Ghana", "India", "EU", "UK", "Other markets"];

export const MEASUREMENT_SYSTEMS = ["Metric", "Imperial"];
export const ENERGY_UNITS = ["kWh / MWh", "MWh / GWh", "GJ / TJ"];
export const FUEL_UNITS = ["L / kg", "gal / lb", "m³ / kg"];
export const MASS_UNITS = ["kg / tonne", "lb / short ton"];
export const EMISSION_UNITS = ["kgCO₂e / tCO₂e", "lbCO₂e / short tonCO₂e"];
export const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
export const NUMBER_FORMATS = ["1,234.56", "1.234,56", "1,23,456.78"];

export const PRESETS = {
  Ghana: {
    key: "Ghana",
    country: "Ghana",
    currency: "GHS",
    timezone: "GMT (UTC+0)",
    language: "English",
    measurement: "Metric",
    energy: "kWh / MWh",
    fuel: "L / kg",
    mass: "kg / tonne",
    emissions: "kgCO₂e / tCO₂e",
    frameworks: ["GHG Protocol Corporate Standard", "ISO 14064-1"],
    gridRegion: "Ghana (VRA / GRIDCo)",
    datasets: ["IPCC 2006 Guidelines", "DEFRA 2025"],
    cbamMarket: "European Union",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1,234.56",
    certLanguage: "English",
  },
  India: {
    key: "India",
    country: "India",
    currency: "INR",
    timezone: "IST (UTC+5:30)",
    language: "English",
    measurement: "Metric",
    energy: "kWh / MWh",
    fuel: "L / kg",
    mass: "kg / tonne",
    emissions: "kgCO₂e / tCO₂e",
    frameworks: ["GHG Protocol", "BRSR (SEBI)", "ISO 14064-1"],
    gridRegion: "India (CEA National Grid)",
    datasets: ["IPCC 2006 Guidelines", "CEA CO₂ Baseline v20"],
    cbamMarket: "European Union",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1,23,456.78",
    certLanguage: "English",
  },
  EU: {
    key: "EU",
    country: "European Union",
    currency: "EUR",
    timezone: "CET (UTC+1)",
    language: "English",
    measurement: "Metric",
    energy: "MWh / GWh",
    fuel: "L / kg",
    mass: "kg / tonne",
    emissions: "kgCO₂e / tCO₂e",
    frameworks: ["EU CSRD / ESRS", "GHG Protocol", "ISO 14064-1"],
    gridRegion: "EU-27 (AIB Residual Mix)",
    datasets: ["EF 3.1 (European Commission)", "IPCC 2006 Guidelines"],
    cbamMarket: "European Union (domestic)",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1.234,56",
    certLanguage: "English (multi-language export)",
  },
  UK: {
    key: "UK",
    country: "United Kingdom",
    currency: "GBP",
    timezone: "GMT (UTC+0)",
    language: "English",
    measurement: "Metric",
    energy: "kWh / MWh",
    fuel: "L / kg",
    mass: "kg / tonne",
    emissions: "kgCO₂e / tCO₂e",
    frameworks: ["SECR", "GHG Protocol", "ISO 14064-1"],
    gridRegion: "UK (National Grid ESO)",
    datasets: ["DEFRA 2025", "IPCC 2006 Guidelines"],
    cbamMarket: "UK CBAM (from 2027)",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1,234.56",
    certLanguage: "English",
  },
};

export const PRESET_KEYS = Object.keys(PRESETS);
export const defaultConfig = PRESETS.Ghana;
