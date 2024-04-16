import React, { useEffect, useState } from "react"
import { Breadcrumbs } from "@mantine/core"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"

import BaseLayout from "../../components/BaseLayout"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"

import MenuTable from "../Menu/MenuTable"
import orderApi from "../../api/orderApi"
import { useSocket } from "../../hooks/useOrderSocket"

export default function OrdersScreen() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const orderSocket = useSocket()

  useEffect(() => {
    if (orderSocket) {
      orderSocket.on("orderUpdate", (order) => {
        refreshPage()
      })
      orderSocket.on("orderReady", (order) => {
        refreshPage()
      })

      return () => {
        orderSocket.off("orderUpdate")
        orderSocket.off("orderReady")
      }
    }
  }, [orderSocket])

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders()
      setOrders(response?.data)
      if (response.error) {
        toast.error(`Fallo al obtener los últimos pedidos. ${response.message}`, {
          duration: 7000
        })
      }
    } catch (e) {
      toast.error(`Fallo al obtener la información de las ordenes. Por favor intente de nuevo. ${e.message}`, {
        duration: 7000
      })
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const refreshPage = () => {
    fetchOrders()
  }

  // TODO
  const handleDisableSelected = async (cardsSelected) => {
    refreshPage()
  }
  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Pedidos</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        {orders && orders.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable
              refreshPage={refreshPage}
              items={orders}
              handleDisableSelected={handleDisableSelected}
              screenType="ordersScreen"
            />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin ordenes disponibles!</div>
        )}
      </section>
    </BaseLayout>
  )
}
