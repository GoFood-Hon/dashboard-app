import React from "react"
import BaseLayout from "../components/BaseLayout"
import Cards from "../components/Cards"

function Home() {
  const dashboardCards = [
    {
      icon: "money",
      amount: 3500212.0,
      label: "Ventas totales",
      percentage: 0.43
    },
    {
      icon: "money",
      amount: 500212.0,
      label: "Total mes",
      percentage: 2.59
    },
    {
      icon: "bag",
      amount: 1000,
      label: "Total pedidos",
      percentage: 4.43
    },
    {
      icon: "users",
      amount: 3456,
      label: "Nuevos usuarios",
      percentage: -0.95
    }
  ]
  return (
    <BaseLayout>
      <div className="text-white-200 text-2xl font-semibold pb-6">Dashboard</div>
      <div className="flex flex-row flex-wrap gap-3 justify-between">
        {dashboardCards.map((item, key) => (
          <Cards data={item} key={key} />
        ))}
      </div>
    </BaseLayout>
  )
}

export default Home
