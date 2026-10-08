import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Legal Compliance Assistant
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Dashboard
          </Link>

          <Link className="nav-link" to="/policies">
            Policies
          </Link>

          <Link className="nav-link" to="/regulations">
            Regulations
          </Link>

          <Link className="nav-link" to="/compliances">
            Compliances
          </Link>

          <Link className="nav-link" to="/reports">
            Reports
          </Link>

          <Link className="nav-link" to="/users">
            Users
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
