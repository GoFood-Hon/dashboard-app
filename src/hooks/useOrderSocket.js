import { useState, useEffect } from "react"
import { io } from "socket.io-client"

import { useSelector } from "react-redux"
import { APP_ROLES } from "../utils/constants"
import { API_URL } from "../services/env"

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const user = useSelector((state) => state.user.value)

  useEffect(() => {
    if (!user) return

    let url
    switch (user.role) {
      case APP_ROLES.restaurantAdmin:
        url = `${API_URL}admin-restaurant?restaurantId=${user.restaurantId}`
        break
      case APP_ROLES.kitchenUser:
        url = `${API_URL}kitchen?sucursalId=${user.sucursalId}`
        break
      case APP_ROLES.branchAdmin:
        url = `${API_URL}admin-sucursal?sucursalId=${user.sucursalId}`
        break
      case APP_ROLES.cashierUser:
        url = `${API_URL}admin-sucursal?sucursalId=${user.sucursalId}`
        break
      default:
        return
    }

    const newSocket = io(url)
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  return socket
}
