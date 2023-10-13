import React from "react"
import * as Popover from "@radix-ui/react-popover"
import { Icon } from "./Icon"
import Button from "./Button"
import ToggleTheme from "./ToggleTheme"

export default function Header() {
  return (
    <div className="w-full p-4 flex flex-row justify-between bg-white dark:bg-slate-800 dark:border-slate-700 border border-gray-200">
      <div className="flex items-center font-bold">🍔 GoFood</div>
      <div className="flex flex-row text-sm items-center">
        <div className="flex flex-col items-end px-3">
          <div className="font-semibold">M Geovany</div>
          <div className="text-gray-400">Software Engineer</div>
        </div>
        <Popover.Root>
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
              className="rounded-lg p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.sky12)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
              sideOffset={5}>
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
              <Button text={"Cerrar sesión"} className={"mt-3 border border-slate-400 rounded text-sm bg-slate-800 text-white"} />
              <div className="flex justify-center">
                <ToggleTheme className={"text-sm font-semibold"} />
              </div>
              <Popover.Close
                className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center absolute top-[5px] right-[5px] hover:bg-sky2 focus:shadow-[0_0_0_2px] focus:shadow-sky12 outline-none cursor-default"
                aria-label="Close">
                <Icon icon="close" size={"20"} />
              </Popover.Close>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}
