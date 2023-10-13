import React from "react"
import { ReactSVG } from "react-svg"

export const iconComponents = {
  google: <ReactSVG src={"src/assets/icons/google.svg"} />,
  facebook: <ReactSVG src={"src/assets/icons/facebook.svg"} />,
  apple: <ReactSVG src={"src/assets/icons/apple.svg"} />,
  close: <ReactSVG src={"src/assets/icons/close.svg"} />,
  dashboard: <ReactSVG src={"src/assets/icons/dashboard.svg"} />,
  shoppingCart: <ReactSVG src={"src/assets/icons/shopping.svg"} />,
  invoice: <ReactSVG src={"src/assets/icons/invoice.svg"} />,
  menu: <ReactSVG src={"src/assets/icons/menu.svg"} />,
  layout: <ReactSVG src={"src/assets/icons/layout.svg"} />,
  branch: <ReactSVG src={"src/assets/icons/branch.svg"} />,
  users: <ReactSVG src={"src/assets/icons/users.svg"} />,
  exit: <ReactSVG src={"src/assets/icons/exit.svg"} />
}

export const Icon = (props) => {
  const { icon, color, size, style, containerStyle, isPressable = false, className } = props

  const Wrapper = isPressable ? "a" : "div"

  const iconComponent = React.cloneElement(iconComponents[icon], {
    width: size,
    height: size,
    style: { color, ...style }
  })

  return (
    <Wrapper className={className} style={containerStyle}>
      {iconComponent}
    </Wrapper>
  )
}
