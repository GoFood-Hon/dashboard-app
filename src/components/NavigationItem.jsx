import React from "react"
import { Icon } from "./Icon"
import { Link } from "react-router-dom"

export default function NavigationItem({ item, isSelected, isOpen, toggleSubMenu, selectedSubmenuRoute }) {
  return (
    <li className="flex flex-col w-full items-center">
      {item.submenu ? (
        <>
          <Link
            to={item.path}
            className={`flex w-full items-center justify-between duration-300 hover:bg-light_selected_element rounded-lg py-3 my-2 pl-2 pr-3 hover:pl-4 dark:hover:bg-dark_selected_element ${
              isSelected && "bg-light_selected_element"
            }`}>
            <div className="flex flex-row items-center">
              <Icon icon={item.icon} />
              <span className="font-sans ml-3">{item.label}</span>
            </div>
            <button onClick={() => toggleSubMenu(item.label)}>
              <Icon icon={isOpen ? "chevronUp" : "chevronDown"} />
            </button>
          </Link>
          {isOpen && (
            <ul className="w-full bg-white">
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
          )}
        </>
      ) : (
        <Link
          to={item.path}
          className={`flex w-full items-center duration-300 hover:bg-light_selected_element rounded-lg py-3 pl-2 pr-3 my-1 hover:pl-4 dark:hover:bg-dark_selected_element ${
            isSelected && "bg-light_selected_element"
          }`}>
          <Icon icon={item.icon} />
          <span className="font-sans ml-3">{item.label}</span>
        </Link>
      )}
    </li>
  )
}
