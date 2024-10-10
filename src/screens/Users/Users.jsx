import React, { useEffect, useState } from "react"
import { Paper, Button } from "@mantine/core"
import MenuTable from "../Menu/MenuTable"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import userApi from "../../api/userApi"
import { useSelector } from "react-redux"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"

export default function Users() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [isLoading, setIsLoading] = useState(false)

  const [users, setUser] = useState([])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await userApi.getUsersByRestaurant(user.restaurantId)
      if (response.error) {
        if (response.message === "jwt expired") {
          return navigate("/iniciarSesión")
        }
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        setUser(response.data)
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const refreshPage = () => {
    fetchUsers()
  }

  const handleNavigateNewUser = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.NewUser.path)
  }
  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <h1 className="text-white-200 text-2xl font-semibold">Usuarios</h1>
          <Button color={colors.main_app_color} onClick={handleNavigateNewUser}>
            Nuevo
          </Button>
        </div>
      </section>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable refreshPage={refreshPage} items={users} screenType="usersScreen" loadingData={isLoading} />
        </Paper>
      </section>
    </>
  )
}
