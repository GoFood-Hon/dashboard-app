import React, { useState } from "react"
import LoadingCircle from "./LoadingCircle"
import { Icon } from "./Icon"

export default function Button({ icon, text, className, onClick }) {
  const [btnClicked, setBtnClicked] = useState(false)
  return (
    <button
      disabled={btnClicked}
      className={`${
        btnClicked && "cursor-not-allowed"
      } flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none mb-3 ${className}`}
      onClick={() => {
        setBtnClicked(true)
        onClick()
      }}>
      {btnClicked ? (
        <LoadingCircle />
      ) : (
        <>
          {icon && <Icon icon={icon} className="h-5 w-5" />}
          <p>{text}</p>
        </>
      )}
    </button>
  )
}
