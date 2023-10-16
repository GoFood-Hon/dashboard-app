import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Icon } from "./Icon"
import { AuthContext } from "../context/AuthProvider"
import toast from "react-hot-toast"

export default function SideBar() {
  const sideBarElements = [
    {
      label: "Dashboard",
      path: "/",
      icon: <Icon icon="dashboard" />
    },
    {
      label: "Pedidos",
      path: "/orders",
      icon: <Icon icon="shoppingCart" />
    },
    {
      label: "Transacciones",
      path: "/transactions",
      icon: <Icon icon="invoice" />
    },
    {
      label: "Menus",
      path: "/menu",
      icon: <Icon icon="menu" />
    },
    {
      label: "Complementos",
      path: "/complements",
      icon: <Icon icon="layout" />
    },
    {
      label: "Sucursales",
      path: "/branches",
      icon: <Icon icon="branch" />
    },
    {
      label: "Usuarios",
      path: "/users",
      icon: <Icon icon="users" />
    }
  ]

  const { setUser } = useContext(AuthContext)

  return (
    <div className="w-[200px] h-full flex flex-col start-0 fixed overflow-y-hidden top-0 bg-white border-slate-200 border z-10 font-bold dark:text-white dark:bg-slate-800 dark:border-slate-700">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <ul className="py-4 text-sm">
            {sideBarElements.map((item, index) => (
              <li key={index} className="flex h-12 w-full items-center">
                <Link to={item.path} className="flex w-full items-center duration-300">
                  <span>{item.icon}</span>
                  <span className="font-sans ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
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
