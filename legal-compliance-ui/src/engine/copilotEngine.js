// Local, grounded answer engine: every answer is built only from platform data and cites its sources.

const pct = (v) => `${Math.round(v * 100)}%`;

const cite = (a) => ({
  label: `Assessment #${a.id}: ${a.policyName} × ${a.regulationName}`,
  route: "/compliances",
});

const riskItem = (a) => ({
  label: `${a.policyName} × ${a.regulationName}`,
  detail: `Risk ${a.risk.score} · ${a.risk.status.label}${a.remarks ? ` · ${a.remarks}` : ""}`,
  tone: a.risk.level.tone,
  route: "/risk-heatmap",
});

const DEFAULT_FOLLOW_UPS = [
  "What is our compliance health?",
  "Show critical risks",
  "Where are our compliance gaps?",
  "What should we fix first?",
];

const INTENTS = [
  {
    key: "summary",
    pattern: /summar|brief|executive|board|overview|posture/,
    answer: (intel) => ({
      title: "Executive Compliance Brief",
      summary: [
        `Compliance health is ${intel.healthScore ?? "not yet measurable"}${intel.healthScore !== null ? "/100" : ""} (${intel.health.label}).`,
        `Maturity is Level ${intel.maturity.level} – ${intel.maturity.name} (index ${intel.maturity.index}).`,
        `${intel.highRisks.length} high-risk finding(s), ${intel.gaps.uncoveredRegulations.length} uncovered regulation(s), ${pct(intel.policyCoverage)} policy coverage.`,
      ],
      items: intel.recommendations
        .slice(0, 3)
        .map((r) => ({
          label: `${r.priority} · ${r.title}`,
          detail: r.action,
          tone: r.priority === "P1" ? "danger" : "warning",
          route: r.route,
        })),
      citations: [{ label: "Executive Report", route: "/executive-report" }],
    }),
  },
  {
    key: "health",
    pattern: /health|score|how (are|is) we|compliant are/,
    answer: (intel) => ({
      title: "Compliance Health Score",
      summary: [
        intel.healthScore === null
          ? "No assessments exist yet, so health cannot be computed."
          : `Health is ${intel.healthScore}/100 (${intel.health.label}), computed as 100 minus the average residual risk across ${intel.assessments.length} assessment(s).`,
        `${intel.compliant.length} compliant, ${intel.openFindings.length} open finding(s); compliance rate ${pct(intel.complianceRate)}.`,
      ],
      items: intel.highRisks.slice(0, 3).map(riskItem),
      citations: intel.highRisks.slice(0, 3).map(cite),
    }),
  },
  {
    key: "maturity",
    pattern: /matur|cmmi|level/,
    answer: (intel) => ({
      title: "Compliance Maturity Index",
      summary: [
        `Level ${intel.maturity.level} – ${intel.maturity.name}: ${intel.maturity.summary}`,
        `Weakest dimension: ${intel.maturity.weakest.label} (${pct(intel.maturity.weakest.value)}).`,
      ],
      items: intel.maturity.dimensions.map((d) => ({
        label: d.label,
        detail: `${pct(d.value)} · weight ${pct(d.weight)}`,
        tone:
          d.value >= 0.7 ? "success" : d.value >= 0.4 ? "warning" : "danger",
        route: "/analytics",
      })),
      citations: [{ label: "Compliance Analytics", route: "/analytics" }],
    }),
  },
  {
    key: "gaps",
    pattern: /gap|uncovered|missing|not covered|unassessed/,
    answer: (intel) => ({
      title: "Compliance Gap Analysis",
      summary: [
        `${intel.gaps.total} gap(s) detected across coverage, effectiveness and data integrity.`,
      ],
      items: [
        ...intel.gaps.uncoveredRegulations.map((r) => ({
          label: `Uncovered regulation: ${r.regulationName}`,
          detail: r.country || "",
          tone: r.severity.tone,
          route: "/gap-analysis",
        })),
        ...intel.gaps.unassessedPolicies.map((p) => ({
          label: `Unassessed policy: ${p.title}`,
          detail: "No regulation mapping",
          tone: "warning",
          route: "/gap-analysis",
        })),
        ...intel.gaps.failingControls.map(riskItem),
      ].slice(0, 8),
      citations: [{ label: "Gap Analysis", route: "/gap-analysis" }],
    }),
  },
  {
    key: "recommend",
    pattern: /recommend|what should|next step|fix|remediat|priorit|action/,
    answer: (intel) => ({
      title: "AI Recommendations",
      summary: ["Ranked by priority and expected health uplift."],
      items: intel.recommendations.slice(0, 5).map((r) => ({
        label: `${r.priority} · ${r.title}`,
        detail: `${r.action}${r.uplift ? ` · +${r.uplift} health pts` : ""}`,
        tone:
          r.priority === "P1"
            ? "danger"
            : r.priority === "P2"
              ? "warning"
              : "secondary",
        route: r.route,
      })),
      citations: [{ label: "Risk Scoring Engine", route: "/risk-heatmap" }],
    }),
  },
  {
    key: "risk",
    pattern: /risk|critical|non.?compliant|fail|violation|breach|exposure/,
    answer: (intel) => ({
      title: "Highest Risk Findings",
      summary: intel.highRisks.length
        ? [`${intel.highRisks.length} finding(s) score High or Critical.`]
        : [
            "No High or Critical findings. Lower-severity open items are listed below.",
          ],
      items: (intel.highRisks.length ? intel.highRisks : intel.openFindings)
        .slice(0, 6)
        .map(riskItem),
      citations: (intel.highRisks.length ? intel.highRisks : intel.openFindings)
        .slice(0, 6)
        .map(cite),
    }),
  },
];

const entityAnswer = (question, intel) => {
  const q = question.toLowerCase();
  const regulation = intel.heatmap.columns.find(
    (r) => r.regulationName && q.includes(r.regulationName.toLowerCase()),
  );
  const policy = intel.heatmap.rows.find(
    (p) => p.title && q.includes(p.title.toLowerCase()),
  );
  if (!regulation && !policy) return null;

  const scoped = intel.assessments.filter(
    (a) =>
      (!regulation || a.regulationId === regulation.id) &&
      (!policy || a.policyId === policy.id),
  );
  const subject = [policy?.title, regulation?.regulationName]
    .filter(Boolean)
    .join(" × ");

  return {
    title: `Compliance position: ${subject}`,
    summary: scoped.length
      ? [
          `${scoped.length} assessment(s); worst residual risk ${Math.max(...scoped.map((a) => a.risk.score))}.`,
        ]
      : [`No assessments found for ${subject}. This is a coverage gap.`],
    items: scoped.map(riskItem),
    citations: scoped.map(cite),
  };
};

export const answerLocally = (question, intel) => {
  const q = question.toLowerCase();
  const response = entityAnswer(question, intel) ||
    INTENTS.find((intent) => intent.pattern.test(q))?.answer(intel) || {
      title: "I can help with compliance intelligence",
      summary: [
        "Ask about health, risks, gaps, maturity, recommendations, or name a specific policy or regulation.",
      ],
      items: [],
      citations: [],
    };

  return {
    ...response,
    followUps: DEFAULT_FOLLOW_UPS,
    grounded: true,
    source: "local",
  };
};
