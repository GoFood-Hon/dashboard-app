import React from "react"
import { Icon } from "./Icon"

export default function Button({ icon, text, className, onClick, textClassName, full = false }) {
  return (
    <button
      className={`flex ${full ? "w-full" : ""} h-10 items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none ${className}`}
      onClick={onClick}>
      <React.Fragment>
        {icon && <Icon icon={icon} size={20} className="h-5 w-5" />}
        <span className={`w-full whitespace-nowrap text-center px-4  ${textClassName}`}>{text}</span>
      </React.Fragment>
    </button>
  )
}
