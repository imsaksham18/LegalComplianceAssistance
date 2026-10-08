import {
  EmptyState,
  KpiCard,
  LoadingState,
  PageHeader,
  Panel,
  RiskBadge,
  ToneBadge,
} from "../components/ui/Primitives";
import { usePlatformData } from "../context/PlatformDataContext";

function GapTable({ columns, rows, empty }) {
  if (!rows.length) return <EmptyState icon="compliance" title={empty} />;
  return (
    <div className="table-responsive">
      <table className="table data-table align-middle mb-0">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((c) => (
                <td key={c.key}>{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GapAnalysis() {
  const { intel, loading } = usePlatformData();
  const { gaps } = intel;

  return (
    <>
      <PageHeader
        eyebrow="Assurance"
        title="Compliance Gap Analysis"
        subtitle="Automated detection of coverage, effectiveness and data-integrity gaps across the control framework."
      />

      <div className="row g-3 mb-3">
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Uncovered Regulations"
            value={gaps.uncoveredRegulations.length}
            tone={gaps.uncoveredRegulations.length ? "danger" : "success"}
            icon="regulation"
            hint="No mapped policy"
          />
        </div>
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Unassessed Policies"
            value={gaps.unassessedPolicies.length}
            tone={gaps.unassessedPolicies.length ? "warning" : "success"}
            icon="policy"
            hint="Never tested"
          />
        </div>
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Failing Controls"
            value={gaps.failingControls.length}
            tone={gaps.failingControls.length ? "danger" : "success"}
            icon="gap"
            hint="High or critical risk"
          />
        </div>
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Integrity Issues"
            value={gaps.orphanAssessments.length}
            tone={gaps.orphanAssessments.length ? "danger" : "success"}
            icon="lock"
            hint="Broken references"
          />
        </div>
      </div>

      {loading ? (
        <Panel>
          <LoadingState rows={6} />
        </Panel>
      ) : (
        <div className="row g-3">
          <div className="col-xl-6">
            <Panel
              title="Coverage Gaps · Regulations"
              subtitle="Regulatory obligations with no assessed control"
              className="h-100"
            >
              <GapTable
                empty="Every regulation is covered"
                rows={gaps.uncoveredRegulations}
                columns={[
                  {
                    key: "name",
                    label: "Regulation",
                    render: (r) => (
                      <span className="fw-medium">{r.regulationName}</span>
                    ),
                  },
                  {
                    key: "country",
                    label: "Jurisdiction",
                    render: (r) => r.country,
                  },
                  {
                    key: "sev",
                    label: "Exposure",
                    render: (r) => (
                      <ToneBadge tone={r.severity.tone}>
                        {r.severity.label}
                      </ToneBadge>
                    ),
                  },
                ]}
              />
            </Panel>
          </div>
          <div className="col-xl-6">
            <Panel
              title="Coverage Gaps · Policies"
              subtitle="Policies never assessed against any regulation"
              className="h-100"
            >
              <GapTable
                empty="Every policy has been assessed"
                rows={gaps.unassessedPolicies}
                columns={[
                  {
                    key: "title",
                    label: "Policy",
                    render: (p) => <span className="fw-medium">{p.title}</span>,
                  },
                  {
                    key: "desc",
                    label: "Description",
                    render: (p) => (
                      <span className="text-body-secondary small">
                        {p.description}
                      </span>
                    ),
                  },
                ]}
              />
            </Panel>
          </div>
          <div className="col-12">
            <Panel
              title="Effectiveness Gaps"
              subtitle="Assessed controls scoring High or Critical residual risk"
            >
              <GapTable
                empty="No failing controls"
                rows={gaps.failingControls}
                columns={[
                  {
                    key: "policy",
                    label: "Policy",
                    render: (a) => (
                      <span className="fw-medium">{a.policyName}</span>
                    ),
                  },
                  {
                    key: "reg",
                    label: "Regulation",
                    render: (a) => a.regulationName,
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (a) => a.risk.status.label,
                  },
                  {
                    key: "remarks",
                    label: "Finding",
                    render: (a) => <span className="small">{a.remarks}</span>,
                  },
                  {
                    key: "risk",
                    label: "Risk",
                    render: (a) => <RiskBadge risk={a.risk} />,
                  },
                ]}
              />
            </Panel>
          </div>
          {gaps.orphanAssessments.length > 0 && (
            <div className="col-12">
              <Panel
                title="Data Integrity Gaps"
                subtitle="Assessments referencing policies or regulations that no longer exist"
              >
                <GapTable
                  empty=""
                  rows={gaps.orphanAssessments}
                  columns={[
                    {
                      key: "id",
                      label: "Assessment",
                      render: (a) => `#${a.id}`,
                    },
                    {
                      key: "policy",
                      label: "Policy Ref",
                      render: (a) =>
                        a.policy ? (
                          a.policyName
                        ) : (
                          <ToneBadge tone="danger">
                            Missing #{a.policyId}
                          </ToneBadge>
                        ),
                    },
                    {
                      key: "reg",
                      label: "Regulation Ref",
                      render: (a) =>
                        a.regulation ? (
                          a.regulationName
                        ) : (
                          <ToneBadge tone="danger">
                            Missing #{a.regulationId}
                          </ToneBadge>
                        ),
                    },
                  ]}
                />
              </Panel>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GapAnalysis;
