import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icon"
import { AuthContext } from "../context/AuthProvider"
import toast from "react-hot-toast"
import { NAVIGATION_ROUTES } from "../routes"

export default function SideBar() {
  const { setUser } = useContext(AuthContext)

  return (
    <div className="w-[200px] h-full flex flex-col start-0 fixed overflow-y-hidden top-0 bg-white border-slate-200 border z-10 font-bold dark:text-white dark:bg-slate-800 dark:border-slate-700">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <ul className="py-4 text-sm">
            {Object.keys(NAVIGATION_ROUTES).map((key) => {
              const item = NAVIGATION_ROUTES[key]
              return (
                <li key={key} className="flex h-12 w-full items-center">
                  <Link to={item.path} className="flex w-full items-center duration-300">
                    <Icon icon={item.icon} />
                    <span className="font-sans ml-3">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="pb-10">
            <div className="pb-5">
              <button
                className="flex flex-row items-center"
                onClick={() => {
                  toast.error("Cerrando sesión")
                  setUser(false)
                }}>
                <Icon icon="exit" />
                <span className="text-sm ml-3">Cerrar session</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
