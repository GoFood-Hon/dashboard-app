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
  exit: <ReactSVG src={"src/assets/icons/exit.svg"} />,
  oneTouch: <ReactSVG src={"src/assets/logoOT.svg"} />,
  settings: <ReactSVG src={"src/assets/icons/config.svg"} />,
  alarm: <ReactSVG src={"src/assets/icons/alarm.svg"} />,
  mail: <ReactSVG src={"src/assets/icons/mail.svg"} />,
  money: <ReactSVG src={"src/assets/icons/money.svg"} />,
  down: <ReactSVG src={"src/assets/icons/down.svg"} />,
  up: <ReactSVG src={"src/assets/icons/up.svg"} />,
  bag: <ReactSVG src={"src/assets/icons/bag.svg"} />,
  warehouse: <ReactSVG src={"src/assets/icons/warehouse.svg"} />,
  timer: <ReactSVG src={"src/assets/icons/timer.svg"} />,
  calendar: <ReactSVG src={"src/assets/icons/calender.svg"} />,
  more: <ReactSVG src={"src/assets/icons/more.svg"} />
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
