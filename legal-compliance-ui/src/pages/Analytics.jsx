import { useMemo, useState } from "react";
import {
  EmptyState,
  KpiCard,
  LoadingState,
  PageHeader,
  Panel,
} from "../components/ui/Primitives";
import { BarList, DonutChart, RadarChart } from "../components/charts/Charts";
import { usePlatformData } from "../context/PlatformDataContext";
import { buildIntelligence, RISK_LEVELS } from "../engine/riskEngine";

const pct = (v) => Math.round(v * 100);

function Analytics() {
  const { data, intel: globalIntel, loading } = usePlatformData();
  const [jurisdiction, setJurisdiction] = useState("ALL");

  // Cross-filter: every chart below is recomputed for the selected jurisdiction.
  const intel = useMemo(() => {
    if (jurisdiction === "ALL") return globalIntel;
    const regulations = (data.regulations || []).filter(
      (r) => (r.country || "Unspecified") === jurisdiction,
    );
    const ids = new Set(regulations.map((r) => r.id));
    return buildIntelligence({
      ...data,
      regulations,
      compliances: (data.compliances || []).filter((c) =>
        ids.has(c.regulationId),
      ),
    });
  }, [data, globalIntel, jurisdiction]);

  const riskLevels = Object.values(RISK_LEVELS)
    .map((level) => ({
      key: level.key,
      label: level.label,
      value: intel.assessments.filter((a) => a.risk.level.key === level.key)
        .length,
    }))
    .filter((d) => d.value > 0);

  const reportStatus = Object.entries(
    (data.reports || []).reduce(
      (acc, r) => ({
        ...acc,
        [r.status || "Unknown"]: (acc[r.status || "Unknown"] || 0) + 1,
      }),
      {},
    ),
  ).map(([label, value]) => ({ key: label, label, value }));

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Compliance Analytics"
        subtitle="Interactive, cross-filtered analysis of posture, maturity and residual risk."
        actions={
          <select
            className="form-select form-select-sm"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            aria-label="Filter by jurisdiction"
          >
            <option value="ALL">All jurisdictions</option>
            {globalIntel.jurisdictionDistribution.map((j) => (
              <option key={j.key} value={j.key}>
                {j.label}
              </option>
            ))}
          </select>
        }
      />

      <div className="row g-3 mb-3">
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Health Score"
            value={intel.healthScore ?? "—"}
            tone={intel.health.tone}
            icon="target"
            hint={intel.health.label}
          />
        </div>
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Compliance Rate"
            value={pct(intel.complianceRate)}
            suffix="%"
            tone="success"
            icon="compliance"
            hint={`${intel.compliant.length} of ${intel.counts.assessments}`}
          />
        </div>
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Policy Coverage"
            value={pct(intel.policyCoverage)}
            suffix="%"
            tone="info"
            icon="policy"
            hint="Policies with ≥1 assessment"
          />
        </div>
        <div className="col-6 col-xl-3">
          <KpiCard
            label="Maturity Index"
            value={intel.maturity.index}
            suffix="/100"
            tone="primary"
            icon="analytics"
            hint={`Level ${intel.maturity.level} · ${intel.maturity.name}`}
          />
        </div>
      </div>

      {loading ? (
        <Panel>
          <LoadingState rows={8} />
        </Panel>
      ) : (
        <div className="row g-3">
          <div className="col-xl-5">
            <Panel
              title="Compliance Maturity Index"
              subtitle={`Level ${intel.maturity.level} · ${intel.maturity.name}`}
              className="h-100"
            >
              <div className="d-flex flex-wrap align-items-center gap-3">
                <RadarChart dimensions={intel.maturity.dimensions} />
                <div className="flex-grow-1" style={{ minWidth: 180 }}>
                  <BarList
                    data={intel.maturity.dimensions.map((d) => ({
                      key: d.key,
                      label: `${d.label} (${pct(d.weight)}%)`,
                      value: pct(d.value),
                    }))}
                    unit="%"
                    toneFor={(d) =>
                      d.value >= 70
                        ? "success"
                        : d.value >= 40
                          ? "warning"
                          : "danger"
                    }
                  />
                </div>
              </div>
              {intel.maturity.next && (
                <p className="small text-body-secondary mt-3 mb-0">
                  To reach Level {intel.maturity.next.level} (
                  {intel.maturity.next.name}), raise the index to{" "}
                  {intel.maturity.next.min}. Focus on{" "}
                  <strong>{intel.maturity.weakest.label}</strong>.
                </p>
              )}
            </Panel>
          </div>

          <div className="col-md-6 col-xl-3">
            <Panel title="Assessment Status" className="h-100">
              {intel.statusDistribution.length ? (
                <DonutChart
                  data={intel.statusDistribution}
                  centerLabel="checks"
                  size={140}
                />
              ) : (
                <EmptyState title="No data" />
              )}
            </Panel>
          </div>

          <div className="col-md-6 col-xl-4">
            <Panel title="Risk Level Distribution" className="h-100">
              {riskLevels.length ? (
                <DonutChart
                  data={riskLevels}
                  centerLabel="findings"
                  size={140}
                />
              ) : (
                <EmptyState title="No data" />
              )}
            </Panel>
          </div>

          <div className="col-xl-6">
            <Panel
              title="Residual Risk by Regulation"
              subtitle="Average engine score"
              className="h-100"
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
                <EmptyState title="No data" />
              )}
            </Panel>
          </div>

          <div className="col-md-6 col-xl-3">
            <Panel
              title="Regulatory Footprint"
              subtitle="Click to filter"
              className="h-100"
            >
              {globalIntel.jurisdictionDistribution.length ? (
                <ul className="list-unstyled mb-0 filter-list">
                  {globalIntel.jurisdictionDistribution.map((j) => (
                    <li key={j.key}>
                      <button
                        className={`filter-row ${jurisdiction === j.key ? "active" : ""}`}
                        onClick={() =>
                          setJurisdiction(
                            jurisdiction === j.key ? "ALL" : j.key,
                          )
                        }
                      >
                        <span>{j.label}</span>
                        <span className="fw-semibold">{j.value}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No data" />
              )}
            </Panel>
          </div>

          <div className="col-md-6 col-xl-3">
            <Panel title="Report Pipeline" className="h-100">
              {reportStatus.length ? (
                <DonutChart
                  data={reportStatus}
                  centerLabel="reports"
                  size={140}
                />
              ) : (
                <EmptyState title="No data" />
              )}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}

export default Analytics;
