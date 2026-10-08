// Pure, deterministic scoring so every number on screen is explainable and unit-testable.

const STATUS_RULES = [
  {
    pattern: /(non|not)[\s_-]?compliant|fail|violat|breach/,
    key: "NON_COMPLIANT",
    label: "Non-Compliant",
    severity: 1,
  },
  {
    pattern: /partial/,
    key: "PARTIAL",
    label: "Partially Compliant",
    severity: 0.6,
  },
  {
    pattern: /pending|progress|review|open|draft/,
    key: "UNDER_REVIEW",
    label: "Under Review",
    severity: 0.4,
  },
  {
    pattern: /compliant|pass|approved|closed|complete/,
    key: "COMPLIANT",
    label: "Compliant",
    severity: 0,
  },
];

const UNKNOWN_STATUS = { key: "UNKNOWN", label: "Unclassified", severity: 0.5 };

const RISK_SIGNALS = [
  {
    pattern: /breach|leak|incident/i,
    weight: 12,
    label: "Incident indicator in remarks",
  },
  {
    pattern: /penalt|fine|sanction|enforcement/i,
    weight: 10,
    label: "Regulatory penalty exposure",
  },
  {
    pattern: /critical|urgent|severe/i,
    weight: 8,
    label: "Escalated severity",
  },
  {
    pattern: /expired|overdue|outdated|lapsed/i,
    weight: 6,
    label: "Lapsed control",
  },
  {
    pattern: /missing|absent|no evidence|not documented|gap/i,
    weight: 6,
    label: "Missing evidence",
  },
];

const HIGH_IMPACT_FRAMEWORKS =
  /gdpr|hipaa|sox|sarbanes|pci|dpdp|ccpa|basel|dora|nis2|iso\s?27001/i;

const JURISDICTION_WEIGHTS = {
  eu: 1.2,
  "european union": 1.2,
  usa: 1.1,
  us: 1.1,
  "united states": 1.1,
  uk: 1.1,
  "united kingdom": 1.1,
  india: 1.05,
};

export const RISK_LEVELS = {
  CRITICAL: { key: "CRITICAL", label: "Critical", tone: "danger", min: 85 },
  HIGH: { key: "HIGH", label: "High", tone: "danger", min: 65 },
  MEDIUM: { key: "MEDIUM", label: "Medium", tone: "warning", min: 40 },
  LOW: { key: "LOW", label: "Low", tone: "success", min: 0 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const average = (values) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const ratio = (part, total) => (total ? part / total : 0);

export const classifyStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return (
    STATUS_RULES.find((rule) => rule.pattern.test(normalized)) || UNKNOWN_STATUS
  );
};

export const riskLevel = (score) =>
  Object.values(RISK_LEVELS).find((level) => score >= level.min) ||
  RISK_LEVELS.LOW;

const jurisdictionWeight = (regulation) =>
  JURISDICTION_WEIGHTS[
    String(regulation?.country || "")
      .trim()
      .toLowerCase()
  ] || 1;

export const scoreAssessment = (assessment, regulation) => {
  const status = classifyStatus(assessment.status);
  const remarks = assessment.remarks || "";
  const drivers = [`Status: ${status.label}`];

  if (status.severity === 0) {
    return { score: 0, level: RISK_LEVELS.LOW, status, drivers };
  }

  const signals = RISK_SIGNALS.filter((signal) => signal.pattern.test(remarks));
  const jurisdiction = jurisdictionWeight(regulation);
  const framework = HIGH_IMPACT_FRAMEWORKS.test(
    regulation?.regulationName || "",
  )
    ? 1.15
    : 1;

  signals.forEach((signal) =>
    drivers.push(`${signal.label} (+${signal.weight})`),
  );
  if (jurisdiction > 1)
    drivers.push(
      `Jurisdiction weight ${regulation.country} (x${jurisdiction})`,
    );
  if (framework > 1) drivers.push(`High-impact framework (x${framework})`);

  const raw =
    (status.severity * 70 + signals.reduce((sum, s) => sum + s.weight, 0)) *
    jurisdiction *
    framework;
  const score = clamp(Math.round(raw), 1, 100);

  return { score, level: riskLevel(score), status, drivers };
};

export const healthBand = (score) => {
  if (score === null) return { label: "No Data", tone: "secondary" };
  if (score >= 85) return { label: "Strong", tone: "success" };
  if (score >= 70) return { label: "Watch", tone: "warning" };
  return { label: "Critical", tone: "danger" };
};

const MATURITY_LEVELS = [
  {
    level: 1,
    name: "Initial",
    min: 0,
    summary: "Ad-hoc controls with limited visibility.",
  },
  {
    level: 2,
    name: "Repeatable",
    min: 20,
    summary: "Core controls exist but coverage is inconsistent.",
  },
  {
    level: 3,
    name: "Defined",
    min: 40,
    summary: "Standardised assessments across key regulations.",
  },
  {
    level: 4,
    name: "Managed",
    min: 60,
    summary: "Quantitatively measured and reported compliance.",
  },
  {
    level: 5,
    name: "Optimizing",
    min: 80,
    summary: "Continuous, data-driven compliance improvement.",
  },
];

const computeMaturity = ({
  policyCoverage,
  regulationCoverage,
  complianceRate,
  completeness,
  reportingCadence,
}) => {
  const dimensions = [
    {
      key: "coverage",
      label: "Control Coverage",
      weight: 0.3,
      value: average([policyCoverage, regulationCoverage]),
    },
    {
      key: "effectiveness",
      label: "Control Effectiveness",
      weight: 0.4,
      value: complianceRate,
    },
    {
      key: "completeness",
      label: "Assessment Completeness",
      weight: 0.15,
      value: completeness,
    },
    {
      key: "reporting",
      label: "Reporting Cadence",
      weight: 0.15,
      value: reportingCadence,
    },
  ];
  const index = Math.round(
    100 * dimensions.reduce((sum, d) => sum + d.weight * d.value, 0),
  );
  const current = [...MATURITY_LEVELS].reverse().find((l) => index >= l.min);
  const next =
    MATURITY_LEVELS.find((l) => l.level === current.level + 1) || null;
  const weakest = [...dimensions].sort((a, b) => a.value - b.value)[0];

  return { index, ...current, next, dimensions, weakest };
};

export const buildIntelligence = ({
  policies = [],
  regulations = [],
  compliances = [],
  reports = [],
  users = [],
} = {}) => {
  const policyById = new Map(policies.map((p) => [p.id, p]));
  const regulationById = new Map(regulations.map((r) => [r.id, r]));

  const assessments = compliances.map((c) => {
    const policy = policyById.get(c.policyId) || null;
    const regulation = regulationById.get(c.regulationId) || null;
    return {
      ...c,
      policy,
      regulation,
      policyName: policy?.title || `Policy #${c.policyId}`,
      regulationName:
        regulation?.regulationName || `Regulation #${c.regulationId}`,
      risk: scoreAssessment(c, regulation),
    };
  });

  const byStatus = (key) =>
    assessments.filter((a) => a.risk.status.key === key);
  const compliant = byStatus("COMPLIANT");
  const underReview = byStatus("UNDER_REVIEW");
  const openFindings = assessments.filter((a) => a.risk.score > 0);
  const highRisks = assessments
    .filter((a) => a.risk.score >= RISK_LEVELS.HIGH.min)
    .sort((a, b) => b.risk.score - a.risk.score);

  const healthScore = assessments.length
    ? Math.round(100 - average(assessments.map((a) => a.risk.score)))
    : null;

  const assessedPolicyIds = new Set(assessments.map((a) => a.policyId));
  const assessedRegulationIds = new Set(assessments.map((a) => a.regulationId));
  const policyCoverage = ratio(
    policies.filter((p) => assessedPolicyIds.has(p.id)).length,
    policies.length,
  );
  const regulationCoverage = ratio(
    regulations.filter((r) => assessedRegulationIds.has(r.id)).length,
    regulations.length,
  );
  const complianceRate = ratio(compliant.length, assessments.length);

  const maturity = computeMaturity({
    policyCoverage,
    regulationCoverage,
    complianceRate,
    completeness: assessments.length
      ? 1 - ratio(underReview.length, assessments.length)
      : 0,
    reportingCadence: Math.min(
      1,
      ratio(reports.length, Math.max(1, regulations.length)),
    ),
  });

  const gaps = {
    uncoveredRegulations: regulations
      .filter((r) => !assessedRegulationIds.has(r.id))
      .map((r) => ({
        ...r,
        severity: HIGH_IMPACT_FRAMEWORKS.test(r.regulationName || "")
          ? RISK_LEVELS.HIGH
          : RISK_LEVELS.MEDIUM,
      })),
    unassessedPolicies: policies.filter((p) => !assessedPolicyIds.has(p.id)),
    failingControls: highRisks,
    orphanAssessments: assessments.filter((a) => !a.policy || !a.regulation),
  };
  gaps.total =
    gaps.uncoveredRegulations.length +
    gaps.unassessedPolicies.length +
    gaps.failingControls.length +
    gaps.orphanAssessments.length;

  const heatmap = {
    rows: policies,
    columns: regulations,
    cell: (policyId, regulationId) =>
      assessments
        .filter(
          (a) => a.policyId === policyId && a.regulationId === regulationId,
        )
        .sort((a, b) => b.risk.score - a.risk.score)[0] || null,
  };

  const statusDistribution = Object.values(
    assessments.reduce((acc, a) => {
      const key = a.risk.status.key;
      acc[key] = acc[key] || { key, label: a.risk.status.label, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {}),
  );

  const riskByRegulation = regulations
    .map((r) => {
      const scoped = assessments.filter((a) => a.regulationId === r.id);
      return {
        id: r.id,
        label: r.regulationName,
        value: Math.round(average(scoped.map((a) => a.risk.score))),
        count: scoped.length,
      };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.value - a.value);

  const jurisdictionDistribution = Object.entries(
    regulations.reduce((acc, r) => {
      const key = r.country || "Unspecified";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  ).map(([label, value]) => ({ key: label, label, value }));

  const usersByRole = Object.entries(
    users.reduce((acc, u) => {
      const key = u.role || "UNASSIGNED";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  ).map(([label, value]) => ({ key: label, label, value }));

  const recommendations = buildRecommendations({ assessments, gaps, maturity });

  return {
    counts: {
      policies: policies.length,
      regulations: regulations.length,
      assessments: assessments.length,
      reports: reports.length,
      users: users.length,
    },
    assessments,
    compliant,
    underReview,
    openFindings,
    highRisks,
    healthScore,
    health: healthBand(healthScore),
    policyCoverage,
    regulationCoverage,
    complianceRate,
    maturity,
    gaps,
    heatmap,
    statusDistribution,
    riskByRegulation,
    jurisdictionDistribution,
    usersByRole,
    recommendations,
  };
};

// Uplift = health points recovered if this single finding were remediated.
const buildRecommendations = ({ assessments, gaps, maturity }) => {
  const total = Math.max(1, assessments.length);
  const items = [];

  assessments
    .filter((a) => a.risk.score > 0)
    .forEach((a) => {
      items.push({
        id: `remediate-${a.id}`,
        priority:
          a.risk.score >= RISK_LEVELS.HIGH.min
            ? "P1"
            : a.risk.score >= RISK_LEVELS.MEDIUM.min
              ? "P2"
              : "P3",
        title: `Remediate "${a.policyName}" against ${a.regulationName}`,
        rationale: a.risk.drivers.join(" · "),
        action: a.remarks
          ? `Address finding: ${a.remarks}`
          : "Collect evidence and re-assess the control.",
        owner: "Compliance Officer",
        uplift: Math.round(a.risk.score / total),
        route: "/risk-heatmap",
      });
    });

  gaps.uncoveredRegulations.forEach((r) =>
    items.push({
      id: `cover-${r.id}`,
      priority: r.severity === RISK_LEVELS.HIGH ? "P1" : "P2",
      title: `Map a governing policy to ${r.regulationName}`,
      rationale: `No assessment exists for this ${r.country || ""} regulation — exposure is unmeasured.`,
      action: "Assign a policy owner and run an initial compliance assessment.",
      owner: "Compliance Officer",
      uplift: null,
      route: "/gap-analysis",
    }),
  );

  gaps.unassessedPolicies.forEach((p) =>
    items.push({
      id: `assess-${p.id}`,
      priority: "P3",
      title: `Assess policy "${p.title}"`,
      rationale: "Policy has never been tested against a regulation.",
      action: "Schedule a control assessment against applicable regulations.",
      owner: "Compliance Officer",
      uplift: null,
      route: "/gap-analysis",
    }),
  );

  if (maturity.next) {
    items.push({
      id: "maturity",
      priority: "P2",
      title: `Advance maturity to Level ${maturity.next.level} (${maturity.next.name})`,
      rationale: `Weakest dimension is ${maturity.weakest.label} at ${Math.round(maturity.weakest.value * 100)}%.`,
      action: `Prioritise initiatives that improve ${maturity.weakest.label.toLowerCase()}.`,
      owner: "Executive",
      uplift: null,
      route: "/analytics",
    });
  }

  const rank = { P1: 0, P2: 1, P3: 2 };
  return items.sort(
    (a, b) =>
      rank[a.priority] - rank[b.priority] || (b.uplift || 0) - (a.uplift || 0),
  );
};
