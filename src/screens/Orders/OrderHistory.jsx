import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import MenuTable from "../Menu/MenuTable"
import orderApi from "../../api/orderApi"
import BackButton from "../Dishes/components/BackButton"
import { useSelector } from "react-redux"
import LoadingCircle from "../../components/LoadingCircle"
import { showNotification } from "@mantine/notifications"

export const OrderHistory = () => {
  const user = useSelector((state) => state.user.value)

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await orderApi.getKitchenOrders()
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        setOrders(response?.data)
      }
    } catch (e) {
      showNotification({
        title: "Error",
        message: e.message,
        color: "red",
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
