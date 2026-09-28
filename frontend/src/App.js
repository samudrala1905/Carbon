import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { FacilitiesProvider } from "@/context/FacilitiesContext";
import { ProcessesProvider } from "@/context/ProcessesContext";
import OrganisationProfile from "@/pages/OrganisationProfile";
import Facilities from "@/pages/Facilities";
import FacilityDetail from "@/pages/FacilityDetail";
import Processes from "@/pages/Processes";
import ProcessDetail from "@/pages/ProcessDetail";

function App() {
  return (
    <div className="App">
      <FacilitiesProvider>
        <ProcessesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<OrganisationProfile />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/facilities/:id" element={<FacilityDetail />} />
              <Route path="/processes" element={<Processes />} />
              <Route path="/processes/:id" element={<ProcessDetail />} />
            </Routes>
          </BrowserRouter>
        </ProcessesProvider>
      </FacilitiesProvider>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
