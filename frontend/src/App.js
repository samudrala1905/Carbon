import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { FacilitiesProvider } from "@/context/FacilitiesContext";
import OrganisationProfile from "@/pages/OrganisationProfile";
import Facilities from "@/pages/Facilities";
import FacilityDetail from "@/pages/FacilityDetail";

function App() {
  return (
    <div className="App">
      <FacilitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OrganisationProfile />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/facilities/:id" element={<FacilityDetail />} />
          </Routes>
        </BrowserRouter>
      </FacilitiesProvider>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
