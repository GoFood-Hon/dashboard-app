import React, { useEffect, useState } from "react"
import { Chart } from "react-google-charts"
import reportsApi from "../../api/reportsApi"
import toast from "react-hot-toast"

export const PopularFoodChart = () => {
  const [dishes, setDishes] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await reportsApi.getTopSellingDishes()

        const formattedData = response?.data?.map((item) => [item?.name, parseInt(item.cantidad_vendidas)])
        setDishes(formattedData)
      } catch (error) {
        toast.error("Error al obtener los platillos favoritos")
      }
    })()
  }, [])

  const options = {
    title: "Platillos favoritos",
    pieHole: 0.5,
    is3D: false
  }

  return (
    <div className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-6">
        <h2 className="text-white-200 text-xl font-semibold">Top platillos vendidos</h2>
      </div>
      <span className="border border-blue-100" />
      <div className="pb-6 flex justify-center items-center">
        <Chart chartType="PieChart" width="100%" height="400px" data={[["Dishes", "Amount"], ...dishes]} options={options} />
      </div>
    </div>
  )
}
