import React, { useEffect, useState } from "react"
import Chart from "react-google-charts"
import toast from "react-hot-toast"
import reportsApi from "../../api/reportsApi"
import { Divider, Paper } from "@mantine/core"

export const data = [
  [
    {
      type: "date",
      id: "Date"
    },
    {
      type: "number",
      id: "Sales"
    }
  ],

  [new Date(2024, 0, 13), 37032],
  [new Date(2024, 0, 14), 37032],
  [new Date(2024, 1, 14), 37032],
  [new Date(2024, 2, 14), 38024],
  [new Date(2024, 3, 15), 38024],
  [new Date(2024, 4, 16), 38108],
  [new Date(2024, 5, 17), 38229],

  [new Date(2024, 4, 4), 38177],
  [new Date(2024, 4, 5), 38705],
  [new Date(2024, 4, 12), 38210],
  [new Date(2024, 4, 13), 38029],
  [new Date(2024, 4, 19), 38823],
  [new Date(2024, 4, 23), 38345],
  [new Date(2024, 4, 24), 38436],
  [new Date(2024, 4, 30), 38447],
  [new Date(2023, 4, 31), 38447],
  [new Date(2023, 4, 31), 38447],
  [new Date(2023, 4, 31), 38447]
]

export const options = {}

export const HourlyPerformanceChart = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const getHourlyPerformanceChart = async () => {
      try {
        const response = await reportsApi.getPerformanceByDayAndHour()
        // TODO: Fix this response
        setData(response?.data || [])
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }

    getHourlyPerformanceChart()
  }, [])

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Gráfico del total de ventas</h2>
      </div>
      <Divider my="md" />
      <div className="pb-6 flex justify-center items-center h-full">
        {data.length > 0 ? (
          <Chart chartType="Calendar" width="100%" height="400px" data={data} options={options} />
        ) : (
          <div className="text-center flex flex-col justify-center h-full">
            <p className="text-secondary_text">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </Paper>
  )
}
