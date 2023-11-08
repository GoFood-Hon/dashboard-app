import React from "react"
import BaseLayout from "../components/BaseLayout"
import DashboardCard from "../components/DashboardCard"
import { Icon } from "../components/Icon"
import NewOrders from "../components/NewOrders"
import { Grid } from "@mantine/core"

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
      address: "15 calle, bo. san jorge",
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
      <Grid grow>
        {dashboardCards.map((item, key) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={key}>
            <DashboardCard gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }} data={item} />
          </Grid.Col>
        ))}
      </Grid>
      <Grid grow className="mt-6">
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <div className="bg-white rounded-2xl shadow border border-blue-100 flex flex-col w-full p-2 mr-6">
            <div className="flex flex-row justify-between items-center p-6 flex-wrap">
              <h2 className="text-white-200 text-xl font-semibold">Nuevos Pedidos</h2>
              <Icon icon="more" size={20} />
            </div>
            <span className="border border-blue-100" />
            <div className="pb-6">
              {newOrders.map((item, key) => (
                <NewOrders data={item} key={key} />
              ))}
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <div className="bg-white rounded-2xl shadow border border-blue-100 flex flex-col w-full p-2">
            <div className="flex flex-row justify-between items-center p-6 flex-wrap">
              <h2 className="text-white-200 text-xl font-semibold">Platillos mas comprados</h2>
              <Icon icon="more" size={20} />
            </div>
            <span className="border border-blue-100" />
            <div className="pb-6">
              {newOrders.map((item, key) => (
                <NewOrders data={item} key={key} />
              ))}
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <div className="bg-white rounded-2xl shadow border border-blue-100 flex flex-col w-full p-2 mr-6">
            <div className="flex flex-row justify-between items-center p-6 flex-wrap">
              <h2 className="text-white-200 text-xl font-semibold">Total ingresos</h2>
              <Icon icon="more" size={20} />
            </div>
            <span className="border border-blue-100" />
            <div className="pb-6">
              {newOrders.map((item, key) => (
                <NewOrders data={item} key={key} />
              ))}
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <div className="bg-white rounded-2xl shadow border border-blue-100 flex flex-col w-full p-2">
            <div className="flex flex-row justify-between items-center p-6 flex-wrap">
              <h2 className="text-white-200 text-xl font-semibold">Usuarios</h2>
              <Icon icon="more" size={20} />
            </div>
            <span className="border border-blue-100" />
            <div className="pb-6">
              {newOrders.map((item, key) => (
                <NewOrders data={item} key={key} />
              ))}
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </BaseLayout>
  )
}

export default Home
