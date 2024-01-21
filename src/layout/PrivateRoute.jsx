import { Navigate, Outlet } from "react-router-dom"

function PrivateRoute({ allowedRoles, userRole }) {
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

export default PrivateRoute
