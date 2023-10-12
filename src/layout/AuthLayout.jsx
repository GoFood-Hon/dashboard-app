import React, { Children } from "react"
import ToggleTheme from "../components/ToggleTheme"

export default function AuthLayout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center align-middle items-center dark:bg-slate-900 bg-slate-100 text-black dark:text-white">
      <div className="w-full p-3 xl:w-3/6 2xl:w-2/6  lg:w-3/6 md:w-4/5 sm:w-5/6 py-10 xs:w-full xs:rounded-none bg-white dark:bg-slate-800 dark:border-slate-700 drop-shadow-xl shadow-slate-100 overflow-x-hidden shadow-xl md:rounded-2xl border border-gray-200 dark:shadow-slate-800">
        <div className="md:p-12 xs:p-5 items-center justify-center flex dark:text-white">{children}</div>
        <div className="w-full flex items-center justify-center">
          <ToggleTheme className="font-bold" />
        </div>
      </div>
    </div>
  )
}
