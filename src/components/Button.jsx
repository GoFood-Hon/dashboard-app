import React from "react"
import { Icon } from "./Icon"

export default function Button({ icon, text, className, onClick, textClassName }) {
  return (
    <button
      className={`flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none ${className}`}
      onClick={onClick}>
      <React.Fragment>
        {icon && <Icon icon={icon} size={20} className="h-5 w-5" />}
        <span className={`w-full whitespace-wrap text-center px-4 ${textClassName}`}>{text}</span>
      </React.Fragment>
    </button>
  )
}
