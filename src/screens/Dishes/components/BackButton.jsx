import React from "react"
import { useNavigate } from "react-router-dom"
import { IconArrowNarrowLeft } from "@tabler/icons-react"

export default function BackButton({ title, show }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row gap-x-3 items-center">
      <div onClick={() => navigate(-1)} className="flex flex-row w-full gap-2 items-center justify-center cursor-pointer ">
        {show ? <IconArrowNarrowLeft size="1.6rem" /> : ""}
        <h1 className="text-white-200 text-2xl font-semibold">{title}</h1>
      </div>
    </div>
  )
}
