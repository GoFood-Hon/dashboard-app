import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Affix, Breadcrumbs, Grid, Pagination } from "@mantine/core"

import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"

export const AdminUserScreen = () => {
  const navigate = useNavigate()
  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }

  const [adminUsers, setAdminUsers] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await userApi.getAdminUsers()

      if (response.error) {
        toast.error("Error obteniendo la información de los usuarios")
      } else if (response.status === "success") {
        setAdminUsers(response.data)
      }
    } catch (e) {
      toast.error("Fallo obtener los datos del usuario", e)
    }
  }

  const refreshPage = () => {
    fetchData()
  }
  const handleDisableSelected = async (id) => {
    try {
      const response = await userApi.deleteAdminUser(id)

      if (response.status === 204) {
        toast.success("Usuario eliminado!")
        refreshPage()
      } else {
        toast.error("Fallo al eliminar el administrador")
      }
    } catch (e) {
      toast.error("Fallo obtener los datos del usuario", e)
    }
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Administradores</h1>
            <Button
              text={"Crear nuevo administrador"}
              className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
              onClick={handleNewItem}
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
        {adminUsers && adminUsers.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable
              refreshPage={refreshPage}
              items={adminUsers}
              handleDisableSelected={handleDisableSelected}
              screenType="adminUserScreen"
            />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin administradores disponibles!</div>
        )}
      </section>
    </BaseLayout>
  )
}
