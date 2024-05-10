import React from "react"
import { Chart } from "react-google-charts"

export const data = [
  ["Numero de ordenes", "Nombre del cliente", "Dirección", "Hora de entrega", "Cantidad", "Precio", "Total"],
  ["12", "Juan", "Calle 1", "10:20", "2", "20.00", "40.00"],
  ["242", "Ana del Carmen", "Calle 1", "10:20", "2", "20.00", "40.00"],
  ["35", "Pedro Alvarez", "Calle 1", "10:20", "2", "20.00", "40.00"],
  ["453", "Joaquin Fernandez", "Calle 1", "10:20", "2", "20.00", "40.00"],
  ["53", "Carlos Valdez", "Calle 1", "10:20", "2", "20.00", "40.00"],
  ["612", "Francisco E Espinoza", "Calle 1", "10:20", "2", "20.00", "40.00"],
  ["73", "Polo Weiss", "Calle 1", "10:20", "2", "20.00", "40.00"]
]

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
export const DishesTable = () => {
  return (
    <div className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-6">
        <h2 className="text-white-200 text-xl font-semibold">Lista de pedidos</h2>
      </div>
      <span className="border border-blue-100" />
      <div className="pb-6 flex justify-center items-center">
        <Chart chartType="Table" width="100%" height="400px" data={data} options={options} formatters={formatters} />
      </div>
    </div>
  )
}
