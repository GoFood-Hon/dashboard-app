import { useEffect } from "react"
import { useSocket } from "../hooks/useOrderSocket"
import { notifications } from "@mantine/notifications"
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
        message: `El usuario ${order?.Order?.User?.name} hizo un pedido ${order?.serviceType === "delivery" ? "a domicilio" : order?.serviceType === "onSite" ? "para comer en restaurante" : "para llevar"}`,
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      console.log(order)
      try {
        dispatch(setNewOrder(order))
      } catch (error) {
        console.error("Error al despachar la acción setNewOrder:", error)
      }
    }

    const handleOrderReady = (order) => {
      playSound()
      notifications.show({
        title: "Orden preparada",
        message: "El pedido se marcó como preparado desde cocina",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      dispatch(setOrderStatus(order))
    }

    const handleOrderUpdate = (order) => {
      playSound()
      user.role === USER_ROLES.kitchen
        ? notifications.show({
            title: "Nueva orden",
            message: "Se agregó un nuevo pedido a la lista de pedidos en curso",
            autoClose: false,
            withCloseButton: true,
            color: "green"
          })
        : notifications.show({
            title: "Orden confirmada",
            message: `El administrador de ${user.role === USER_ROLES.administrator ? "restaurante" : "sucursal"} confirmó la orden`,
            autoClose: false,
            withCloseButton: true,
            color: "green"
          })
      user.role === USER_ROLES.kitchen && dispatch(setNewOrder(order))
      dispatch(setOrderStatus(order))
    }

    const handleDriverAssigned = (order) => {
      playSound()
      notifications.show({
        title: "Conductor asignado",
        message: "Se asignó un conductor a la orden",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
      console.log(order)
      dispatch(setOrderStatus(order))
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
    orderSocket.on("orderDriverAssigned", handleDriverAssigned)
    orderSocket.on("orderPickedUp", handleOrderPickedUp)
    orderSocket.on("orderDelivered", handleOrderDelivered)
    orderSocket.on("orderUpdate", handleOrderUpdate)

    return () => {
      orderSocket.off("newOrder", handleNewOrder)
      orderSocket.off("orderReady", handleOrderReady)
      orderSocket.off("orderDriverAssigned", handleDriverAssigned)
      orderSocket.off("orderUpdate", handleOrderUpdate)
      orderSocket.off("orderPickedUp", handleOrderPickedUp)
      orderSocket.off("orderDelivered", handleOrderDelivered)
    }
  }, [orderSocket, user.role])

  return children
}
