import { useEffect, useState } from "react";
import { getPolicies } from "../services/policyService";

function Policies() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    const data = await getPolicies();
    setPolicies(data);
  };

  return (
    <div className="container mt-4">
      <h1>Policy Management</h1>

      <h3>Total Policies: {policies.length}</h3>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id}>
              <td>{policy.id}</td>
              <td>{policy.title}</td>
              <td>{policy.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Policies;
