import React from "react"
import ToggleTheme from "../components/ToggleTheme"
import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"

export default function UnauthenticatedLayout() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between dark:bg-slate-900 bg-light_bg_primary text-black dark:text-white">
      <div className="w-full p-3 bg-white flex justify-center mb-5 border-slate-200 border  dark:bg-slate-800 dark:border-slate-700 ">
        <img className="w-44 h-[54px]" src="src/assets/gooFood.png" />
      </div>
      <div className="w-full justify-center p-3 xl:w-3/6 2xl:w-2/6 lg:w-3/6 md:w-3/6 sm:w-5/6 py-10 xs:w-full xs:rounded-none bg-white dark:bg-slate-800 dark:border-slate-700 drop-shadow-xl shadow-slate-100 overflow-x-hidden shadow-xl md:rounded-2xl border border-gray-200 dark:shadow-slate-800">
        <div className="md:p-12 xs:p-5 items-center justify-center flex dark:text-white">{<Outlet />}</div>
        <div className="w-full flex items-center justify-center">
          <ToggleTheme className="font-bold" />
        </div>
      </div>
      <Footer />
    </div>
  )
}
