import { useEffect, useState } from "react";
import { getReports } from "../services/reportService";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await getReports();
    setReports(data);
  };

  return (
    <div className="container mt-4">
      <h1>Report Management</h1>

      <h3>Total Reports: {reports.length}</h3>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Report Name</th>
            <th>Report Type</th>
            <th>Status</th>
            <th>Generated Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.reportName}</td>
              <td>{report.reportType}</td>
              <td>{report.status}</td>
              <td>{report.generatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
