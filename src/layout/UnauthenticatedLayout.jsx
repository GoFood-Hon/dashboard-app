import React, { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import livingImage from "../assets/images/living.png"
import layout1Image from "../assets/images/layout1.png"
import logoImage from "../assets/images/goFood.png"
import forkImage from "../assets/images/fork.png"
import background from "../assets/images/background-gofood.webp"
import authUtils from "../utils/authUtils"
import LoadingCircle from "../components/LoadingCircle"

export default function UnauthenticatedLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [bgImage, setBgImage] = useState(layout1Image)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate("/")
      }
    }
    checkAuth()
  }, [navigate])

  useEffect(() => {
    if (location.pathname === "/olvideMiContrase%C3%B1a") {
      setBgImage(livingImage)
    } else {
      setBgImage(layout1Image)
    }
  }, [location])

  return loading ? (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <LoadingCircle />
    </div>
  ) : (
    <div className="w-screen h-screen flex flex-col items-center justify-between dark:bg-slate-900 bg-slate-100 text-black dark:text-white">
      <div className="w-full p-1 bg-white flex justify-center mb-2 border-slate-200 border  dark:bg-slate-800 dark:border-slate-700 ">
        <img className="w-44 h-[54px] " src={logoImage} />
      </div>
      <div className="w-full xs:h-fit xs:rounded-2xl xs:drop-shadow-none xs:shadow-none sm:w-5/6 md:w-3/6 lg:w-5/6 lg:max-w-[1100px] xl:w-5/6 2xl:w-5/6 lg:justify-between bg-light_bg_child rounded-2xl dark:bg-slate-800 dark:border-slate-700 md:drop-shadow-xl md:shadow-slate-100 overflow-hidden md:shadow-xl md:border dark:shadow-slate-800 flex flex-row mb-2">
        <div className="lg:w-full lg:min-w-[500px] lg:max-w-[620px] lg:h-[660px] relative -left-2 hidden md:hidden lg:flex">
          <img
            src={bgImage}
            className="lg:w-full h-[600px] left-0 -top-2 absolute bg-opacity-20 rounded-2xl object-cover"
            style={{ clipPath: "inset(8px)" }}
            alt="hamburger"
          />
          <img
            className="w-[394px] h-[394px] left-[394px] top-[394px] absolute origin-top-left rotate-180 object-cover filter grayscale opacity-60"
            src={forkImage}
            alt="fork"
          />
          <div className="w-[477px] pl-10 top-[400px] absolute text-white text-[32px] font-bold  leading-10">
            Gestión y entrega de tus platillos: Tu socio de negocios es GoFood
          </div>
        </div>
        <div className="xs:w-full md:w-full md:h-full lg:w-full h-fit lg:border-none flex flex-col items-center justify-between px-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div />
          {<Outlet />}
          <div className="flex items-end" />
        </div>
      </div>
      <Footer />
    </div>
  )
}
