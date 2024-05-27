import React, { useEffect, useState } from "react"
import { Chart } from "react-google-charts"
import toast from "react-hot-toast"
import reportsApi from "../../api/reportsApi"

export const data = [
  ["Horas del dia", "Series 1", "Series 2"],
  ["00:00", 100, 30],
  ["01:00", 130, 20],
  ["04:00", 170, 20],
  ["07:00", 180, 20],
  ["10:00", 140, 40],
  ["12:00", 180, 20]
]

export const options = {
  hAxis: { title: "Horas del día", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 }
  // chartArea: { width: "60%" }
}

export const OrderAmountChart = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const getOrderAmountChart = async () => {
      try {
        const response = await reportsApi.getOrdersByChannel()
        // TODO: Fix this response
        setData(response?.data || [])
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }

    getOrderAmountChart()
  }, [])

  return (
    <div className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-6">
        <h2 className="text-white-200 text-xl font-semibold">
          Cantidad de pedidos generados por dia en sus diferentes canales de entrega
        </h2>
      </div>
      <span className="border border-blue-100" />

      <div className="pb-6 flex justify-center items-center h-full">
        {data.length > 0 ? (
          <Chart chartType="AreaChart" width="100%" height="400px" data={data} options={options} />
        ) : (
          <div className="text-center flex flex-col justify-center h-full">
            <p className="text-secondary_text">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
