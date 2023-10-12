import React from "react"
import { useLocation, Outlet, Navigate } from "react-router-dom"

function AuthLayout({ authenticated }) {
  const location = useLocation()
  return authenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export default AuthLayout
