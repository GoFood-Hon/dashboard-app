import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation } from "react-router-dom"

import MenuTable from "../Menu/MenuTable"
import orderApi from "../../api/orderApi"
import toast from "react-hot-toast"

export default function OrdersScreen() {
  const location = useLocation()
  const [orders, setOrders] = useState([])

  const handleDisableSelected = async (cardsSelected) => {
    /*  await Promise.all(
      cardsSelected.map(async (data) => {
        await dispatch(updateMenu({ data: { id: data, isActive: false }, propertyToUpdate: "isActive" }))
      })
    )
 */
    refreshPage()
  }

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders()
      setOrders(response?.data)
      if (response.error) {
        toast.error(`Fallo al obtener los últimos pedidos. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      }
    } catch (e) {
      toast.error(`Fallo al crear el cupón. Por favor intente de nuevo. ${e.message}`, {
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
