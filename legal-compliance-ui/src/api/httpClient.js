import axios from "axios";

const createCorrelationId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8082",
  timeout: 10000,
});

// Lets a single UI action be traced across gateway and microservice logs.
httpClient.interceptors.request.use((config) => {
  config.headers["X-Correlation-Id"] = createCorrelationId();
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = new Error(
      error.response?.data?.message || error.message || "Request failed",
    );
    normalized.status = error.response?.status ?? null;
    normalized.correlationId = error.config?.headers?.["X-Correlation-Id"];
    return Promise.reject(normalized);
  },
);

export default httpClient;
