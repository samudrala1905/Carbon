import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { FacilitiesProvider } from "@/context/FacilitiesContext";
import { ProcessesProvider } from "@/context/ProcessesContext";
import { UsersProvider } from "@/context/UsersContext";
import { PeriodsProvider } from "@/context/PeriodsContext";
import { LocalisationProvider } from "@/context/LocalisationContext";
import { ApprovalsProvider } from "@/context/ApprovalsContext";
import OrganisationProfile from "@/pages/OrganisationProfile";
import Facilities from "@/pages/Facilities";
import FacilityDetail from "@/pages/FacilityDetail";
import Processes from "@/pages/Processes";
import ProcessDetail from "@/pages/ProcessDetail";
import UsersRoles from "@/pages/UsersRoles";
import ReportingPeriods from "@/pages/ReportingPeriods";
import PeriodDetail from "@/pages/PeriodDetail";
import Localisation from "@/pages/Localisation";
import Approvals from "@/pages/Approvals";

function App() {
  return (
    <div className="App">
      <FacilitiesProvider>
        <ProcessesProvider>
          <UsersProvider>
            <PeriodsProvider>
              <LocalisationProvider>
                <ApprovalsProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<OrganisationProfile />} />
                      <Route path="/facilities" element={<Facilities />} />
                      <Route path="/facilities/:id" element={<FacilityDetail />} />
                      <Route path="/processes" element={<Processes />} />
                      <Route path="/processes/:id" element={<ProcessDetail />} />
                      <Route path="/users" element={<UsersRoles />} />
                      <Route path="/periods" element={<ReportingPeriods />} />
                      <Route path="/periods/:id" element={<PeriodDetail />} />
                      <Route path="/localisation" element={<Localisation />} />
                      <Route path="/approvals" element={<Approvals />} />
                    </Routes>
                  </BrowserRouter>
                </ApprovalsProvider>
              </LocalisationProvider>
            </PeriodsProvider>
          </UsersProvider>
        </ProcessesProvider>
      </FacilitiesProvider>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
