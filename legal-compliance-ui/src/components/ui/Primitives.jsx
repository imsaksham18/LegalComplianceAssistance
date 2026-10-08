import Icon from "./Icon";

export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-header d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
      <div>
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2 no-print">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel-header">
          <div>
            <h2 className="panel-title">{title}</h2>
            {subtitle && <div className="panel-subtitle">{subtitle}</div>}
          </div>
          {action}
        </header>
      )}
      <div className={`panel-body ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function KpiCard({
  label,
  value,
  suffix,
  hint,
  tone = "primary",
  icon,
}) {
  return (
    <div className={`kpi-card kpi-${tone}`}>
      <div className="d-flex justify-content-between align-items-start">
        <span className="kpi-label">{label}</span>
        {icon && (
          <span className="kpi-icon">
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <div className="kpi-value">
        {value}
        {suffix && <span className="kpi-suffix">{suffix}</span>}
      </div>
      {hint && <div className="kpi-hint">{hint}</div>}
    </div>
  );
}

export function ToneBadge({ tone = "secondary", children }) {
  return <span className={`tone-badge tone-${tone}`}>{children}</span>;
}

export function RiskBadge({ risk }) {
  return (
    <ToneBadge tone={risk.level.tone}>
      {risk.level.label} · {risk.score}
    </ToneBadge>
  );
}

export function EmptyState({ icon = "search", title, children }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={28} />
      <div className="fw-semibold mt-2">{title}</div>
      {children && (
        <div className="text-body-secondary small mt-1">{children}</div>
      )}
    </div>
  );
}

export function LoadingState({ rows = 3 }) {
  return (
    <div className="placeholder-glow" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <span
          key={i}
          className="placeholder col-12 rounded mb-2"
          style={{ height: 18 }}
        />
      ))}
    </div>
  );
}
