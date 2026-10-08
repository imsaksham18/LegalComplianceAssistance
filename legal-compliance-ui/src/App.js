import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { RoleProvider } from "./context/RoleContext";
import { PlatformDataProvider } from "./context/PlatformDataContext";
import AppShell from "./layouts/AppShell";
import RequireRole from "./components/RequireRole";
import { ALL_NAV_ITEMS } from "./config/navigation";

import CommandCenter from "./pages/CommandCenter";
import Analytics from "./pages/Analytics";
import RiskHeatmap from "./pages/RiskHeatmap";
import GapAnalysis from "./pages/GapAnalysis";
import PolicyWorkflow from "./pages/PolicyWorkflow";
import AuditTimeline from "./pages/AuditTimeline";
import ExecutiveReport from "./pages/ExecutiveReport";
import Policies from "./pages/Policies";
import Regulations from "./pages/Regulations";
import Compliances from "./pages/Compliances";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

import "./styles/theme.css";

const PAGES = {
  "/": CommandCenter,
  "/analytics": Analytics,
  "/risk-heatmap": RiskHeatmap,
  "/gap-analysis": GapAnalysis,
  "/workflow": PolicyWorkflow,
  "/timeline": AuditTimeline,
  "/executive-report": ExecutiveReport,
  "/policies": Policies,
  "/regulations": Regulations,
  "/compliances": Compliances,
  "/reports": Reports,
  "/users": Users,
};

function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <PlatformDataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                {ALL_NAV_ITEMS.map(({ to, roles }) => {
                  const Page = PAGES[to];
                  return (
                    <Route
                      key={to}
                      path={to}
                      element={
                        <RequireRole roles={roles}>
                          <Page />
                        </RequireRole>
                      }
                    />
                  );
                })}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PlatformDataProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
