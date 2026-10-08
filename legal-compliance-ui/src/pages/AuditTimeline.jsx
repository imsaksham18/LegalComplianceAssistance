import { useMemo, useState } from "react";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  ToneBadge,
} from "../components/ui/Primitives";
import { usePlatformData } from "../context/PlatformDataContext";
import { loadWorkflowState } from "../engine/workflowEngine";

const FILTERS = [
  { key: "ALL", label: "All events" },
  { key: "ASSESSMENT", label: "Assessments" },
  { key: "REPORT", label: "Reports" },
  { key: "APPROVAL", label: "Approvals" },
];

const parseDate = (value) => {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

function AuditTimeline() {
  const { intel, data, loading } = usePlatformData();
  const [filter, setFilter] = useState("ALL");

  const events = useMemo(() => {
    const workflow = loadWorkflowState();
    const policyTitle = (id) =>
      (data.policies || []).find((p) => String(p.id) === String(id))?.title ||
      `Policy #${id}`;

    const approvals = Object.entries(workflow).flatMap(([policyId, entry]) =>
      entry.history.map((h) => ({
        type: "APPROVAL",
        title: `${h.action} — ${policyTitle(policyId)}`,
        detail: `${h.by} moved policy to ${h.to.replace(/_/g, " ").toLowerCase()}`,
        date: parseDate(h.at),
        tone: h.to === "REJECTED" ? "danger" : "primary",
      })),
    );

    const reports = (data.reports || []).map((r) => ({
      type: "REPORT",
      title: `Report generated — ${r.reportName}`,
      detail: `${r.reportType} · ${r.status}`,
      date: parseDate(r.generatedDate),
      tone: "info",
    }));

    // Assessments carry no timestamp, so they are sequenced by record id.
    const assessments = intel.assessments.map((a) => ({
      type: "ASSESSMENT",
      title: `Assessment #${a.id} — ${a.policyName} × ${a.regulationName}`,
      detail: `${a.risk.status.label}${a.remarks ? ` · ${a.remarks}` : ""}`,
      date: null,
      sequence: a.id,
      tone: a.risk.level.tone,
      risk: a.risk,
    }));

    const dated = [...approvals, ...reports]
      .filter((e) => e.date)
      .sort((a, b) => b.date - a.date);
    const undated = [
      ...reports.filter((e) => !e.date),
      ...assessments.sort((a, b) => b.sequence - a.sequence),
    ];
    return [...dated, ...undated];
  }, [data, intel.assessments]);

  const visible =
    filter === "ALL" ? events : events.filter((e) => e.type === filter);

  return (
    <>
      <PageHeader
        eyebrow="Assurance"
        title="Audit Timeline"
        subtitle="Unified, chronological evidence trail across assessments, reports and approval decisions."
      />

      <Panel
        action={
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Filter events"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`btn ${filter === f.key ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
        title={`${visible.length} events`}
      >
        {loading ? (
          <LoadingState rows={6} />
        ) : !visible.length ? (
          <EmptyState icon="timeline" title="No events for this filter" />
        ) : (
          <ul className="timeline">
            {visible.map((e, i) => (
              <li key={i} className={`tone-${e.tone}`}>
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <div className="fw-medium">{e.title}</div>
                  <div className="small text-body-secondary">
                    {e.date
                      ? e.date.toLocaleString()
                      : e.sequence
                        ? `Record sequence #${e.sequence}`
                        : "Undated"}
                  </div>
                </div>
                <div className="small text-body-secondary">{e.detail}</div>
                <div className="mt-1 d-flex gap-2">
                  <ToneBadge tone="secondary">{e.type}</ToneBadge>
                  {e.risk && e.risk.score > 0 && (
                    <ToneBadge tone={e.risk.level.tone}>
                      Risk {e.risk.score}
                    </ToneBadge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

export default AuditTimeline;
