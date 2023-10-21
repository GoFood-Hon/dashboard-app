import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Icon } from "./Icon"
import toast from "react-hot-toast"
import { NAVIGATION_ROUTES } from "../routes"
import NavigationItem from "./NavigationItem"

export default function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [submenuState, setSubmenuState] = useState({})
  const [selectedSubmenuRoute, setSelectedSubmenuRoute] = useState(null)

  useEffect(() => {
    const routeArray = Object.values(NAVIGATION_ROUTES)
    const currentRoute = routeArray.find((item) => location.pathname === item.path)

    if (currentRoute !== undefined) {
      setSelectedRoute(currentRoute)
      setSelectedSubmenuRoute(null)
    } else {
      const submenuItems = routeArray.filter((item) => item.submenu).flatMap((item) => Object.values(item.submenu))

      const currentSubmenuRoute = submenuItems.find((item) => location.pathname === item.path)

      setSelectedRoute(null)
      setSelectedSubmenuRoute(currentSubmenuRoute)
    }
  }, [location.pathname])

  const logout = () => {
    toast.error("Cerrando sesión")
    localStorage.removeItem("token")
    navigate("/login")
  }

  const toggleSubMenu = (submenuLabel) => {
    setSubmenuState((prevState) => ({
      ...prevState,
      [submenuLabel]: !prevState[submenuLabel]
    }))
  }

  const renderedItems = Object.values(NAVIGATION_ROUTES).map((item) => {
    const isSelected = item === selectedRoute
    const isOpen = submenuState[item.label]

    return (
      <NavigationItem
        key={item.label}
        item={item}
        isSelected={isSelected}
        isOpen={isOpen}
        toggleSubMenu={toggleSubMenu}
        selectedSubmenuRoute={selectedSubmenuRoute}
      />
    )
  })

  return (
    <div className="w-[200px] pt-[76px] h-full flex flex-col start-0 fixed overflow-y-hidden top-0 bg-white border-slate-200 border z-10 font-semibold dark:text-white dark:bg-slate-800 dark:border-slate-700">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <ul className="text-sm text-light_secondary_text border-b border-b-light_selected_element pb-2 dark:border-b-dark_selected_element dark:text-dark_secondary_text">
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
            <ul className="py-4 text-sm">{renderedItems}</ul>
          </div>
          <div>
            <button
              className="flex flex-row items-center duration-300 hover:bg-red-400 hover:rounded-lg pb-3 hover:p-3"
              onClick={logout}>
              <Icon icon="exit" />
              <span className="text-sm ml-3">Cerrar session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
