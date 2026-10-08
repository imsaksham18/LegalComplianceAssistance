function Dashboard() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Legal & Compliance Research Assistant</h1>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5>Policies</h5>
              <h2>4</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Regulations</h5>
              <h2>1</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5>Compliances</h5>
              <h2>1</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5>Reports</h5>
              <h2>1</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card text-white bg-dark">
            <div className="card-body">
              <h5>Users</h5>
              <h2>1</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
