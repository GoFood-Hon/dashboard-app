import React, { useEffect, useState } from "react"
import Button from "../../components/Button"
import { Text } from "@mantine/core"
import MenuTable from "../Menu/MenuTable"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import userApi from "../../api/userApi"
import { useSelector } from "react-redux"
import { showNotification } from "@mantine/notifications"

export default function Users() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((state) => state.user.value)

  const [users, setUser] = useState([])

  const fetchUsers = async () => {
    try {
      const response = await userApi.getUsersByRestaurant(user.restaurantId)
      if (response.error) {
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
          <Button
            text={"Nuevo"}
            className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
            onClick={handleNavigateNewUser}
          />
        </div>
      </section>
      <section>
        <div className="w-full p-4 h-full rounded-md">
          {users.length > 0 ? (
            <MenuTable refreshPage={refreshPage} items={users} screenType="usersScreen" />
          ) : (
            <div className="w-full h-screen flex justify-center items-center">
              <Text className="font-semibold" size="sm" c="dimmed" inline>
                Sin usuarios disponibles
              </Text>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
