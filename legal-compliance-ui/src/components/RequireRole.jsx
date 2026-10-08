import Icon from "./ui/Icon";
import { useRole } from "../context/RoleContext";

function RequireRole({ roles, children }) {
  const { hasRole, role } = useRole();
  if (hasRole(roles)) return children;

  return (
    <div className="empty-state my-5">
      <Icon name="lock" size={32} />
      <div className="fw-semibold mt-2">Restricted for {role.label}</div>
      <div className="small text-body-secondary">
        Switch persona from the top bar to access this workspace.
      </div>
    </div>
  );
}

export default RequireRole;
