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
  UsersIcon,
  WarehouseIcon,
  EyeIcon,
  SearchIcon,
  CustomCheckedIcon,
  MoonIcon,
  ConfigIcon,
  PasswordIcon,
  LabelIcon,
  BuildingIcon,
  ChefHatIcon,
  BankIcon,
  CreditCardIcon,
  VRDesignIcon,
  BellIcon,
  ArrowRightIcon
} from "../assets/icons"
import { UserIcon } from "../assets/icons/UserIcon"

export const iconComponents = {
  close: <CloseIcon />,
  dashboard: <DashboardIcon />,
  shoppingCart: <ShoppingIcon />,
  invoice: <InvoiceIcon />,
  menu: <MenuIcon />,
  layout: <LayoutIcon />,
  branch: <BranchIcon />,
  users: <UsersIcon />,
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
  dots: <DotsIcon />,
  search: <SearchIcon />,
  customChecked: <CustomCheckedIcon />,
  moon: <MoonIcon />,
  configuration: <ConfigIcon />,
  password: <PasswordIcon />,
  user: <UserIcon />,
  label: <LabelIcon />,
  building: <BuildingIcon />,
  chefHat: <ChefHatIcon />,
  bank: <BankIcon />,
  creditCard: <CreditCardIcon />,
  vrDesign: <VRDesignIcon />,
  bell: <BellIcon />,
  arrowRight: <ArrowRightIcon />
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
