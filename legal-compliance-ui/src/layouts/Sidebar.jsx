import { NavLink } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { NAVIGATION } from "../config/navigation";
import { useRole } from "../context/RoleContext";

function Sidebar({ collapsed, mobileOpen, onNavigate }) {
  const { hasRole } = useRole();

  return (
    <aside
      className={`app-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-brand">
        <span className="brand-mark">
          <Icon name="regulation" size={18} />
        </span>
        <span className="brand-text">
          LexComply<span className="brand-suffix">Intelligence</span>
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {NAVIGATION.map((group) => {
          const items = group.items.filter((item) => hasRole(item.roles));
          if (!items.length) return null;
          return (
            <div key={group.section} className="nav-group">
              <div className="nav-section">{group.section}</div>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} />
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="live-dot" />{" "}
        <span className="nav-label">Connected to API Gateway</span>
      </div>
    </aside>
  );
}

export default Sidebar;
