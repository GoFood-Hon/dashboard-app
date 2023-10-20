import React from "react"

export default function BaseLayout({ children }) {
  return (
    <div className="w-full h-screen dark:bg-slate-900 bg-slate-100 text-black dark:text-white">
      <div className="pl-[200px] pt-[76px]">
        <div className="p-6 flex flex-col">{children}</div>
      </div>
    </div>
  )
}
