import React from "react"

import { Chart } from "react-google-charts"

export const data = [
  ["Year", "Sales", "Expenses", "Profit"],
  ["2014", 1000, 400, 200],
  ["2015", 1170, 460, 250],
  ["2016", 660, 1120, 300],
  ["2017", 1030, 540, 350]
]

export const options = {}

export const TopProductsSales = () => {
  return (
    <div className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-6">
        <h2 className="text-white-200 text-xl font-semibold">Ranking de productos mas vendidos</h2>
      </div>
      <span className="border border-blue-100" />
      <div className="pb-6 flex justify-center items-center">
        <Chart chartType="Bar" width="100%" height="400px" data={data} options={options} />
      </div>
    </div>
  )
}
