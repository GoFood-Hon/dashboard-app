import { useEffect } from "react"
import { useSocket } from "../hooks/useOrderSocket"
import { notifications } from "@mantine/notifications"
import { USER_ROLES } from "../utils/constants"
import { useSelector, useDispatch } from "react-redux"
import { setNewOrder, setOrderStatus } from "../store/features/ordersSlice"
import notificationSound from "../assets/sound/notificationSound.wav"
import { useNavigate } from "react-router-dom"
import { Button, Flex, Text } from "@mantine/core"

export const NotificationProvider = ({ children }) => {
  const user = useSelector((state) => state.user.value)
  const orderSocket = useSocket()
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
        id: order.id,
        title: "Nueva orden",
        message: (
          <Flex direction="row" align="center" justify="space-between">
            <Text size="sm">
              El usuario {order?.Order?.User?.name} hizo un pedido{" "}
              {order?.serviceType === "delivery"
                ? "a domicilio"
                : order?.serviceType === "onSite"
                  ? "para comer en restaurante"
                  : "para llevar"}
            </Text>
            <Button
              size="xs"
              variant="light"
              w="120px"
              color="green"
              onClick={() => {
                navigate(`/orders/${order.id}`)
                notifications.hide(order.id)
              }}>
              Ver pedido
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
        color: "green"
      })
      try {
        dispatch(setNewOrder(order))
      } catch (error) {
        console.error("Error al despachar la acción setNewOrder:", error)
      }
    }

    const handleOrderReady = (order) => {
      playSound()
      notifications.show({
        id: order.id,
        title: "Nueva orden",
        message: (
          <Flex direction="row" align="center" justify="space-between">
            <Text size="sm">El pedido se marcó como preparado desde cocina</Text>
            <Button
              size="xs"
              variant="light"
              w="120px"
              color="green"
              onClick={() => {
                navigate(`/orders/${order.id}`)
                notifications.hide(order.id)
              }}>
              Ver pedido
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
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
            autoClose: true,
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
        autoClose: true,
        withCloseButton: true,
        color: "green"
      })
      dispatch(setOrderStatus(order))
    }

    const handleOrderPickedUp = (order) => {
      playSound()
      notifications.show({
        id: order.id,
        title: "Nueva orden",
        message: (
          <Flex direction="row" align="center" justify="space-between">
            <Text size="sm">El repartidor recogió el pedido y va en camino a entregarlo</Text>
            <Button
              size="xs"
              variant="light"
              w="120px"
              color="green"
              onClick={() => {
                navigate(`/orders/${order.id}`)
                notifications.hide(order.id)
              }}>
              Ver pedido
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
        color: "green"
      })
      dispatch(setOrderStatus(order))
    }

    const handleOrderDelivered = (order) => {
      playSound()
      notifications.show({
        id: order.id,
        title: "Nueva orden",
        message: (
          <Flex direction="row" align="center" justify="space-between">
            <Text size="sm">El repartidor marcó el pedido como entregado</Text>
            <Button
              size="xs"
              variant="light"
              w="120px"
              color="green"
              onClick={() => {
                navigate(`/orders/${order.id}`)
                notifications.hide(order.id)
              }}>
              Ver pedido
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
        color: "green"
      })
      dispatch(setOrderStatus(order))
    }

    const handleNewReservation = (reservation) => {
      playSound()
      notifications.show({
        title: "Solicitud de reservación",
        message: "Se ha creado una nueva solicitud de reservación",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
    }

    const handleReservationStatus = (reservation) => {
      playSound()
      notifications.show({
        title: "Reservación actualizada",
        message: "Se cambió el estado de la reservación",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
    }

    const handleReservationNewComment = (reservation) => {
      playSound()
      notifications.show({
        title: "Reservación actualizada",
        message: "Se cambió el estado de la reservación",
        autoClose: false,
        withCloseButton: true,
        color: "green"
      })
    }

    //Orders sockets
    orderSocket.on("newOrder", handleNewOrder)
    orderSocket.on("orderReady", handleOrderReady)
    orderSocket.on("orderDriverAssigned", handleDriverAssigned)
    orderSocket.on("orderPickedUp", handleOrderPickedUp)
    orderSocket.on("orderDelivered", handleOrderDelivered)
    orderSocket.on("orderUpdate", handleOrderUpdate)

    //Reservations sockets
    orderSocket.on("newTableReservation", handleNewReservation)
    orderSocket.on("tableReservationStatusUpdated", handleReservationStatus)
    orderSocket.on("tableReservationNewComment", handleReservationNewComment)

    return () => {
      orderSocket.off("newOrder", handleNewOrder)
      orderSocket.off("orderReady", handleOrderReady)
      orderSocket.off("orderDriverAssigned", handleDriverAssigned)
      orderSocket.off("orderUpdate", handleOrderUpdate)
      orderSocket.off("orderPickedUp", handleOrderPickedUp)
      orderSocket.off("orderDelivered", handleOrderDelivered)

      orderSocket.off("newTableReservation", handleNewReservation)
      orderSocket.off("tableReservationStatusUpdated", handleReservationStatus)
      orderSocket.off("tableReservationNewComment", handleReservationNewComment)
    }
  }, [orderSocket, user.role])

  return children
}
