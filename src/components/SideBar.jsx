import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Icon } from "./Icon"
import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_RES_ADMIN,
  NAVIGATION_ROUTES_BRANCH_ADMIN,
  NAVIGATION_ROUTES_SUPER_ADMIN,
  NAVIGATION_ROUTES_KITCHEN
} from "../routes"
import NavigationItem from "./NavigationItem"
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
      [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES_RES_ADMIN,
      [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN,
      [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN,
      [APP_ROLES.cashierUser]: NAVIGATION_ROUTES_BRANCH_ADMIN
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
    localStorage.removeItem("token")
    localStorage.removeItem("setUserRole")
    localStorage.removeItem("hideSubscriptionAlert") 
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  const toggleSubMenu = (submenuLabel) => {
    setSubmenuState((prevState) => ({
      ...prevState,
      [submenuLabel]: !prevState[submenuLabel]
    }))
  }

  const roleRoutesMap = {
    [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES_RES_ADMIN,
    [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN,
    [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN,
    [APP_ROLES.kitchenUser]: NAVIGATION_ROUTES_KITCHEN,
    [APP_ROLES.cashierUser]: NAVIGATION_ROUTES_BRANCH_ADMIN
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
    <div className="w-[280px] pt-[76px] h-full flex flex-col start-0 fixed overflow-y-hidden top-0 bg-white border-slate-200 border z-10 font-semibold dark:text-white dark:bg-slate-800 dark:border-slate-700">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <ul className="text-sm text-light_secondary_text  border-b-light_selected_element pb-2 dark:border-b-dark_selected_element dark:text-dark_secondary_text"></ul>
            <ul className="py-4 text-sm">{renderedItems}</ul>
          </div>
          <button
            className="flex flex-row w-full items-center duration-300 hover:bg-red-400 hover:rounded-lg p-3"
            onClick={logout}>
            <Icon icon="exit" size={17} />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}
