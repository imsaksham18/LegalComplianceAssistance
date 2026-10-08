import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./ui/Icon";
import { ALL_NAV_ITEMS } from "../config/navigation";
import { usePlatformData } from "../context/PlatformDataContext";
import { useRole } from "../context/RoleContext";

const MAX_RESULTS = 12;

function CommandPalette({ open, onClose, onAskCopilot }) {
  const navigate = useNavigate();
  const { intel, data } = usePlatformData();
  const { hasRole } = useRole();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const index = useMemo(() => {
    const pages = ALL_NAV_ITEMS.filter((i) => hasRole(i.roles)).map((i) => ({
      type: "Page",
      label: i.label,
      sub: "Navigate",
      icon: i.icon,
      route: i.to,
    }));
    const policies = (data.policies || []).map((p) => ({
      type: "Policy",
      label: p.title,
      sub: p.description,
      icon: "policy",
      route: "/policies",
    }));
    const regulations = (data.regulations || []).map((r) => ({
      type: "Regulation",
      label: r.regulationName,
      sub: r.country,
      icon: "regulation",
      route: "/regulations",
    }));
    const assessments = intel.assessments.map((a) => ({
      type: "Risk",
      label: `${a.policyName} × ${a.regulationName}`,
      sub: `${a.risk.level.label} · ${a.risk.status.label}`,
      icon: "heatmap",
      route: "/risk-heatmap",
    }));
    const reports = (data.reports || []).map((r) => ({
      type: "Report",
      label: r.reportName,
      sub: `${r.reportType} · ${r.status}`,
      icon: "file",
      route: "/reports",
    }));
    const users = hasRole(["ADMIN"])
      ? (data.users || []).map((u) => ({
          type: "User",
          label: u.username,
          sub: `${u.email} · ${u.role}`,
          icon: "users",
          route: "/users",
        }))
      : [];
    return [
      ...pages,
      ...policies,
      ...regulations,
      ...assessments,
      ...reports,
      ...users,
    ];
  }, [data, intel, hasRole]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? index.filter((item) =>
          `${item.type} ${item.label} ${item.sub || ""}`
            .toLowerCase()
            .includes(q),
        )
      : index.filter((item) => item.type === "Page");
    return matches.slice(0, MAX_RESULTS);
  }, [index, query]);

  if (!open) return null;

  const select = (item) => {
    onClose();
    if (item.type === "Ask") onAskCopilot(query);
    else navigate(item.route);
  };

  const options = query.trim()
    ? [
        ...results,
        {
          type: "Ask",
          label: `Ask Copilot: "${query}"`,
          sub: "Grounded answer from platform data",
          icon: "sparkle",
        },
      ]
    : results;

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && options[active]) {
      select(options[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="palette-input">
          <Icon name="search" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search everything or ask a question…"
            aria-label="Search"
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-results list-unstyled mb-0" role="listbox">
          {options.map((item, i) => (
            <li
              key={`${item.type}-${item.label}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "active" : ""}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(item)}
            >
              <Icon name={item.icon} size={16} />
              <div className="flex-grow-1 text-truncate">
                <div className="text-truncate">{item.label}</div>
                {item.sub && (
                  <div className="small text-body-secondary text-truncate">
                    {item.sub}
                  </div>
                )}
              </div>
              <span className="palette-type">{item.type}</span>
            </li>
          ))}
          {!options.length && (
            <li className="text-body-secondary">No results</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CommandPalette;
