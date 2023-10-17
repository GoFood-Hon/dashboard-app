import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import authUtils from "../utils/authUtils"
import LoadingCircle from "../components/LoadingCircle"
import { useDispatch } from "react-redux"
import { setUser } from "../store/features/userSlice"

function AuthLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate("/login")
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
      <SideBar />
      <Outlet />
    </>
  )
}

export default AuthLayout
