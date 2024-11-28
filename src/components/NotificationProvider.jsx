import React, { useEffect } from "react"
import { useSocket } from "../hooks/useOrderSocket"
import { notifications } from "@mantine/notifications"
import { IconCheck } from "@tabler/icons-react"
import { USER_ROLES } from "../utils/constants"
import { useSelector, useDispatch } from "react-redux"
import { setNewOrder, setOrderStatus } from "../store/features/ordersSlice"
import notificationSound from "../assets/sound/notificationSound.wav"

export const NotificationProvider = ({ children }) => {
  const user = useSelector((state) => state.user.value)
  const orderSocket = useSocket()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!orderSocket) return

    const audio = new Audio(notificationSound)

    const playSound = () => {
      audio.currentTime = 0
      audio.play().catch((error) => console.error("Error al reproducir sonido:", error))
    }

    const handleNewOrder = (order) => {
      playSound() 
      notifications.show({
        title: "Nueva orden",
        message: `Una nueva orden acaba de ser creada`,
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      dispatch(setNewOrder(order))
    }

    const handleOrderReady = (order) => {
      playSound()
      notifications.show({
        title: "Orden preparada",
        message: "El pedido se marcó como preparado desde cocina",
        icon: <IconCheck size={20} />,
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      dispatch(setOrderStatus(order))
    }

    const handleOrderUpdate = (order) => {
      playSound()
      notifications.show({
        title: "Nueva orden",
        message: "Se agregó un nuevo pedido a las órdenes en curso",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      dispatch(setOrderStatus(order))
      dispatch(setNewOrder(order))
    }

    const handleOrderPickedUp = (order) => {
      playSound()
      notifications.show({
        title: "Orden en camino",
        message: "El repartidor recogió el pedido y va en camino a entregarlo",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      console.log(order)
      dispatch(setOrderStatus(order))
    }

    const handleOrderDelivered = (order) => {
      playSound()
      notifications.show({
        title: "Orden entregada",
        message: "El repartidor marcó el pedido como entregado",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      console.log(order)
      dispatch(setOrderStatus(order))
    }

    orderSocket.on("newOrder", handleNewOrder)
    orderSocket.on("orderReady", handleOrderReady)
    orderSocket.on("orderPickedUp", handleOrderPickedUp)
    orderSocket.on("orderDelivered", handleOrderDelivered)

    if (user.role === USER_ROLES.kitchen) {
      orderSocket.on("orderUpdate", handleOrderUpdate)
    }

    return () => {
      orderSocket.off("newOrder", handleNewOrder)
      orderSocket.off("orderReady", handleOrderReady)
      orderSocket.off("orderUpdate", handleOrderUpdate)
      orderSocket.off("orderPickedUp", handleOrderPickedUp)
      orderSocket.off("orderDelivered", handleOrderDelivered)
    }
  }, [orderSocket, user.role])

  return children
}
