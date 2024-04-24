import React, { useEffect, useState } from "react"
import { Breadcrumbs } from "@mantine/core"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"

import BaseLayout from "../../components/BaseLayout"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"

import MenuTable from "../Menu/MenuTable"
import orderApi from "../../api/orderApi"
import BackButton from "../Dishes/components/BackButton"
import { useSelector } from "react-redux"
import LoadingCircle from "../../components/LoadingCircle"

export const OrderHistory = () => {
  const location = useLocation()
  const user = useSelector((state) => state.user.value)

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await orderApi.getKitchenOrders()
      if (response.error) {
        toast.error(`Fallo al obtener el historial pedidos. ${response.message}`, {
          duration: 7000
        })
      } else {
        setOrders(response?.data)
      }
    } catch (e) {
      toast.error(`Fallo al obtener el historial de las ordenes. Por favor intente de nuevo. ${e.message}`, {
        duration: 7000
      })
    } finally {
      setIsLoading(false)
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
            <BackButton title="Historial de Pedidos" />
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingCircle />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable refreshPage={refreshPage} items={orders} screenType="orderHistoryScreen" />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin historial de ordenes disponibles!</div>
        )}
      </section>
    </BaseLayout>
  )
}
