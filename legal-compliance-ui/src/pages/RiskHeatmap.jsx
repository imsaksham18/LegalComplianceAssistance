import { useState } from "react";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  RiskBadge,
  ToneBadge,
} from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
import { usePlatformData } from "../context/PlatformDataContext";
import { RISK_LEVELS } from "../engine/riskEngine";

const LEGEND = [
  RISK_LEVELS.LOW,
  RISK_LEVELS.MEDIUM,
  RISK_LEVELS.HIGH,
  RISK_LEVELS.CRITICAL,
];

function RiskHeatmap() {
  const { intel, loading } = usePlatformData();
  const [selected, setSelected] = useState(null);
  const { rows, columns, cell } = intel.heatmap;

  return (
    <>
      <PageHeader
        eyebrow="Risk Intelligence"
        title="Policy × Regulation Risk Heatmap"
        subtitle="Each cell is a control assessment scored by the explainable risk engine. Empty cells are coverage gaps."
      />

      <div className="row g-3">
        <div className={selected ? "col-xl-8" : "col-12"}>
          <Panel
            action={
              <div className="d-flex flex-wrap gap-2 small">
                {LEGEND.map((l) => (
                  <span
                    key={l.key}
                    className="d-inline-flex align-items-center gap-1"
                  >
                    <span
                      className={`legend-swatch heat-${l.key.toLowerCase()}`}
                    />{" "}
                    {l.label}
                  </span>
                ))}
                <span className="d-inline-flex align-items-center gap-1">
                  <span className="legend-swatch heat-empty" /> Not assessed
                </span>
              </div>
            }
            title="Risk Matrix"
          >
            {loading ? (
              <LoadingState rows={6} />
            ) : !rows.length || !columns.length ? (
              <EmptyState icon="heatmap" title="Not enough data">
                Policies and regulations are required to build the matrix.
              </EmptyState>
            ) : (
              <div className="table-responsive">
                <table className="heatmap">
                  <thead>
                    <tr>
                      <th className="heatmap-corner">Policy \ Regulation</th>
                      {columns.map((r) => (
                        <th key={r.id} title={r.description}>
                          <div className="heatmap-col">{r.regulationName}</div>
                          <div className="small text-body-secondary fw-normal">
                            {r.country}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => (
                      <tr key={p.id}>
                        <th className="heatmap-row" title={p.description}>
                          {p.title}
                        </th>
                        {columns.map((r) => {
                          const a = cell(p.id, r.id);
                          return (
                            <td key={r.id}>
                              <button
                                className={`heat-cell ${a ? `heat-${a.risk.level.key.toLowerCase()}` : "heat-empty"} ${selected?.id === a?.id && a ? "selected" : ""}`}
                                onClick={() =>
                                  setSelected(
                                    a || {
                                      gap: true,
                                      policy: p,
                                      regulation: r,
                                    },
                                  )
                                }
                                aria-label={
                                  a
                                    ? `${p.title} × ${r.regulationName}: risk ${a.risk.score}`
                                    : `${p.title} × ${r.regulationName}: not assessed`
                                }
                              >
                                {a ? a.risk.score : "—"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        {selected && (
          <div className="col-xl-4">
            <Panel
              title={selected.gap ? "Coverage Gap" : "Risk Drill-down"}
              action={
                <button
                  className="icon-btn"
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                >
                  <Icon name="close" size={16} />
                </button>
              }
            >
              {selected.gap ? (
                <>
                  <p className="mb-2">
                    <strong>{selected.policy.title}</strong> has never been
                    assessed against{" "}
                    <strong>{selected.regulation.regulationName}</strong>.
                  </p>
                  <ToneBadge tone="warning">Unmeasured exposure</ToneBadge>
                  <p className="small text-body-secondary mt-3 mb-0">
                    Recommended: run an applicability check and, if in scope,
                    create a compliance assessment.
                  </p>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-semibold">{selected.policyName}</div>
                      <div className="small text-body-secondary">
                        {selected.regulationName}
                      </div>
                    </div>
                    <RiskBadge risk={selected.risk} />
                  </div>
                  <dl className="detail-list">
                    <dt>Assessment</dt>
                    <dd>#{selected.id}</dd>
                    <dt>Status</dt>
                    <dd>{selected.status}</dd>
                    <dt>Remarks</dt>
                    <dd>{selected.remarks || "—"}</dd>
                  </dl>
                  <div className="small fw-semibold text-uppercase text-body-secondary mb-2">
                    Why this score
                  </div>
                  <ul className="driver-list">
                    {selected.risk.drivers.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>
          </div>
        )}
      </div>
    </>
  );
}

export default RiskHeatmap;
