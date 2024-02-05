import { Grid } from "@mantine/core"
import React from "react"
import { formatDateDistanceToNow, formatDateToString } from "../utils"
import { Icon } from "./Icon"

export const HistoryTable = ({ item }) => {
  return (
    <Grid my={20} grow justify="space-between" align="center">
      <Grid.Col span={{ sm: 5 }}>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-blue-950">{item?.title}</span>
          <div className="flex flex-row gap-3 text-gray-500">
            {item.couponType === "fecha" || (item.startDate && item.endDate) ? (
              <>
                <div className="flex flex-row items-center">
                  <Icon icon="calendar" size={17} />
                  <span className="pl-2">{formatDateToString(item.startDate)}</span>
                </div>
                <div className="flex flex-row items-center">
                  <Icon icon="calendar" size={17} />
                  <span className="pl-2">{formatDateToString(item.endDate)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row items-center pb-3">
                  <span>Cantidad de usos:</span>
                  <span>{item.timesToUse}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 2 }}>
        <div className="flex flex-row items-center text-gray-600">
          <Icon icon="timer" size={17} />
          <span className="pl-2">{formatDateDistanceToNow(item?.updatedAt)}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 3 }}>
        <div
          className={`flex gap-2 px-2 py-2 rounded-full flex-row items-end justify-center text-md font-semibold ${
            item.available ? "text-green-600 bg-green-100" : "bg-red-100 text-red-600"
          }`}>
          <span>Cupón</span>
          <span>{item.available ? "Activo" : "Inactivo"}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 2 }}>
        <div className="flex gap-2 items-center justify-center font-bold cursor-pointer">
          <span>Ver detalles</span>
        </div>
      </Grid.Col>
    </Grid>
  )
}
