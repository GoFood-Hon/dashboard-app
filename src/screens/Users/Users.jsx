import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Breadcrumbs, Text } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import MenuTable from "../Menu/MenuTable"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES } from "../../routes"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"
import { useSelector } from "react-redux"

export default function Users() {
  const navigate = useNavigate()
  const location = useLocation()
  const restaurant = useSelector((state) => state.restaurant.value)

  const [users, setUser] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getUsersByRestaurant(restaurant.id)
        if (response.error) {
          toast.error("Error obteniendo la información de los usuarios")
        } else {
          setUser(response.data)
        }
      } catch (error) {
        toast.error("Fallo obtener los datos del usuario")
      }
    }
    fetchUsers()
  }, [])

  const refreshPage = () => {}
  const handleDisableSelected = () => {}

  const handleNavigateNewUser = () => {
    navigate(NAVIGATION_ROUTES.Users.NewUser.path)
  }
  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Usuarios</h1>

            <Button
              text={"Crear usuario"}
              className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
              onClick={handleNavigateNewUser}
            />
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
          {users.length > 0 ? (
            <MenuTable
              refreshPage={refreshPage}
              items={users}
              handleDisableSelected={handleDisableSelected}
              screenType="usersScreen"
            />
          ) : (
            <div className="w-full h-screen flex justify-center items-center">
              <Text className="font-semibold" size="sm" c="dimmed" inline>
                Sin usuarios disponibles
              </Text>
            </div>
          )}
        </div>
      </section>
    </BaseLayout>
  )
}
