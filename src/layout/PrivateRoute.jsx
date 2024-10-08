import { Navigate, Outlet } from "react-router-dom"

function PrivateRoute({ allowedRoles }) {
  let userRole = localStorage.getItem('setUserRole')
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

export default PrivateRoute
