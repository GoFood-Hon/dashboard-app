import React from "react"
import { Icon } from "./Icon"

export default function Cards({ data }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HNL"
  }).format(data?.amount)

  return data ? (
    <div className="w-[300px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-6">
      <div className="p-2 mb-4 bg-light_selected_element rounded-full w-fit">{data.icon && <Icon icon={data.icon} />}</div>
      <span className="text-lg font-bold mb-1"> {formattedAmount}</span>
      <div className="flex flex-row text-xs justify-between">
        <span className="text-secondary_text">{data.label}</span>
        <div className={`flex flex-row items-center gap-x-1 ${data.percentage < 0 ? "text-red-500" : "text-emerald-400"}`}>
          <span>{data.percentage < 0 ? -data.percentage : data.percentage}%</span>
          <Icon icon={data.percentage < 0 ? "down" : "up"} />
        </div>
      </div>
    </div>
  ) : null
}
