import React from "react"
import { useLocation, Outlet, Navigate } from "react-router-dom"
import SideBar from "../components/SideBar"
import Header from "../components/Header"

function AuthLayout({ authenticated }) {
  const location = useLocation()
  return authenticated ? (
    <>
      <Header />
      <SideBar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  )
}

export default AuthLayout
