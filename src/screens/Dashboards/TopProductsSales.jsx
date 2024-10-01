import React, { useEffect, useState } from "react"

import { Chart } from "react-google-charts"
import reportsApi from "../../api/reportsApi"
import toast from "react-hot-toast"
import { Divider, Paper } from "@mantine/core"

export const data = [
  ["Year", "Sales", "Expenses", "Profit"],
  ["2014", 1000, 400, 200],
  ["2015", 1170, 460, 250],
  ["2016", 660, 1120, 300],
  ["2017", 1030, 540, 350]
]

export const options = {}

export const TopProductsSales = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await reportsApi.getTopSellingDishes()
        // TODO: Fix this response
        setData(response?.data || [])
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }

    getSales()
  }, [])
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Ranking de productos mas vendidos</h2>
      </div>
      <Divider my="md" />
      <div className="pb-6 flex justify-center items-center h-full">
        {data.length > 0 ? (
          <Chart chartType="Bar" width="100%" height="400px" data={data} options={options} />
        ) : (
          <div className="text-center flex flex-col justify-center h-full">
            <p className="text-secondary_text">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </Paper>
  )
}
