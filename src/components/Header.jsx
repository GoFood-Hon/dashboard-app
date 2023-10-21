import React, { useEffect } from "react"
import Button from "./Button"
import ToggleTheme from "./ToggleTheme"
import { restaurantList } from "../utils/restaurants"
import { Icon } from "./Icon"
import { useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Popover, Text } from "@mantine/core"

export default function Header() {
  const user = useSelector((state) => state.user.value)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === "/logout") {
      localStorage.removeItem("token")
      navigate("/login")
    }
  }, [location.pathname])

  return (
    <div className="w-full p-4 flex flex-row justify-between text-black  bg-white dark:text-white dark:bg-slate-800 dark:border-slate-700 border border-slate-200 z-20 fixed">
      <div className="flex flex-row">
        <div className="border-r-2 border-r-gray-300 pr-4">
          <img className="w-[123px] h-[42px]" src="src/assets/images/goFood.png" />
        </div>
        <div className="pl-4">
          <img className="w-[123px] h-[42px]" src={restaurantList.Campero.image} alt={restaurantList.Campero.name} />
        </div>
      </div>
      <div className="flex flex-row text-sm items-center">
        <span className="mx-1 hover:bg-light_selected_element p-2 rounded-full cursor-pointer duration-500 dark:hover:bg-dark_selected_element">
          <Icon icon="alarm" />
        </span>
        <span className="hover:bg-light_selected_element p-2 rounded-full cursor-pointer duration-500 dark:hover:bg-dark_selected_element">
          <Icon icon="settings" />
        </span>
        <div className="flex flex-col items-end px-3">
          <div className="font-semibold">{user.name}</div>
          <div className="text-gray-400">{user.email}</div>
        </div>
        <Popover width={250} withArrow shadow="md" position="bottom-end" offset={{ mainAxis: 10, crossAxis: -10 }} arrowSize={12}>
          <Popover.Target>
            <button aria-label="Update dimensions">
              <img
                className="rounded-full hover:outline-dotted hover:duration-300 hover:ease-in-out hover:outline-offset-2"
                src="https://api.dicebear.com/7.x/micah/svg?backgroundColor=b6e3f4"
                alt="avatar"
                width={40}
                height={40}
              />
            </button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="p-3">
              <div className="flex flex-col gap-2.5 justify-center items-center">
                <img
                  className="rounded-full hover:outline hover:outline-cyan-500 hover:duration-75 hover:ease-in-out hover:outline-offset-2"
                  src="https://api.dicebear.com/7.x/micah/svg?backgroundColor=b6e3f4"
                  alt="avatar"
                  width={70}
                  height={70}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold">M Geovany</div>
                <div className="text-gray-400 text-sm">marlongeo1999@gmail.com</div>
              </div>
              <Button text={"Manejar cuenta"} className={"mt-5 border border-slate-400 rounded text-sm"} />
              <NavLink
                className={
                  "mt-3 dark:border-slate-100 border-slate-400 rounded text-sm bg-slate-700 text-white flex h-10 w-full items-center justify-center space-x-3 shadow-sm transition-all duration-700 focus:outline-none mb-3"
                }
                to="/logout">
                <span>Cerrar sesión</span>
              </NavLink>

              <div className="flex justify-center">
                <ToggleTheme className={"text-sm font-semibold"} />
              </div>
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  )
}
