import React from "react"
import { Icon } from "./Icon"
import defaultImageRestaurant from "../assets/images/restaurants/kfc.png"

export default function NewOrders({ data }) {
  const statusColors = {
    confirmación: "bg-sky-200 text-cyan-500",
    "en camino": "bg-orange-100 text-amber-400",
    cancelado: "bg-red-200 text-red-400"
  }

  const status = data?.status.toLowerCase()

  return (
    <div className="pt-6 px-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex">
          <img className="w-12 h-12 p-2 rounded-full bg-light_selected_element" src={defaultImageRestaurant} />
          <div className="flex flex-col ml-4 justify-between flex-wrap">
            <span>
              Pedido: #<span className="font-semibold">{data.orderNumber}</span>
            </span>
            <div className="flex flex-row text-xs items-center text-secondary_text pt-1">
              <div className="flex flex-row items-center">
                <Icon icon="warehouse" size={17} />
                <span className="ml-2">{data?.address}</span>
              </div>
              <div className="flex flex-row ml-4 items-center">
                <Icon icon="timer" size={17} />
                <span className="ml-2">{data?.time}</span>
              </div>
              <div className="flex flex-row ml-4 items-center">
                <Icon icon="calendar" size={17} />
                <span className="ml-2">{data?.date}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded-2xl justify-center items-center ${statusColors[status]}`}
          style={{ whiteSpace: "nowrap" }}>
          <div className="text-md">{data?.status}</div>
        </div>
      </div>
    </div>
  )
}
