import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPlatformSnapshot } from "../services/dashboardService";
import { buildIntelligence } from "../engine/riskEngine";

const REFRESH_INTERVAL_MS = 60000;
const PlatformDataContext = createContext(null);

export function PlatformDataProvider({ children }) {
  const [snapshot, setSnapshot] = useState({
    data: {},
    services: [],
    fetchedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const next = await getPlatformSnapshot();
    setSnapshot(next);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const intel = useMemo(
    () => buildIntelligence(snapshot.data),
    [snapshot.data],
  );

  const value = useMemo(
    () => ({
      ...snapshot,
      intel,
      loading,
      refreshing,
      refresh,
      degraded: snapshot.services.some((s) => s.status !== "UP"),
    }),
    [snapshot, intel, loading, refreshing, refresh],
  );

  return (
    <PlatformDataContext.Provider value={value}>
      {children}
    </PlatformDataContext.Provider>
  );
}

export const usePlatformData = () => useContext(PlatformDataContext);
