import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import MenuTable from "../Menu/MenuTable"
import orderApi from "../../api/orderApi"
import BackButton from "../Dishes/components/BackButton"
import LoadingCircle from "../../components/LoadingCircle"
import { showNotification } from "@mantine/notifications"

export default function OrdersScreen() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)

      const response = await orderApi.getAllOrders()
      console.log(response)
      setOrders(response?.data)
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
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
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <BackButton title="Pedidos" />
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
            <MenuTable refreshPage={refreshPage} items={orders} screenType="ordersScreen" />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">Aún no tienes ningún pedido</div>
        )}
      </section>
    </>
  )
}
