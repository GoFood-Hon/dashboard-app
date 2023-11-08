import React from "react"
import { Icon } from "./Icon"

export default function Footer() {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-6 bg-white border-2 border-slate-200 text-light-secondary-text text-xs dark:bg-slate-800 dark:border-slate-700 md:px-20 lg:flex-row lg:justify-between">
      <div className="lg:w-[275px] text-zinc-500 font-normal">® Todos los derechos reservados 2024. Go food</div>
      <div className="justify-start items-center gap-5 flex">
        <div className="text-zinc-500 font-normal ">Políticas de privacidad</div>
        <div className="text-zinc-500 font-normal">Términos y Condiciones</div>
      </div>
      <div className="lg:w-[275px] w-full flex flex-col items-center h-[31px] relative">
        <div className="lg:right-0 top-0 absolute text-zinc-500 text-[10px]">powered by</div>
        <Icon
          size={17}
          icon="oneTouch"
          className="w-[100px] h-3.5 lg:right-0 top-[17px] absolute flex-col justify-start items-start inline-flex"
        />
      </div>
    </div>
  )
}
