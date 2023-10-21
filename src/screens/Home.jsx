import React from "react"
import BaseLayout from "../components/BaseLayout"
import Cards from "../components/Cards"
import { Icon } from "../components/Icon"
import NewOrders from "../components/NewOrders"

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

  const newOrders = [
    {
      restaurant: "kfc",
      orderNumber: "180A9DA3384B39CE",
      address: "14 calle, bo. san jorge",
      time: "10:20",
      date: "13 Julio 2024",
      status: "Confirmación"
    },
    {
      restaurant: "kfc",
      orderNumber: "180A9DA3384B39CE",
      address: "14 calle, bo. san jorge",
      time: "10:20",
      date: "13 Julio 2024",
      status: "En camino"
    },
    {
      restaurant: "kfc",
      orderNumber: "180A9DA3384B39CE",
      address: "14 calle, bo. san jorge",
      time: "10:20",
      date: "13 Julio 2024",
      status: "Cancelado"
    }
  ]
  return (
    <BaseLayout>
      <h1 className="text-white-200 text-2xl font-semibold pb-6">Dashboard</h1>
      <div className="flex flex-row flex-wrap gap-3 justify-between">
        {dashboardCards.map((item, key) => (
          <Cards data={item} key={key} />
        ))}
      </div>
      <div className="flex flex-row mt-6 w-full items-center">
        <div className="bg-white rounded-2xl shadow border border-blue-100 flex flex-col md:w-1/2 p-2 mr-3">
          <div className="flex flex-row justify-between items-center p-6 flex-wrap">
            <h2 className="text-white-200 text-xl font-semibold">Nuevos Pedidos</h2>
            <Icon icon="more" />
          </div>
          <span className="border border-blue-100" />
          <div className="pb-6">
            {newOrders.map((item, key) => (
              <NewOrders data={item} key={key} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow border border-blue-100 flex flex-col w-1/2 p-2 ml-3">
          <h2 className="text-white-200 text-xl font-semibold p-6">Platillos más comprados</h2>
          <span className="border border-blue-100" />
        </div>
      </div>
    </BaseLayout>
  )
}

export default Home
