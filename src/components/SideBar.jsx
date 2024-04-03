import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Icon } from "./Icon"
import toast from "react-hot-toast"
import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_BRANCH_ADMIN,
  NAVIGATION_ROUTES_SUPER_ADMIN
} from "../routes"
import NavigationItem from "./NavigationItem"
import { AlarmIcon } from "../assets/icons/AlarmIcon"
import { MailIcon } from "../assets/icons/MailIcon"
import { useSelector } from "react-redux"
import { APP_ROLES } from "../utils/constants"

export default function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((state) => state.user.value)

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [submenuState, setSubmenuState] = useState({})
  const [selectedSubmenuRoute, setSelectedSubmenuRoute] = useState(null)

  useEffect(() => {
    const roleRoutesMap = {
      [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES,
      [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN,
      [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN
    }

    const routeArray = roleRoutesMap[user.role] || []

    if (Array.isArray(routeArray)) {
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
    }
  }, [location.pathname])

  const logout = () => {
    toast.success("Cerrando sesión")
    localStorage.removeItem("token")
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  const toggleSubMenu = (submenuLabel) => {
    setSubmenuState((prevState) => ({
      ...prevState,
      [submenuLabel]: !prevState[submenuLabel]
    }))
  }

  const roleRoutesMap = {
    [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES,
    [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN,
    [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN
  }

  const selectedRoutes = roleRoutesMap[user.role] || NAVIGATION_ROUTES_SUPER_ADMIN

  const renderedItems = Object.values(selectedRoutes).map((item) => {
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
                  <AlarmIcon />
                  <span className="ml-3">Notificaciones</span>
                </Link>
              </li>
              {/*  <li className="flex h-12 w-full items-center">
                <Link to="/" className="flex w-full items-center duration-300">
                  <MailIcon />
                  <span className="ml-3">Mensajes</span>
                </Link>
              </li> */}
            </ul>
            <h1 className="text-light_secondary_text uppercase pt-5 text-sm dark:text-dark_secondary_text">General</h1>
            <ul className="py-4 text-sm">{renderedItems}</ul>
          </div>
          <div>
            <button
              className="flex flex-row items-center duration-300 hover:bg-red-400 hover:rounded-lg pb-3 hover:p-3"
              onClick={logout}>
              <Icon icon="exit" size={17} />
              <span className="text-sm ml-3">Cerrar session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
