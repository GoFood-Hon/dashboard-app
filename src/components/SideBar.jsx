import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icon"
import { AuthContext } from "../context/AuthProvider"
import toast from "react-hot-toast"
import { NAVIGATION_ROUTES } from "../routes"

export default function SideBar() {
  const { setUser } = useContext(AuthContext)

  return (
    <div className="w-[200px] pt-[76px] h-full flex flex-col start-0 fixed overflow-y-hidden top-0 bg-white border-slate-200 border z-10 font-semibold dark:text-white dark:bg-slate-800 dark:border-slate-700">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <ul className="text-sm text-light_secondary_text border-b border-b-light_selected_element pb-5 dark:border-b-dark_selected_element dark:text-dark_secondary_text">
              <li className="flex h-12 w-full items-center">
                <Link to="/" className="flex w-full items-center duration-300">
                  <Icon icon="alarm" />
                  <span className="ml-3">Notificaciones</span>
                </Link>
              </li>
              <li className="flex h-12 w-full items-center">
                <Link to="/" className="flex w-full items-center duration-300">
                  <Icon icon="mail" />
                  <span className="ml-3">Mensajes</span>
                </Link>
              </li>
            </ul>
            <h1 className="text-light_secondary_text uppercase pt-5 text-sm dark:text-dark_secondary_text">General</h1>
            <ul className="py-4 text-sm">
              {Object.keys(NAVIGATION_ROUTES).map((key) => {
                const item = NAVIGATION_ROUTES[key]
                return (
                  <li key={key} className="flex h-12 w-full items-center">
                    <Link
                      to={item.path}
                      className="flex w-full items-center duration-300 hover:bg-light_selected_element hover:rounded-lg hover:p-3 dark:hover:bg-dark_selected_element">
                      <Icon icon={item.icon} />
                      <span className="font-sans ml-3">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <button
              className="flex flex-row items-center duration-300 hover:bg-red-400 hover:rounded-lg pb-3 hover:p-3"
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
  )
}
