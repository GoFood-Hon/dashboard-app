import * as Popover from "@radix-ui/react-popover"
import React, { useContext } from "react"
import Button from "./Button"
import ToggleTheme from "./ToggleTheme"
import { restaurantList } from "../utils/restaurants"
import { Icon } from "./Icon"
import { useSelector } from "react-redux"
import { AuthContext } from "../context/AuthProvider"

export default function Header() {
  const user = useSelector((state) => state.user.value)
  const { restaurant } = useContext(AuthContext)

  const handleLogout = () => {}

  return (
    <div className="w-full p-4 flex flex-row justify-between text-black  bg-white dark:text-white dark:bg-slate-800 dark:border-slate-700 border border-slate-200 z-20 fixed">
      <div className="flex flex-row">
        <div className="border-r-2 border-r-gray-300 pr-4">
          <img className="w-[123px] h-[42px]" src="src/assets/images/goFood.png" />
        </div>
        <div className="pl-4">
          <img className="w-[123px] h-[42px]" src={restaurantList[restaurant]?.image} alt={restaurantList[restaurant]?.name} />
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
        <Popover.Root className="z-50">
          <Popover.Trigger asChild>
            <button aria-label="Update dimensions">
              <img
                className="rounded-full hover:outline-dotted hover:duration-300 hover:ease-in-out hover:outline-offset-2"
                src="https://api.dicebear.com/7.x/micah/svg?backgroundColor=b6e3f4"
                alt="avatar"
                width={40}
                height={40}
              />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="rounded-lg border-none p-5 w-[260px] text-black dark:text-white bg-white dark:bg-slate-800 dark:border dark:border-slate-700 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
              sideOffset={30}
              align="end">
              <Popover.Arrow className="fill-white dark:fill-slate-800" width={15} height={10} />
              <div className="flex flex-col gap-2.5 justify-center items-center">
                <img
                  className="rounded-full hover:outline hover:outline-cyan-500 hover:duration-75 hover:ease-in-out hover:outline-offset-2"
                  src="https://api.dicebear.com/7.x/micah/svg?backgroundColor=b6e3f4"
                  alt="avatar"
                  width={70}
                  height={70}
                />
                <div className="flex flex-col items-center">
                  <div className="font-semibold">M Geovany</div>
                  <div className="text-gray-400 text-sm">marlongeo1999@gmail.com</div>
                </div>
              </div>
              <Button text={"Manejar cuenta"} className={"mt-5 border border-slate-400 rounded text-sm"} />
              <Button
                text={"Cerrar sesión"}
                className={"mt-3 dark:border-slate-100 border-slate-400 rounded text-sm bg-slate-700 text-white"}
                onClick={handleLogout}
              />
              <div className="flex justify-center">
                <ToggleTheme className={"text-sm font-semibold"} />
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}
