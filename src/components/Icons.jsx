import React from "react"
import LoadingCircle from "../assets/loading.svg"

export const iconComponents = {
  loading: <LoadingCircle />
}

export default function Icons() {
  const { icon, color, size, className, containerStyle } = props

  const iconComponent = React.cloneElement(iconComponents[icon], {
    width: size,
    height: size,
    className
  })

  return <div>{iconComponent}</div>
}
