// Policy approval state machine. Decisions persist locally until a workflow endpoint exists.

const STORAGE_KEY = "lca.workflow.v1";

export const STAGES = [
  { key: "DRAFT", label: "Draft" },
  { key: "LEGAL_REVIEW", label: "Legal Review" },
  { key: "COMPLIANCE_REVIEW", label: "Compliance Review" },
  { key: "EXECUTIVE_APPROVAL", label: "Executive Approval" },
  { key: "PUBLISHED", label: "Published" },
];

export const REJECTED = { key: "REJECTED", label: "Rejected" };

export const TRANSITIONS = [
  {
    from: "DRAFT",
    to: "LEGAL_REVIEW",
    action: "Submit for Legal Review",
    roles: ["COMPLIANCE_OFFICER", "ADMIN"],
  },
  {
    from: "LEGAL_REVIEW",
    to: "COMPLIANCE_REVIEW",
    action: "Legal Sign-off",
    roles: ["COMPLIANCE_OFFICER", "ADMIN"],
  },
  {
    from: "COMPLIANCE_REVIEW",
    to: "EXECUTIVE_APPROVAL",
    action: "Compliance Sign-off",
    roles: ["COMPLIANCE_OFFICER", "ADMIN"],
    requiresNoHighRisk: true,
  },
  {
    from: "EXECUTIVE_APPROVAL",
    to: "PUBLISHED",
    action: "Approve & Publish",
    roles: ["EXECUTIVE", "ADMIN"],
  },
  {
    from: "LEGAL_REVIEW",
    to: "REJECTED",
    action: "Reject",
    roles: ["COMPLIANCE_OFFICER", "ADMIN"],
  },
  {
    from: "COMPLIANCE_REVIEW",
    to: "REJECTED",
    action: "Reject",
    roles: ["COMPLIANCE_OFFICER", "ADMIN"],
  },
  {
    from: "EXECUTIVE_APPROVAL",
    to: "REJECTED",
    action: "Reject",
    roles: ["EXECUTIVE", "ADMIN"],
  },
  {
    from: "REJECTED",
    to: "DRAFT",
    action: "Reopen as Draft",
    roles: ["COMPLIANCE_OFFICER", "ADMIN"],
  },
];

export const stageLabel = (key) =>
  (
    STAGES.find((s) => s.key === key) ||
    (key === REJECTED.key ? REJECTED : { label: key })
  ).label;

export const loadWorkflowState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveWorkflowState = (state) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

// Initial stage is inferred from real compliance evidence for the policy.
export const deriveStage = (policyAssessments) => {
  if (!policyAssessments.length) return "DRAFT";
  return policyAssessments.every((a) => a.risk.status.key === "COMPLIANT")
    ? "PUBLISHED"
    : "COMPLIANCE_REVIEW";
};

export const currentStage = (policyId, policyAssessments, state) =>
  state[policyId]?.stage || deriveStage(policyAssessments);

export const availableTransitions = (stage, role, policyAssessments) =>
  TRANSITIONS.filter((t) => t.from === stage && t.roles.includes(role)).map(
    (t) => {
      const blockingRisks = t.requiresNoHighRisk
        ? policyAssessments.filter((a) => a.risk.score >= 65)
        : [];
      return {
        ...t,
        blocked: blockingRisks.length > 0,
        blockedReason: blockingRisks.length
          ? `${blockingRisks.length} high-risk finding(s) must be remediated first`
          : null,
      };
    },
  );

export const applyTransition = (state, policyId, transition, actor) => {
  const entry = state[policyId] || { history: [] };
  const next = {
    ...state,
    [policyId]: {
      stage: transition.to,
      history: [
        ...entry.history,
        {
          from: transition.from,
          to: transition.to,
          action: transition.action,
          by: actor.label,
          role: actor.key,
          at: new Date().toISOString(),
        },
      ],
    },
  };
  saveWorkflowState(next);
  return next;
};
