import { ROLES } from "../context/RoleContext";

const { EXECUTIVE, COMPLIANCE_OFFICER, AUDITOR, ADMIN } = ROLES;
const ALL = [EXECUTIVE.key, COMPLIANCE_OFFICER.key, AUDITOR.key, ADMIN.key];

export const NAVIGATION = [
  {
    section: "Intelligence",
    items: [
      { to: "/", label: "Command Center", icon: "command", roles: ALL },
      {
        to: "/analytics",
        label: "Compliance Analytics",
        icon: "analytics",
        roles: ALL,
      },
      {
        to: "/risk-heatmap",
        label: "Risk Heatmap",
        icon: "heatmap",
        roles: ALL,
      },
      {
        to: "/gap-analysis",
        label: "Gap Analysis",
        icon: "gap",
        roles: [COMPLIANCE_OFFICER.key, AUDITOR.key, ADMIN.key],
      },
    ],
  },
  {
    section: "Governance",
    items: [
      {
        to: "/workflow",
        label: "Policy Approvals",
        icon: "workflow",
        roles: [EXECUTIVE.key, COMPLIANCE_OFFICER.key, ADMIN.key],
      },
      {
        to: "/timeline",
        label: "Audit Timeline",
        icon: "timeline",
        roles: [COMPLIANCE_OFFICER.key, AUDITOR.key, ADMIN.key],
      },
      {
        to: "/executive-report",
        label: "Executive Report",
        icon: "report",
        roles: [EXECUTIVE.key, AUDITOR.key, ADMIN.key],
      },
    ],
  },
  {
    section: "Registers",
    items: [
      { to: "/policies", label: "Policies", icon: "policy", roles: ALL },
      {
        to: "/regulations",
        label: "Regulations",
        icon: "regulation",
        roles: ALL,
      },
      {
        to: "/compliances",
        label: "Assessments",
        icon: "compliance",
        roles: ALL,
      },
      { to: "/reports", label: "Reports", icon: "file", roles: ALL },
    ],
  },
  {
    section: "Administration",
    items: [
      {
        to: "/users",
        label: "Users & Access",
        icon: "users",
        roles: [ADMIN.key],
      },
    ],
  },
];

export const ALL_NAV_ITEMS = NAVIGATION.flatMap((group) => group.items);

export const findNavItem = (pathname) =>
  ALL_NAV_ITEMS.find((item) => item.to === pathname);
