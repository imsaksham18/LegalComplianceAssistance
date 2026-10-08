import {
  buildIntelligence,
  classifyStatus,
  scoreAssessment,
} from "./riskEngine";
import {
  applyTransition,
  availableTransitions,
  deriveStage,
} from "./workflowEngine";
import { answerLocally } from "./copilotEngine";

const dataset = {
  policies: [
    { id: 1, title: "Data Retention Policy", description: "Retention rules" },
    { id: 2, title: "Access Control Policy", description: "IAM rules" },
    { id: 3, title: "Vendor Policy", description: "Third parties" },
  ],
  regulations: [
    {
      id: 10,
      regulationName: "GDPR",
      country: "EU",
      description: "EU privacy",
    },
    {
      id: 11,
      regulationName: "IT Act",
      country: "India",
      description: "Indian IT law",
    },
    {
      id: 12,
      regulationName: "HIPAA",
      country: "USA",
      description: "Health data",
    },
  ],
  compliances: [
    {
      id: 100,
      policyId: 1,
      regulationId: 10,
      status: "NON_COMPLIANT",
      remarks: "Breach risk, penalty exposure",
    },
    {
      id: 101,
      policyId: 2,
      regulationId: 11,
      status: "COMPLIANT",
      remarks: "Evidence verified",
    },
    {
      id: 102,
      policyId: 2,
      regulationId: 10,
      status: "PARTIAL",
      remarks: "Missing MFA evidence",
    },
  ],
  reports: [
    {
      id: 1,
      reportName: "Q3",
      reportType: "Audit",
      status: "Final",
      generatedDate: "2026-09-30",
    },
  ],
  users: [{ id: 1, username: "admin", email: "a@x.com", role: "ADMIN" }],
};

describe("risk engine", () => {
  test("classifies non-compliant before compliant", () => {
    expect(classifyStatus("Non Compliant").key).toBe("NON_COMPLIANT");
    expect(classifyStatus("COMPLIANT").key).toBe("COMPLIANT");
    expect(classifyStatus("weird").key).toBe("UNKNOWN");
  });

  test("weights jurisdiction, framework and remark signals with explainable drivers", () => {
    const result = scoreAssessment(
      dataset.compliances[0],
      dataset.regulations[0],
    );
    expect(result.score).toBe(100);
    expect(result.level.key).toBe("CRITICAL");
    expect(result.drivers.some((d) => d.includes("Jurisdiction"))).toBe(true);
  });

  test("compliant controls carry zero residual risk", () => {
    expect(
      scoreAssessment(dataset.compliances[1], dataset.regulations[1]).score,
    ).toBe(0);
  });

  test("builds health, coverage, gaps and recommendations", () => {
    const intel = buildIntelligence(dataset);
    expect(intel.healthScore).toBeGreaterThan(0);
    expect(intel.healthScore).toBeLessThan(100);
    expect(
      intel.gaps.uncoveredRegulations.map((r) => r.regulationName),
    ).toEqual(["HIPAA"]);
    expect(intel.gaps.unassessedPolicies.map((p) => p.id)).toEqual([3]);
    expect(intel.recommendations[0].priority).toBe("P1");
    expect(intel.maturity.level).toBeGreaterThanOrEqual(1);
  });

  test("handles an empty platform", () => {
    const intel = buildIntelligence({});
    expect(intel.healthScore).toBeNull();
    expect(intel.health.label).toBe("No Data");
  });
});

describe("workflow engine", () => {
  beforeEach(() => localStorage.clear());

  test("derives stage from evidence and blocks sign-off on high risk", () => {
    const intel = buildIntelligence(dataset);
    const scoped = intel.assessments.filter((a) => a.policyId === 1);
    expect(deriveStage(scoped)).toBe("COMPLIANCE_REVIEW");

    const signOff = availableTransitions(
      "COMPLIANCE_REVIEW",
      "COMPLIANCE_OFFICER",
      scoped,
    ).find((t) => t.to === "EXECUTIVE_APPROVAL");
    expect(signOff.blocked).toBe(true);
    expect(
      availableTransitions("COMPLIANCE_REVIEW", "AUDITOR", scoped),
    ).toHaveLength(0);
  });

  test("records an auditable trail", () => {
    const [submit] = availableTransitions("DRAFT", "COMPLIANCE_OFFICER", []);
    const state = applyTransition({}, 3, submit, {
      key: "COMPLIANCE_OFFICER",
      label: "Compliance Officer",
    });
    expect(state[3].stage).toBe("LEGAL_REVIEW");
    expect(state[3].history[0].by).toBe("Compliance Officer");
  });
});

describe("copilot engine", () => {
  test("answers are grounded and cite sources", () => {
    const answer = answerLocally(
      "Show critical risks",
      buildIntelligence(dataset),
    );
    expect(answer.grounded).toBe(true);
    expect(answer.citations.length).toBeGreaterThan(0);
  });

  test("resolves entity-specific questions", () => {
    const answer = answerLocally(
      "How are we doing on GDPR?",
      buildIntelligence(dataset),
    );
    expect(answer.title).toContain("GDPR");
    expect(answer.items).toHaveLength(2);
  });
});
