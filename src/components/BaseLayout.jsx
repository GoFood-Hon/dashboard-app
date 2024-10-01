import React from "react"

export default function BaseLayout({ children }) {
  return (
    <div className="w-full h-full min-h-screen dark:bg-slate-900 bg-slate-100 text-black dark:text-white">
      <div >
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  )
}
