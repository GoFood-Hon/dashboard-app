import React, { useEffect, useState } from "react"
import { Chart } from "react-google-charts"
import reportsApi from "../../api/reportsApi"
import toast from "react-hot-toast"

export const options = {
  allowHtml: true,
  showRowNumber: true
}

export const formatters = [
  {
    type: "ArrowFormat",
    column: 1
  }
]

const transformData = (data) => {
  const result = [["ID", "Nombre del platillo", "Descripción", "Precio", "Rating", "Cantidad total"]]

  data?.forEach((item) => {
    const precio = parseFloat(item.price)
    result.push([item.id, item.name, item.description, precio.toFixed(2), item.ratingsCount, item.total_quantity])
  })

  return result
}

export const DishesTable = () => {
  const [data, setData] = useState()
  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await reportsApi.getProductSales()
        if (!response?.data) {
          return
        }
        const newData = transformData(response?.data)
        setData(newData)
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }

    getSales()
  }, [])

  return (
    <div className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-6">
        <h2 className="text-white-200 text-xl font-semibold">Lista de pedidos</h2>
      </div>
      <span className="border border-blue-100" />

      <div className="pb-6 flex justify-center items-center h-full">
        {data ? (
          <Chart chartType="Table" width="100%" height="400px" data={data} options={options} formatters={formatters} />
        ) : (
          <div className="text-center flex flex-col justify-center h-full">
            <p className="text-secondary_text">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
