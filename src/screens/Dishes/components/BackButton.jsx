import React from "react"
import { Icon } from "../../../components/Icon"
import { useNavigate } from "react-router-dom"

export default function BackButton({ title }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row gap-x-3 items-center">
      <div onClick={() => navigate(-1)} className="flex flex-row w-full gap-2 items-center justify-center cursor-pointer">
        <Icon icon="arrowRight" size={17} style={{ transform: "rotate(180deg)", color: "white" }} />
        <h1 className="text-white-200 text-2xl font-semibold">{title}</h1>
      </div>
    </div>
  )
}
