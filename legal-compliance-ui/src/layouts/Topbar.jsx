import { useLocation } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { findNavItem } from "../config/navigation";
import { ROLES, useRole } from "../context/RoleContext";
import { useTheme } from "../context/ThemeContext";
import { usePlatformData } from "../context/PlatformDataContext";

function Topbar({ onToggleSidebar, onOpenSearch, onOpenCopilot }) {
  const { pathname } = useLocation();
  const { role, setRole } = useRole();
  const { theme, toggleTheme } = useTheme();
  const { refresh, refreshing, fetchedAt, degraded } = usePlatformData();
  const current = findNavItem(pathname);

  return (
    <header className="app-topbar no-print">
      <button
        className="icon-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
      >
        <Icon name="menu" />
      </button>

      <div className="topbar-breadcrumb d-none d-md-block">
        <span className="text-body-secondary">Workspace</span>
        <span className="mx-2 text-body-tertiary">/</span>
        <span className="fw-semibold">{current?.label || "Page"}</span>
      </div>

      <button className="search-trigger" onClick={onOpenSearch}>
        <Icon name="search" size={16} />
        <span className="d-none d-sm-inline">
          Search policies, regulations, risks…
        </span>
        <kbd className="d-none d-lg-inline">⌘K</kbd>
      </button>

      <div className="topbar-actions">
        <span
          className={`sync-pill d-none d-xl-inline-flex ${degraded ? "degraded" : ""}`}
          title="Auto-refresh every 60s"
        >
          <span className="live-dot" />
          {degraded ? "Degraded" : "Live"}
          {fetchedAt &&
            ` · ${fetchedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </span>

        <button
          className="icon-btn"
          onClick={refresh}
          aria-label="Refresh data"
          disabled={refreshing}
        >
          <Icon name="refresh" className={refreshing ? "spin" : ""} />
        </button>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>

        <button className="btn btn-copilot btn-sm" onClick={onOpenCopilot}>
          <Icon name="sparkle" size={16} />{" "}
          <span className="d-none d-md-inline">Copilot</span>
        </button>

        <select
          className="form-select form-select-sm role-select"
          value={role.key}
          onChange={(e) => setRole(e.target.value)}
          aria-label="View as role"
        >
          {Object.values(ROLES).map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Topbar;
