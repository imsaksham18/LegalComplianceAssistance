import { useEffect, useState } from "react";
import { getRegulations } from "../services/regulationService";

function Regulations() {
  const [regulations, setRegulations] = useState([]);

  useEffect(() => {
    loadRegulations();
  }, []);

  const loadRegulations = async () => {
    const data = await getRegulations();
    setRegulations(data);
  };

  return (
    <div className="container mt-4">
      <h1>Regulation Management</h1>

      <h3>Total Regulations: {regulations.length}</h3>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Regulation Name</th>
            <th>Country</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {regulations.map((regulation) => (
            <tr key={regulation.id}>
              <td>{regulation.id}</td>
              <td>{regulation.regulationName}</td>
              <td>{regulation.country}</td>
              <td>{regulation.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Regulations;
