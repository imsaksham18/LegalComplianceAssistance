import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ROLES = {
  EXECUTIVE: {
    key: "EXECUTIVE",
    label: "Executive",
    description: "Board & CXO oversight",
  },
  COMPLIANCE_OFFICER: {
    key: "COMPLIANCE_OFFICER",
    label: "Compliance Officer",
    description: "Assess, remediate, approve",
  },
  AUDITOR: {
    key: "AUDITOR",
    label: "Auditor",
    description: "Independent read-only assurance",
  },
  ADMIN: {
    key: "ADMIN",
    label: "Administrator",
    description: "Platform & access management",
  },
};

const STORAGE_KEY = "lca.role";
const RoleContext = createContext(null);

// UI persona only; authorization must be enforced by JWT claims at the API Gateway.
export function RoleProvider({ children }) {
  const [roleKey, setRoleKey] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return ROLES[saved] ? saved : ROLES.EXECUTIVE.key;
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, roleKey), [roleKey]);

  const value = useMemo(
    () => ({
      role: ROLES[roleKey],
      setRole: setRoleKey,
      hasRole: (allowed) => !allowed || allowed.includes(roleKey),
    }),
    [roleKey],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
