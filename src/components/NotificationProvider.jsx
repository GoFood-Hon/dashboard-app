import React, { useEffect } from "react"
import { useSocket } from "../hooks/useOrderSocket"
import { notifications } from "@mantine/notifications"
import { colors } from "../theme/colors"
import { IconCheck } from "@tabler/icons-react"
import { USER_ROLES } from "../utils/constants"
import { useSelector } from "react-redux"

export const NotificationProvider = ({ children }) => {
  const user = useSelector((state) => state.user.value)
  const orderSocket = useSocket()

  useEffect(() => {
    if (!orderSocket) return

    const handleNewOrder = (order) => {
      notifications.show({
        title: "Nueva orden recibida!",
        message: `Numero de orden: ${order.id}`,
        autoClose: false,
        withCloseButton: true,
        color: "green",
        style: { backgroundColor: colors.light_bg_child, border: "2px solid #e2e8f0" }
      })
    }

    const handleOrderReady = (order) => {
      notifications.show({
        title: "Orden lista",
        message: `Numero de orden: ${order.id}`,
        icon: <IconCheck icon="arrowRight" size={20} />,
        autoClose: false,
        withCloseButton: true,
        color: "green",
        style: { backgroundColor: colors.light_bg_child, border: "2px solid #e2e8f0" }
      })
    }
    const handleOrderUpdate = (order) => {
      notifications.show({
        title: "Nueva orden!",
        message: `Numero de orden: ${order.id}`,
        autoClose: false,
        withCloseButton: true,
        color: "indigo",
        style: { backgroundColor: colors.light_bg_child, border: "2px solid #e2e8f0" }
      })
    }

    orderSocket.on("newOrder", handleNewOrder)
    orderSocket.on("orderReady", handleOrderReady)

    if (user.role === USER_ROLES.kitchen) {
      orderSocket.on("orderUpdate", handleOrderUpdate)
    }

    return () => {
      orderSocket.off("newOrder", handleNewOrder)
      orderSocket.off("orderReady", handleOrderReady)
      orderSocket.off("orderUpdate", handleOrderUpdate)
    }
  }, [orderSocket, user.role])

  return children
}
