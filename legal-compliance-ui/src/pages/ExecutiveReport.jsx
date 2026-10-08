import {
  EmptyState,
  LoadingState,
  PageHeader,
  ToneBadge,
} from "../components/ui/Primitives";
import { Gauge } from "../components/charts/Charts";
import Icon from "../components/ui/Icon";
import { usePlatformData } from "../context/PlatformDataContext";
import { useRole } from "../context/RoleContext";

const pct = (v) => `${Math.round(v * 100)}%`;

const narrative = (intel) => {
  if (intel.healthScore === null) {
    return "No control assessments have been recorded. Compliance posture cannot yet be quantified; establishing baseline assessments is the immediate priority.";
  }
  const posture =
    intel.health.label === "Strong"
      ? "a strong"
      : intel.health.label === "Watch"
        ? "an acceptable but watch-listed"
        : "a critical";
  return `The organisation holds ${posture} compliance posture with a health score of ${intel.healthScore}/100 across ${intel.counts.assessments} control assessments, ${intel.counts.policies} policies and ${intel.counts.regulations} regulations. ${intel.highRisks.length} finding(s) carry high or critical residual risk, and ${intel.gaps.uncoveredRegulations.length} regulation(s) have no mapped control. Programme maturity is assessed at Level ${intel.maturity.level} (${intel.maturity.name}); the weakest dimension is ${intel.maturity.weakest.label.toLowerCase()}.`;
};

function ExecutiveReport() {
  const { intel, loading, fetchedAt } = usePlatformData();
  const { role } = useRole();

  return (
    <>
      <PageHeader
        eyebrow="Board Pack"
        title="Executive Compliance Report"
        subtitle="Print-ready briefing generated from live platform data."
        actions={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => window.print()}
          >
            <Icon name="print" size={14} /> Export PDF
          </button>
        }
      />

      {loading ? (
        <LoadingState rows={10} />
      ) : (
        <article className="report-doc">
          <header className="report-cover">
            <div>
              <div className="report-kicker">
                Confidential · Board of Directors
              </div>
              <h2 className="mb-1">Compliance Posture Briefing</h2>
              <div className="text-body-secondary small">
                Generated {(fetchedAt || new Date()).toLocaleString()} ·
                Prepared for {role.label}
              </div>
            </div>
            <Gauge
              value={intel.healthScore}
              label="Health"
              tone={intel.health.tone}
              size={170}
            />
          </header>

          <section>
            <h3>1. Executive Summary</h3>
            <p>{narrative(intel)}</p>
          </section>

          <section>
            <h3>2. Key Indicators</h3>
            <div className="report-kpis">
              <div>
                <span>Health Score</span>
                <strong>{intel.healthScore ?? "—"}</strong>
              </div>
              <div>
                <span>Maturity</span>
                <strong>
                  L{intel.maturity.level} · {intel.maturity.index}
                </strong>
              </div>
              <div>
                <span>Compliance Rate</span>
                <strong>{pct(intel.complianceRate)}</strong>
              </div>
              <div>
                <span>Regulatory Coverage</span>
                <strong>{pct(intel.regulationCoverage)}</strong>
              </div>
              <div>
                <span>High-Risk Findings</span>
                <strong>{intel.highRisks.length}</strong>
              </div>
              <div>
                <span>Total Gaps</span>
                <strong>{intel.gaps.total}</strong>
              </div>
            </div>
          </section>

          <section>
            <h3>3. Material Risks</h3>
            {intel.openFindings.length ? (
              <table className="table table-sm report-table">
                <thead>
                  <tr>
                    <th>Policy</th>
                    <th>Regulation</th>
                    <th>Status</th>
                    <th>Finding</th>
                    <th className="text-end">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {[...intel.openFindings]
                    .sort((a, b) => b.risk.score - a.risk.score)
                    .slice(0, 10)
                    .map((a) => (
                      <tr key={a.id}>
                        <td>{a.policyName}</td>
                        <td>{a.regulationName}</td>
                        <td>{a.risk.status.label}</td>
                        <td>{a.remarks}</td>
                        <td className="text-end">
                          <ToneBadge tone={a.risk.level.tone}>
                            {a.risk.level.label} {a.risk.score}
                          </ToneBadge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon="compliance" title="No open findings" />
            )}
          </section>

          <section>
            <h3>4. Recommendations</h3>
            <ol className="report-recs">
              {intel.recommendations.slice(0, 6).map((r) => (
                <li key={r.id}>
                  <strong>
                    [{r.priority}] {r.title}.
                  </strong>{" "}
                  {r.action}
                  {r.uplift
                    ? ` Expected uplift: +${r.uplift} health points.`
                    : ""}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3>5. Methodology</h3>
            <p className="small text-body-secondary">
              Residual risk per assessment = (status severity × 70 + finding
              signals) × jurisdiction weight × framework weight, capped at 100.
              Health = 100 − mean residual risk. Maturity index weights coverage
              30%, effectiveness 40%, completeness 15% and reporting cadence
              15%, mapped to a five-level CMMI-style scale.
            </p>
          </section>

          <footer className="report-signoff">
            <div>
              <span>Chief Compliance Officer</span>
            </div>
            <div>
              <span>Chief Risk Officer</span>
            </div>
            <div>
              <span>Board Audit Committee</span>
            </div>
          </footer>
        </article>
      )}
    </>
  );
}

export default ExecutiveReport;
