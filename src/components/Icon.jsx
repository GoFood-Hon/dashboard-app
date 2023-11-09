import React from "react"

import {
  BagIcon,
  BranchIcon,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  CloseIcon,
  DashboardIcon,
  DownIcon,
  ExitIcon,
  FilterIcon,
  InvoiceIcon,
  LayoutIcon,
  MenuIcon,
  ReloadIcon,
  MoneyIcon,
  MoreIcon,
  TrashIcon,
  DotsIcon,
  SettingIcon,
  OneTouchIcon,
  ShoppingIcon,
  TimerIcon,
  UpIcon,
  UserIcon,
  WarehouseIcon,
  EyeIcon
} from "../assets/icons"

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
  chevronUp: <ChevronUp />,
  eye: <EyeIcon />,
  filter: <FilterIcon />,
  reload: <ReloadIcon />,
  setting: <SettingIcon />,
  trash: <TrashIcon />,
  dots: <DotsIcon />
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
