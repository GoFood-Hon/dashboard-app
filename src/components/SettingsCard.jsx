import React from "react"
import { Icon } from "./Icon"
import { Link } from "react-router-dom"

export default function SettingsCard({ title, iconName, linkPage, children }) {
  return (
    <section className="bg-white rounded-lg border border-blue-100 pb-5 my-4">
      <div className="w-full p-3 bg-[#f5f9ff] rounded-lg border border-blue-100 items-center justify-between flex flex-wrap flex-row">
        <div className="flex flex-row gap-2 items-center">
          <Icon icon={iconName || "chevronDown"} size={17} />
          <div className="text-sky-950 text-base font-bold leading-normal">{title}</div>
        </div>
        {linkPage ? (
          <Link to={linkPage}>
            <Icon icon="arrowRight" size={17} />
          </Link>
        ) : null}
      </div>
      <div className="px-20 py-4">{children}</div>
    </section>
  )
}
