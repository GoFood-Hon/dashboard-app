import React from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Breadcrumbs, Text } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import MenuTable from "../Menu/MenuTable"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

export default function Users() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const users = [
    {
      id: "3f24d92a-23bc-49a7-8b94-f17f0f3e78a4",
      name: "Geovany",
      email: "marlon@gofood.com",
      phoneNumber: "+504 9923 2793",
      createdAt: new Date("2023-12-03T19:28:41.812Z"),
      isActive: true,
      purchases: 200,
      image: "https://api.dicebear.com/7.x/micah/svg?backgroundColor=b6e3f4"
    },
    {
      id: "3f224d92a-23bc-49a7-8b94-f17f0f3e78a4",
      name: "GeovanyCast",
      email: "marlon@gofood.com",
      phoneNumber: "+504 9923 2793",
      createdAt: new Date("2023-11-03T19:28:41.812Z"),
      isActive: true,
      purchases: 200,
      image: "https://api.dicebear.com/2.x/micah/svg?backgroundColor=b6e3f4"
    },
    {
      id: "3f24d92a-23bc-49a7-8b94-f17f0f3e7824",
      name: "Castro Mejia",
      email: "marlon@gofood.com",
      phoneNumber: "+504 9923 2793",
      createdAt: new Date("2023-12-03T19:21:21.832Z"),
      isActive: true,
      purchases: 150,
      image: "https://placehold.co/600x400?text=Imagen+no+disponible"
    }
  ]

  const handleDishes = () => {}
  const refreshPage = () => {}
  const handleDisableSelected = () => {}

  const tableConfig = {
    headers: ["ID", "Usuario", "Correo", "Teléfono", "Fecha", "Estado", "Compras", "Acciones"]
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Usuarios</h1>

            <Button
              text={"Crear cajero"}
              className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
              onClick={handleDishes}
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
              tableConfig={tableConfig}
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
