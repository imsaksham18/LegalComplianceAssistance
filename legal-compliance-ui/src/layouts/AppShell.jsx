import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "../components/CommandPalette";
import CopilotDrawer from "../components/CopilotDrawer";

const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;

function AppShell() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [seedQuestion, setSeedQuestion] = useState(null);

  const openCopilot = useCallback((question) => {
    if (typeof question === "string" && question.trim())
      setSeedQuestion(question);
    setCopilotOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const toggleSidebar = () =>
    isDesktop() ? setCollapsed((c) => !c) : setMobileOpen((o) => !o);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div
          className="drawer-backdrop d-lg-none"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="app-main">
        <Topbar
          onToggleSidebar={toggleSidebar}
          onOpenSearch={() => setPaletteOpen(true)}
          onOpenCopilot={() => openCopilot()}
        />
        <main className="app-content">
          <Outlet context={{ openCopilot }} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onAskCopilot={openCopilot}
      />
      <CopilotDrawer
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        seedQuestion={seedQuestion}
        onSeedConsumed={() => setSeedQuestion(null)}
      />
    </div>
  );
}

export default AppShell;
