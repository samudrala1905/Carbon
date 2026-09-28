import { createContext, useContext, useState } from "react";
import { defaultConfig } from "@/data/mockLocalisation";

const LocalisationContext = createContext(null);

export const LocalisationProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);

  const updateConfig = (next) => setConfig(next);

  return (
    <LocalisationContext.Provider value={{ config, updateConfig }}>
      {children}
    </LocalisationContext.Provider>
  );
};

export const useLocalisation = () => useContext(LocalisationContext);
