import { useMemo, useState } from "react";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  ToneBadge,
} from "../components/ui/Primitives";
import Icon from "../components/ui/Icon";
import { usePlatformData } from "../context/PlatformDataContext";
import { useRole } from "../context/RoleContext";
import {
  applyTransition,
  availableTransitions,
  currentStage,
  loadWorkflowState,
  REJECTED,
  STAGES,
  stageLabel,
} from "../engine/workflowEngine";

const COLUMNS = [...STAGES, REJECTED];

function Stepper({ stage }) {
  const activeIndex = STAGES.findIndex((s) => s.key === stage);
  return (
    <ol className={`stepper ${stage === REJECTED.key ? "rejected" : ""}`}>
      {STAGES.map((s, i) => (
        <li
          key={s.key}
          className={
            i < activeIndex ? "done" : i === activeIndex ? "current" : ""
          }
        >
          <span className="step-dot" />
          <span className="step-label">{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

function PolicyWorkflow() {
  const { intel, data, loading } = usePlatformData();
  const { role } = useRole();
  const [state, setState] = useState(loadWorkflowState);
  const [selectedId, setSelectedId] = useState(null);

  const cards = useMemo(
    () =>
      (data.policies || []).map((p) => {
        const scoped = intel.assessments.filter((a) => a.policyId === p.id);
        return {
          policy: p,
          assessments: scoped,
          stage: currentStage(p.id, scoped, state),
          openRisks: scoped.filter((a) => a.risk.score >= 65).length,
          history: state[p.id]?.history || [],
        };
      }),
    [data.policies, intel.assessments, state],
  );

  const selected = cards.find((c) => c.policy.id === selectedId);

  const transition = (card, t) =>
    setState((s) => applyTransition(s, card.policy.id, t, role));

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Policy Approval Workflow"
        subtitle="Maker-checker lifecycle with role-gated transitions and a risk control gate before executive approval."
        actions={<ToneBadge tone="primary">Acting as {role.label}</ToneBadge>}
      />

      {loading ? (
        <Panel>
          <LoadingState rows={6} />
        </Panel>
      ) : !cards.length ? (
        <EmptyState icon="workflow" title="No policies to route" />
      ) : (
        <div className="row g-3">
          <div className={selected ? "col-xl-8" : "col-12"}>
            <div className="kanban">
              {COLUMNS.map((col) => {
                const items = cards.filter((c) => c.stage === col.key);
                return (
                  <div
                    key={col.key}
                    className={`kanban-col ${col.key === REJECTED.key ? "rejected" : ""}`}
                  >
                    <div className="kanban-head">
                      <span>{col.label}</span>
                      <span className="kanban-count">{items.length}</span>
                    </div>
                    {items.map((c) => (
                      <button
                        key={c.policy.id}
                        className={`kanban-card ${selectedId === c.policy.id ? "selected" : ""}`}
                        onClick={() => setSelectedId(c.policy.id)}
                      >
                        <div className="fw-medium text-start">
                          {c.policy.title}
                        </div>
                        <div className="d-flex gap-2 mt-2 small text-body-secondary">
                          <span>{c.assessments.length} checks</span>
                          {c.openRisks > 0 && (
                            <ToneBadge tone="danger">
                              {c.openRisks} high risk
                            </ToneBadge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="col-xl-4">
              <Panel
                title={selected.policy.title}
                subtitle={`Stage: ${stageLabel(selected.stage)}`}
                action={
                  <button
                    className="icon-btn"
                    onClick={() => setSelectedId(null)}
                    aria-label="Close"
                  >
                    <Icon name="close" size={16} />
                  </button>
                }
              >
                <Stepper stage={selected.stage} />

                <div className="small fw-semibold text-uppercase text-body-secondary mt-3 mb-2">
                  Available actions
                </div>
                {availableTransitions(
                  selected.stage,
                  role.key,
                  selected.assessments,
                ).map((t) => (
                  <div key={t.to} className="mb-2">
                    <button
                      className={`btn btn-sm w-100 ${t.to === REJECTED.key ? "btn-outline-danger" : "btn-primary"}`}
                      disabled={t.blocked}
                      onClick={() => transition(selected, t)}
                    >
                      {t.action}
                    </button>
                    {t.blocked && (
                      <div className="small text-danger mt-1">
                        Control gate: {t.blockedReason}
                      </div>
                    )}
                  </div>
                ))}
                {!availableTransitions(
                  selected.stage,
                  role.key,
                  selected.assessments,
                ).length && (
                  <div className="small text-body-secondary">
                    No actions available for {role.label} at this stage.
                  </div>
                )}

                <div className="small fw-semibold text-uppercase text-body-secondary mt-4 mb-2">
                  Approval trail
                </div>
                {selected.history.length ? (
                  <ul className="timeline compact">
                    {[...selected.history].reverse().map((h, i) => (
                      <li key={i}>
                        <div className="fw-medium small">{h.action}</div>
                        <div className="small text-body-secondary">
                          {h.by} · {new Date(h.at).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="small text-body-secondary">
                    Stage derived from compliance evidence. No manual decisions
                    yet.
                  </div>
                )}
              </Panel>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PolicyWorkflow;
