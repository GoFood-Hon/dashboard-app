import React, { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import authUtils from "../utils/authUtils"
import LoadingCircle from "../components/LoadingCircle"
import { useDispatch } from "react-redux"
import { setUser } from "../store/features/userSlice"
import { AUTH_NAVIGATION_ROUTES, NAVIGATION_ROUTES } from "../routes"
import SettingsSidebar from "../screens/Users/SettingsSidebar"

function AuthLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const { pathname } = location
  const shouldRenderSettings = pathname.includes(NAVIGATION_ROUTES.Users.submenu.Settings.path)
  const shouldRenderSideBar = pathname.includes("/unauthorized")

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate(AUTH_NAVIGATION_ROUTES.Login.path)
      } else {
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  return loading ? (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <LoadingCircle />
    </div>
  ) : (
    <>
      <Header />
      {!shouldRenderSideBar && <SideBar />}
      {shouldRenderSettings && <SettingsSidebar />}
      <Outlet />
    </>
  )
}

export default AuthLayout
