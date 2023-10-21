import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Icon } from "./Icon"
import toast from "react-hot-toast"
import { NAVIGATION_ROUTES } from "../routes"

export default function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showMenuElements, setShowMenuElements] = useState(false)
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

  const renderNavigationItem = (item, isSelected) => (
    <li key={item.label} className="flex flex-col w-full items-center">
      {item.submenu ? (
        <>
          <Link
            to={item.path}
            className={`flex w-full items-center justify-between duration-300 hover:bg-light_selected_element rounded-lg py-3 pl-2 pr-3 hover:pl-4 dark:hover:bg-dark_selected_element ${
              isSelected && "bg-light_selected_element"
            }`}>
            <div className="flex flex-row items-center">
              <Icon icon={item.icon} />
              <span className="font-sans ml-3">{item.label}</span>
            </div>
            <button onClick={() => setShowMenuElements(!showMenuElements)}>
              <Icon icon={"chevronDown"} />
            </button>
          </Link>
          <ul className={`w-full bg-white ${showMenuElements ? "block" : "hidden"}`}>
            {Object.values(item.submenu).map((subItem) => (
              <li key={subItem.label} className="h-12 w-full items-center">
                <Link
                  to={subItem.path}
                  className={`flex w-full items-center duration-300 hover:bg-light_selected_element rounded-lg py-3 pl-2 pr-3 hover:pl-4 dark:hover:bg-dark_selected_element ${
                    subItem === selectedSubmenuRoute && "bg-light_selected_element"
                  }`}>
                  <span className="font-sans ml-3">{subItem.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link
          to={item.path}
          className={`flex w-full items-center duration-300 hover:bg-light_selected_element rounded-lg py-3 pl-2 pr-3 hover:pl-4 dark:hover:bg-dark_selected_element ${
            isSelected && "bg-light_selected_element"
          }`}>
          <Icon icon={item.icon} />
          <span className="font-sans ml-3">{item.label}</span>
        </Link>
      )}
    </li>
  )

  const renderedItems = Object.values(NAVIGATION_ROUTES).map((item) => {
    const isSelected = item === selectedRoute
    return renderNavigationItem(item, isSelected)
  })

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
