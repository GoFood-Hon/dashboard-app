import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../../components/Icon"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"

export default function SettingsSidebar() {
  const [selectedRoute, setSelectedRoute] = useState(null)

  const renderRouteItem = (value, path) => {
    if (value.type === "button") {
      return (
        <li key={path.toLowerCase()} className="flex h-10 w-full items-center">
          <Link
            to={path.toLowerCase()}
            className={`flex w-full items-center duration-300 hover:bg-light_selected_element rounded-lg py-3 pl-2 pr-3 my-1 `}>
            <Icon icon={value.icon} size={17} />
            <span className="font-sans ml-3">{value.label}</span>
          </Link>
        </li>
      )
    } else {
      return (
        <li key={`${value.label.toLowerCase()}-label`}>
          <h1 className="text-light_secondary_text uppercase pt-3 pb-2 text-sm dark:text-dark_secondary_text border-b border-b-light_selected_element">
            {value.label}
          </h1>
          {value.children && <ul>{renderRoutes(value.children, path)}</ul>}
        </li>
      )
    }
  }

  const renderRoutes = (routes, parentPath = "") => {
    return Object.entries(routes).map(([key, value]) => {
      const path = `${parentPath}${value.path || ""}`
      return renderRouteItem(value, path)
    })
  }

  return (
    <div className="w-[200px] pt-[76px] h-full flex ml-[200px] flex-col start-0 fixed overflow-y-hidden top-0 bg-white border-slate-200 border z-10 font-semibold dark:text-white dark:bg-slate-800 dark:border-slate-700">
      <div className="p-5 h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <ul className="text-sm text-light_secondary_text pb-2 dark:border-b-dark_selected_element dark:text-dark_secondary_text">
              {renderRoutes(SETTING_NAVIGATION_ROUTES)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
