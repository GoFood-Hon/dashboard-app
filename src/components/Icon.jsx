import React from "react"
import { ReactSVG } from "react-svg"
import { CloseIcon } from "../assets/icons/CloseIcon"
import { DashboardIcon } from "../assets/icons/DashboardIcon"
import { ShoppingIcon } from "../assets/icons/ShoppingIcon"
import { InvoiceIcon } from "../assets/icons/InvoiceIcon"
import { MenuIcon } from "../assets/icons/MenuIcon"
import { LayoutIcon } from "../assets/icons/LayoutIcon"
import { BranchIcon } from "../assets/icons/BranchIcon"
import { UserIcon } from "../assets/icons/UserIcon"
import { ExitIcon } from "../assets/icons/ExitIcon"
import { OneTouchIcon } from "../assets/icons/OneTouchIcon"
import { MoneyIcon } from "../assets/icons/MoneyIcon"
import { DownIcon } from "../assets/icons/DownIcon"
import { UpIcon } from "../assets/icons/UpIcon"
import { BagIcon } from "../assets/icons/BagIcon"
import { WarehouseIcon } from "../assets/icons/WarehouseIcon"
import { TimerIcon } from "../assets/icons/TimerIcon"
import { CalendarIcon } from "../assets/icons/CalendarIcon"
import { MoreIcon } from "../assets/icons/MoreIcon"
import { ChevronDown } from "../assets/icons/ChevronDown"
import { ChevronUp } from "../assets/icons/ChevronUp"

export const iconComponents = {
  close: <CloseIcon />,
  dashboard: <DashboardIcon />,
  shoppingCart: <ShoppingIcon />,
  invoice: <InvoiceIcon />,
  menu: <MenuIcon />,
  layout: <LayoutIcon />,
  branch: <BranchIcon />,
  users: <UserIcon />,
  exit: <ExitIcon />,
  oneTouch: <OneTouchIcon />,

  money: <MoneyIcon />,
  down: <DownIcon />,
  up: <UpIcon />,
  bag: <BagIcon />,
  warehouse: <WarehouseIcon />,
  timer: <TimerIcon />,
  calendar: <CalendarIcon />,
  more: <MoreIcon />,
  chevronDown: <ChevronDown />,
  chevronUp: <ChevronUp />
}

export const Icon = (props) => {
  const { icon, color, size, style, className } = props

  const Wrapper = "div"

  const iconComponent = React.cloneElement(iconComponents[icon], {
    width: size,
    height: size,
    style: { color, ...style }
  })

  return <Wrapper className={className}>{iconComponent}</Wrapper>
}
