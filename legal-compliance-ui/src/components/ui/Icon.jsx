// Minimal stroke icon set (24x24, currentColor) — avoids an extra icon dependency.
const PATHS = {
  command: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  analytics: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  heatmap:
    "M3 3h5v5H3zM10 3h5v5h-5zM17 3h4v5h-4zM3 10h5v5H3zM10 10h5v5h-5zM17 10h4v5h-4zM3 17h5v4H3zM10 17h5v4h-5zM17 17h4v4h-4z",
  gap: "M12 2l10 18H2L12 2zM12 9v5M12 17v.5",
  timeline: "M12 2v20M5 6h7M12 12h7M5 18h7",
  workflow: "M5 4h4v4H5zM15 16h4v4h-4zM7 8v4a2 2 0 002 2h6a2 2 0 012 2",
  report: "M6 2h9l5 5v15H6zM15 2v5h5M9 13h7M9 17h7",
  policy: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z",
  regulation: "M12 3v18M5 7h14M5 7l-3 7h6zM19 7l-3 7h6zM8 21h8",
  compliance: "M9 12l2 2 4-4M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z",
  file: "M6 2h9l5 5v15H6zM15 2v5h5",
  users:
    "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
  sparkle:
    "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  sun: "M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z",
  menu: "M3 6h18M3 12h18M3 18h18",
  refresh:
    "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15",
  close: "M18 6L6 18M6 6l12 12",
  arrow: "M5 12h14M13 5l7 7-7 7",
  server: "M2 3h20v7H2zM2 14h20v7H2zM6 6.5h.01M6 17.5h.01",
  target:
    "M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  print:
    "M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z",
  lock: "M5 11h14v11H5zM8 11V7a4 4 0 018 0v4",
};

function Icon({ name, size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name] || PATHS.file} />
    </svg>
  );
}

export default Icon;
