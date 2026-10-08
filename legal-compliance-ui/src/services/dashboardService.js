import httpClient from "../api/httpClient";

export const PLATFORM_SERVICES = [
  { key: "policies", name: "Policy Service", path: "/policies" },
  { key: "regulations", name: "Regulation Service", path: "/regulations" },
  { key: "compliances", name: "Compliance Service", path: "/compliances" },
  { key: "reports", name: "Report Service", path: "/reports" },
  { key: "users", name: "User Service", path: "/users" },
];

const probeService = async (service) => {
  const started = performance.now();
  try {
    const { data } = await httpClient.get(service.path);
    return {
      ...service,
      status: "UP",
      latencyMs: Math.round(performance.now() - started),
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      ...service,
      status: "DOWN",
      latencyMs: null,
      error: error.message,
      data: [],
    };
  }
};

// One service being down degrades the dashboard instead of blanking it.
export const getPlatformSnapshot = async () => {
  const results = await Promise.all(PLATFORM_SERVICES.map(probeService));

  return {
    data: Object.fromEntries(results.map((r) => [r.key, r.data])),
    services: results.map(({ data, ...health }) => health),
    fetchedAt: new Date(),
  };
};

export const getDashboardData = async () => {
  const { data } = await getPlatformSnapshot();
  return Object.fromEntries(
    Object.entries(data).map(([key, rows]) => [key, rows.length]),
  );
};
