// Dependency-free SVG charts driven by CSS variables so they follow light/dark theme.

const TONE_COLORS = {
  success: "var(--lca-success)",
  warning: "var(--lca-warning)",
  danger: "var(--lca-danger)",
  primary: "var(--lca-accent)",
  secondary: "var(--lca-muted)",
};

const PALETTE = [
  "#4f46e5",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#64748b",
];

const STATUS_COLORS = {
  COMPLIANT: "#10b981",
  PARTIAL: "#f59e0b",
  UNDER_REVIEW: "#0ea5e9",
  NON_COMPLIANT: "#ef4444",
  UNKNOWN: "#94a3b8",
  CRITICAL: "#b91c1c",
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#10b981",
};

export const colorFor = (key, index) =>
  STATUS_COLORS[key] || PALETTE[index % PALETTE.length];

export function Gauge({ value, label, tone = "primary", size = 220 }) {
  const radius = 80;
  const arc = Math.PI * radius;
  const filled =
    value === null ? 0 : (arc * Math.max(0, Math.min(100, value))) / 100;

  return (
    <svg
      viewBox="0 0 200 120"
      width={size}
      role="img"
      aria-label={`${label}: ${value ?? "no data"}`}
    >
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke="var(--lca-track)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke={TONE_COLORS[tone]}
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${arc}`}
        className="gauge-fill"
      />
      <text x="100" y="88" textAnchor="middle" className="gauge-value">
        {value ?? "—"}
      </text>
      <text x="100" y="110" textAnchor="middle" className="gauge-label">
        {label}
      </text>
    </svg>
  );
}

export function DonutChart({ data, centerLabel, size = 160 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="d-flex align-items-center gap-4 flex-wrap">
      <svg
        viewBox="0 0 160 160"
        width={size}
        role="img"
        aria-label={centerLabel}
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--lca-track)"
          strokeWidth="20"
        />
        {total > 0 &&
          data.map((d, i) => {
            const length = (d.value / total) * circumference;
            const segment = (
              <circle
                key={d.key}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={colorFor(d.key, i)}
                strokeWidth="20"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </circle>
            );
            offset += length;
            return segment;
          })}
        <text x="80" y="78" textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x="80" y="98" textAnchor="middle" className="donut-label">
          {centerLabel}
        </text>
      </svg>
      <ul className="chart-legend list-unstyled mb-0">
        {data.map((d, i) => (
          <li key={d.key}>
            <span
              className="legend-dot"
              style={{ background: colorFor(d.key, i) }}
            />
            <span className="legend-label">{d.label}</span>
            <span className="legend-value">
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({ data, max = 100, unit = "", toneFor }) {
  return (
    <ul className="bar-list list-unstyled mb-0">
      {data.map((d, i) => (
        <li key={d.id ?? d.key ?? i}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-truncate me-2">{d.label}</span>
            <span className="fw-semibold">
              {d.value}
              {unit}
            </span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${max ? Math.min(100, (d.value / max) * 100) : 0}%`,
                background: toneFor
                  ? TONE_COLORS[toneFor(d)]
                  : colorFor(d.key, i),
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function RadarChart({ dimensions, size = 240 }) {
  const center = 120;
  const radius = 85;
  const angle = (i) => (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
  const point = (i, r) => [
    center + r * Math.cos(angle(i)),
    center + r * Math.sin(angle(i)),
  ];
  const polygon = (scale) =>
    dimensions.map((d, i) => point(i, radius * scale(d)).join(",")).join(" ");

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      role="img"
      aria-label="Maturity dimensions"
    >
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={polygon(() => ring)}
          fill="none"
          stroke="var(--lca-track)"
        />
      ))}
      <polygon
        points={polygon((d) => Math.max(0.02, d.value))}
        fill="var(--lca-accent-soft)"
        stroke="var(--lca-accent)"
        strokeWidth="2"
      />
      {dimensions.map((d, i) => {
        const [x, y] = point(i, radius + 18);
        return (
          <text
            key={d.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="radar-label"
          >
            {d.label.split(" ")[1] || d.label}
          </text>
        );
      })}
    </svg>
  );
}
