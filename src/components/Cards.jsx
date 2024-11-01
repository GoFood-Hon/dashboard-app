import React from "react"
import { Icon } from "./Icon"
import { Link } from "react-router-dom"
import { Paper } from "@mantine/core"

export default function Cards({ data }) {
  return data ? (
    <Link to={data.link}>
      <Paper withBorder radius='md' className="w-full min-w-[16rem] min-h-[12rem] rounded-2xl shadow flex flex-col p-6">
        <div className="p-2 mb-4 bg-yellow-100 rounded-full w-10 h-10 text-center flex flex-col justify-center items-center text-xl">
          {data.icon ? <Icon icon={data.icon} size={17} /> : "🔗"}
        </div>
        <span className="text-lg font-bold mb-1"> {data?.title}</span>
        <div className="flex flex-row text-xs justify-between">
          <span className="text-secondary_text">{data.description}</span>
          <div className="flex flex-row items-center justify-center gap-x-1 text-emerald-400 cursor-pointer hover:underline">
            Ir
            <div className="rotate-90 ">
              <Icon icon={"up"} size={10} />
            </div>
          </div>
        </div>
      </Paper>
    </Link>
  ) : null
}
