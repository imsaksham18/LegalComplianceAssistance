import { Link, useOutletContext } from "react-router-dom";
import Icon from "../components/ui/Icon";
import {
  EmptyState,
  KpiCard,
  LoadingState,
  PageHeader,
  Panel,
  RiskBadge,
  ToneBadge,
} from "../components/ui/Primitives";
import { BarList, DonutChart, Gauge } from "../components/charts/Charts";
import { usePlatformData } from "../context/PlatformDataContext";
import { useRole } from "../context/RoleContext";

const pct = (v) => Math.round(v * 100);

function TopRisks({ intel, limit = 5 }) {
  const items = (
    intel.highRisks.length ? intel.highRisks : intel.openFindings
  ).slice(0, limit);
  if (!items.length)
    return (
      <EmptyState icon="compliance" title="No open findings">
        All assessed controls are compliant.
      </EmptyState>
    );
  return (
    <ul className="list-rows list-unstyled mb-0">
      {items.map((a) => (
        <li key={a.id}>
          <div className="text-truncate">
            <div className="fw-medium text-truncate">{a.policyName}</div>
            <div className="small text-body-secondary text-truncate">
              {a.regulationName} · {a.risk.status.label}
            </div>
          </div>
          <RiskBadge risk={a.risk} />
        </li>
      ))}
    </ul>
  );
}

function Recommendations({ intel, limit = 4 }) {
  if (!intel.recommendations.length)
    return <EmptyState icon="sparkle" title="No actions required" />;
  return (
    <ul className="list-rows list-unstyled mb-0">
      {intel.recommendations.slice(0, limit).map((r) => (
        <li key={r.id}>
          <div className="text-truncate">
            <div className="fw-medium text-truncate">{r.title}</div>
            <div className="small text-body-secondary text-truncate">
              {r.action}
            </div>
          </div>
          <div className="text-end flex-shrink-0">
            <ToneBadge
              tone={
                r.priority === "P1"
                  ? "danger"
                  : r.priority === "P2"
                    ? "warning"
                    : "secondary"
              }
            >
              {r.priority}
            </ToneBadge>
            {r.uplift ? (
              <div className="small text-success mt-1">+{r.uplift} pts</div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ServiceHealth({ services }) {
  return (
    <ul className="list-rows list-unstyled mb-0">
      {services.map((s) => (
        <li key={s.key}>
          <div className="d-flex align-items-center gap-2">
            <Icon name="server" size={16} />
            <div>
              <div className="fw-medium">{s.name}</div>
              <div className="small text-body-secondary">GET {s.path}</div>
            </div>
          </div>
          <div className="text-end">
            <ToneBadge tone={s.status === "UP" ? "success" : "danger"}>
              {s.status}
            </ToneBadge>
            <div className="small text-body-secondary mt-1">
              {s.latencyMs !== null ? `${s.latencyMs} ms` : s.error}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function HealthHero({ intel, openCopilot }) {
  return (
    <Panel className="hero-panel h-100">
      <div className="d-flex flex-wrap align-items-center gap-4">
        <Gauge
          value={intel.healthScore}
          label="Compliance Health"
          tone={intel.health.tone}
        />
        <div className="flex-grow-1" style={{ minWidth: 220 }}>
          <ToneBadge tone={intel.health.tone}>{intel.health.label}</ToneBadge>
          <h3 className="mt-2 mb-1 fw-semibold">
            Maturity Level {intel.maturity.level} · {intel.maturity.name}
          </h3>
          <p className="text-body-secondary small mb-3">
            {intel.maturity.summary}
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-copilot btn-sm"
              onClick={() => openCopilot("Give me an executive summary")}
            >
              <Icon name="sparkle" size={14} /> Brief me
            </button>
            <Link
              to="/executive-report"
              className="btn btn-outline-secondary btn-sm"
            >
              <Icon name="report" size={14} /> Board report
            </Link>
          </div>
        </div>
      </div>
    </Panel>
  );
}

const ROLE_VIEWS = {
  EXECUTIVE: {
    title: "Executive Command Center",
    subtitle: "Enterprise compliance posture at a glance",
    kpis: (i) => [
      {
        label: "Health Score",
        value: i.healthScore ?? "—",
        suffix: i.healthScore !== null ? "/100" : "",
        tone: i.health.tone,
        icon: "target",
        hint: i.health.label,
      },
      {
        label: "Maturity Index",
        value: i.maturity.index,
        suffix: "/100",
        tone: "primary",
        icon: "analytics",
        hint: `Level ${i.maturity.level} · ${i.maturity.name}`,
      },
      {
        label: "High-Risk Findings",
        value: i.highRisks.length,
        tone: i.highRisks.length ? "danger" : "success",
        icon: "gap",
        hint: `${i.openFindings.length} open in total`,
      },
      {
        label: "Regulatory Coverage",
        value: pct(i.regulationCoverage),
        suffix: "%",
        tone: "info",
        icon: "regulation",
        hint: `${i.counts.regulations} regulations tracked`,
      },
    ],
  },
  COMPLIANCE_OFFICER: {
    title: "Compliance Operations",
    subtitle: "Your remediation queue and control coverage",
    kpis: (i) => [
      {
        label: "Open Findings",
        value: i.openFindings.length,
        tone: i.openFindings.length ? "warning" : "success",
        icon: "gap",
        hint: `${i.highRisks.length} high or critical`,
      },
      {
        label: "Under Review",
        value: i.underReview.length,
        tone: "info",
        icon: "workflow",
        hint: "Awaiting evidence",
      },
      {
        label: "Unassessed Policies",
        value: i.gaps.unassessedPolicies.length,
        tone: "warning",
        icon: "policy",
        hint: `${pct(i.policyCoverage)}% policy coverage`,
      },
      {
        label: "Uncovered Regulations",
        value: i.gaps.uncoveredRegulations.length,
        tone: i.gaps.uncoveredRegulations.length ? "danger" : "success",
        icon: "regulation",
        hint: "No mapped control",
      },
    ],
  },
  AUDITOR: {
    title: "Assurance Workspace",
    subtitle: "Independent view of evidence, findings and integrity",
    kpis: (i) => [
      {
        label: "Assessments",
        value: i.counts.assessments,
        tone: "primary",
        icon: "compliance",
        hint: `${pct(i.complianceRate)}% compliant`,
      },
      {
        label: "Total Gaps",
        value: i.gaps.total,
        tone: i.gaps.total ? "warning" : "success",
        icon: "gap",
        hint: "Coverage + effectiveness",
      },
      {
        label: "Integrity Issues",
        value: i.gaps.orphanAssessments.length,
        tone: i.gaps.orphanAssessments.length ? "danger" : "success",
        icon: "lock",
        hint: "Broken policy/regulation links",
      },
      {
        label: "Reports on File",
        value: i.counts.reports,
        tone: "info",
        icon: "file",
        hint: "Evidence artefacts",
      },
    ],
  },
  ADMIN: {
    title: "Platform Operations",
    subtitle: "Microservice health, access and data footprint",
    kpis: (i, services) => [
      {
        label: "Services Online",
        value: services.filter((s) => s.status === "UP").length,
        suffix: `/${services.length}`,
        tone: services.every((s) => s.status === "UP") ? "success" : "danger",
        icon: "server",
        hint: "Via API Gateway",
      },
      {
        label: "Users",
        value: i.counts.users,
        tone: "primary",
        icon: "users",
        hint: `${i.usersByRole.length} roles in use`,
      },
      {
        label: "Records Managed",
        value:
          i.counts.policies +
          i.counts.regulations +
          i.counts.assessments +
          i.counts.reports,
        tone: "info",
        icon: "analytics",
        hint: "Across all registers",
      },
      {
        label: "Health Score",
        value: i.healthScore ?? "—",
        tone: i.health.tone,
        icon: "target",
        hint: i.health.label,
      },
    ],
  },
};

function CommandCenter() {
  const { intel, services, loading } = usePlatformData();
  const { role } = useRole();
  const { openCopilot } = useOutletContext();
  const view = ROLE_VIEWS[role.key];

  return (
    <>
      <PageHeader
        eyebrow={`${role.label} view`}
        title={view.title}
        subtitle={view.subtitle}
      />

      <div className="row g-3 mb-3">
        {view.kpis(intel, services).map((k) => (
          <div key={k.label} className="col-6 col-xl-3">
            <KpiCard {...k} value={loading ? "…" : k.value} />
          </div>
        ))}
      </div>

      {loading ? (
        <Panel>
          <LoadingState rows={6} />
        </Panel>
      ) : (
        <div className="row g-3">
          {role.key !== "ADMIN" && (
            <div className="col-xl-7">
              <HealthHero intel={intel} openCopilot={openCopilot} />
            </div>
          )}

          {role.key === "ADMIN" ? (
            <>
              <div className="col-xl-7">
                <Panel
                  title="Microservice Health"
                  subtitle="Live probe through API Gateway"
                >
                  <ServiceHealth services={services} />
                </Panel>
              </div>
              <div className="col-xl-5">
                <Panel title="Access Distribution" subtitle="Users by role">
                  <DonutChart data={intel.usersByRole} centerLabel="users" />
                </Panel>
              </div>
            </>
          ) : (
            <div className="col-xl-5">
              <Panel
                title="Assessment Status"
                subtitle="Distribution across all controls"
                className="h-100"
              >
                {intel.statusDistribution.length ? (
                  <DonutChart
                    data={intel.statusDistribution}
                    centerLabel="assessments"
                  />
                ) : (
                  <EmptyState title="No assessments yet" />
                )}
              </Panel>
            </div>
          )}

          <div className="col-xl-6">
            <Panel
              title={
                role.key === "AUDITOR"
                  ? "Findings Register"
                  : "Top Risks Requiring Attention"
              }
              subtitle="Scored by the risk engine"
              action={
                <Link to="/risk-heatmap" className="small">
                  Heatmap →
                </Link>
              }
              className="h-100"
            >
              <TopRisks intel={intel} />
            </Panel>
          </div>

          <div className="col-xl-6">
            <Panel
              title={
                <>
                  <Icon name="sparkle" size={16} className="text-accent me-1" />
                  AI Recommendations
                </>
              }
              subtitle="Prioritised by expected health uplift"
              action={
                <button
                  className="btn btn-link btn-sm p-0"
                  onClick={() => openCopilot("What should we fix first?")}
                >
                  Ask why →
                </button>
              }
              className="h-100"
            >
              <Recommendations intel={intel} />
            </Panel>
          </div>

          {role.key !== "ADMIN" && (
            <div className="col-12">
              <Panel
                title="Residual Risk by Regulation"
                subtitle="Average risk score of mapped assessments"
              >
                {intel.riskByRegulation.length ? (
                  <BarList
                    data={intel.riskByRegulation}
                    toneFor={(d) =>
                      d.value >= 65
                        ? "danger"
                        : d.value >= 40
                          ? "warning"
                          : "success"
                    }
                  />
                ) : (
                  <EmptyState title="No regulation risk data" />
                )}
              </Panel>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CommandCenter;
