import { useEffect } from "react"
import { useSocket } from "../hooks/useOrderSocket"
import { notifications } from "@mantine/notifications"
import { USER_ROLES } from "../utils/constants"
import { useSelector, useDispatch } from "react-redux"
import { fetchOrderDetails, setNewOrder, setNewOrderForAdmins, setOrderStatus } from "../store/features/ordersSlice"
import notificationSound from "../assets/sound/notificationSound.wav"
import { useNavigate, useLocation } from "react-router-dom"
import { ActionIcon, Button, Flex, Text } from "@mantine/core"
import { fetchReservationDetails, setNewReservation } from "../store/features/reservationsSlice"
import { IconX } from "@tabler/icons-react"

export const NotificationProvider = ({ children }) => {
  const user = useSelector((state) => state.user.value)
  const orderSocket = useSocket()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!orderSocket) return
    const audio = new Audio(notificationSound)
    const playSound = () => {
      audio.currentTime = 0
      audio.play().catch((err) => console.warn("No se pudo reproducir el sonido:", err))
    }

    const handleNewOrder = (order) => {
      playSound()
      notifications.show({
        id: order.id,
        title: (
          <Flex justify="space-between" align="center">
            <Text size="sm">Nueva orden</Text>
            <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(order.id)}>
              <IconX size="1.1rem" />
            </ActionIcon>
          </Flex>
        ),
        message: (
          <Flex direction="row" gap="sm" align="center" justify="space-between">
            <Text size="sm">
              El usuario {order?.Order?.User?.name}{" "}
              {order?.isWantedAsSoonAsItIsReady ? "realizó un pedido" : "programó un pedido"}{" "}
              {order?.serviceType === "delivery"
                ? "a domicilio"
                : order?.serviceType === "onSite"
                  ? "para venta en mesa"
                  : "para llevar"}
            </Text>
            <Button
              size="xs"
              variant="light"
              w="120px"
              color="green"
              onClick={() => {
                navigate(`/orders/${order.id}`)
                dispatch(fetchOrderDetails(order.id))
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
      dispatch(setNewOrderForAdmins(order))
    }

    const handleOrderReady = (order) => {
      if (user.role !== USER_ROLES.kitchen) return
      playSound()
      notifications.show({
        id: order.id,
        title: (
          <Flex justify="space-between" align="center">
            <Text size="sm">Orden actualizada</Text>
            <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(order.id)}>
              <IconX size="1.1rem" />
            </ActionIcon>
          </Flex>
        ),
        message: (
          <Flex direction="row" gap="sm" align="center" justify="space-between">
            <Text size="sm">El pedido se marcó como preparado</Text>
            <Button
              size="xs"
              variant="light"
              w="120px"
              color="green"
              onClick={() => {
                navigate(`/orders/${order.id}`)
                dispatch(fetchOrderDetails(order.id))
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
            title: "Orden actualizada",
            message: `El administrador de ${user.role === USER_ROLES.administrator ? "comercio" : "sucursal"} confirmó la orden`,
            autoClose: false,
            withCloseButton: true,
            color: "green"
          })
      user.role === USER_ROLES.kitchen && dispatch(setNewOrder(order))
      dispatch(setOrderStatus(order))
    }

    const handleOrderPickedUp = (order) => {
      const isCurrentOrderPage = location.pathname === `/orders/${order.id}`

      playSound()
      if (isCurrentOrderPage) {
        notifications.show({
          title: "Orden actualizada",
          message: "El repartidor recogió el pedido y va en camino a entregarlo",
          autoClose: false,
          color: "green",
          withCloseButton: true
        })
      } else {
        notifications.show({
          id: order.id,
          title: (
            <Flex justify="space-between" align="center">
              <Text size="sm">Orden actualizada</Text>
              <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(order.id)}>
                <IconX size="1.1rem" />
              </ActionIcon>
            </Flex>
          ),
          message: (
            <Flex direction="row" gap="sm" align="center" justify="space-between">
              <Text size="sm">El repartidor recogió el pedido y va en camino a entregarlo</Text>
              <Button
                size="xs"
                variant="light"
                w="120px"
                color="green"
                onClick={() => {
                  navigate(`/orders/${order.id}`)
                  dispatch(fetchOrderDetails(order.id))
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
      }
      dispatch(setOrderStatus(order))
    }

    const handleOrderDelivered = (order) => {
      const isCurrentOrderPage = location.pathname === `/orders/${order.id}`
      playSound()
      if (isCurrentOrderPage) {
        notifications.show({
          title: "Orden actualizada",
          message: "El repartidor marcó el pedido como entregado",
          autoClose: false,
          color: "green",
          withCloseButton: true
        })
      } else {
        notifications.show({
          id: order.id,
          title: (
            <Flex justify="space-between" align="center">
              <Text size="sm">Orden actualizada</Text>
              <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(order.id)}>
                <IconX size="1.1rem" />
              </ActionIcon>
            </Flex>
          ),
          message: (
            <Flex direction="row" gap="sm" align="center" justify="space-between">
              <Text size="sm">El repartidor marcó el pedido como entregado</Text>
              <Button
                size="xs"
                variant="light"
                w="120px"
                color="green"
                onClick={() => {
                  navigate(`/orders/${order.id}`)
                  dispatch(fetchOrderDetails(order.id))
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
      }
      dispatch(setOrderStatus(order))
    }

    const handleNewReservation = (reservation) => {
      playSound()
      notifications.show({
        id: reservation.id,
        title: (
          <Flex justify="space-between" align="center">
            <Text size="sm">Nueva reservación</Text>
            <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(reservation.id)}>
              <IconX size="1.1rem" />
            </ActionIcon>
          </Flex>
        ),
        message: (
          <Flex direction="row" gap="sm" align="center" justify="space-between">
            <Text size="sm">Se ha creado una nueva solicitud de reservación</Text>
            <Button
              size="xs"
              variant="light"
              w="125px"
              color="green"
              onClick={() => {
                navigate(`/reservations/${reservation.id}`)
                dispatch(fetchReservationDetails(reservation.id))
                notifications.hide(reservation.id)
              }}>
              Ver reservación
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
        color: "green"
      })
      dispatch(setNewReservation(reservation))
    }

    const handleReservationStatus = (reservation) => {
      if (location.pathname === `/reservations/${reservation.id}`) return
      playSound()
      notifications.show({
        id: reservation.id,
        title: (
          <Flex justify="space-between" align="center">
            <Text size="sm">Reservación actualizada</Text>
            <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(reservation.id)}>
              <IconX size="1.1rem" />
            </ActionIcon>
          </Flex>
        ),
        message: (
          <Flex direction="row" gap="sm" align="center" justify="space-between">
            <Text size="sm">Se cambió el estado de la reservación</Text>
            <Button
              size="xs"
              variant="light"
              w="125px"
              color="green"
              onClick={() => {
                navigate(`/reservations/${reservation.id}`)
                dispatch(fetchReservationDetails(reservation.id))
                notifications.hide(reservation.id)
              }}>
              Ver reservación
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
        color: "green"
      })
    }

    const handleReservationNewComment = (reservation) => {
      if (reservation?.comments[0]?.userType === "AdminUser") return
      playSound()
      notifications.show({
        id: reservation.id,
        title: (
          <Flex justify="space-between" align="center">
            <Text size="sm">Nuevo comentario</Text>
            <ActionIcon variant="subtle" c="dimmed" color="gray" onClick={() => notifications.hide(reservation.id)}>
              <IconX size="1.1rem" />
            </ActionIcon>
          </Flex>
        ),
        message: (
          <Flex direction="row" gap="sm" align="center" justify="space-between">
            <Text size="sm">Se agregó un nuevo comentario a la reservación</Text>
            <Button
              size="xs"
              variant="light"
              w="125px"
              color="green"
              onClick={() => {
                navigate(`/reservations/${reservation.id}`)
                dispatch(fetchReservationDetails(reservation.id))
                notifications.hide(reservation.id)
              }}>
              Ver reservación
            </Button>
          </Flex>
        ),
        autoClose: false,
        withCloseButton: false,
        color: "green"
      })
      dispatch(fetchReservationDetails(reservation?.id))
    }

    //Orders sockets
    orderSocket.on("newOrder", handleNewOrder)
    orderSocket.on("orderReady", handleOrderReady)
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
      orderSocket.off("orderUpdate", handleOrderUpdate)
      orderSocket.off("orderPickedUp", handleOrderPickedUp)
      orderSocket.off("orderDelivered", handleOrderDelivered)

      orderSocket.off("newTableReservation", handleNewReservation)
      orderSocket.off("tableReservationStatusUpdated", handleReservationStatus)
      orderSocket.off("tableReservationNewComment", handleReservationNewComment)
    }
  }, [orderSocket, user.role, location.pathname])

  return children
}
