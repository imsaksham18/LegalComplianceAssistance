import { useEffect, useState } from "react";
import { getCompliances } from "../services/complianceService";

function Compliances() {
  const [compliances, setCompliances] = useState([]);

  useEffect(() => {
    loadCompliances();
  }, []);

  const loadCompliances = async () => {
    const data = await getCompliances();
    setCompliances(data);
  };

  return (
    <div className="container mt-4">
      <h1>Compliance Management</h1>

      <h3>Total Compliances: {compliances.length}</h3>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Policy ID</th>
            <th>Regulation ID</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {compliances.map((compliance) => (
            <tr key={compliance.id}>
              <td>{compliance.id}</td>
              <td>{compliance.policyId}</td>
              <td>{compliance.regulationId}</td>
              <td>{compliance.status}</td>
              <td>{compliance.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Compliances;
