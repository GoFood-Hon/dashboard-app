import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation } from "react-router-dom"
import OrdersTable from "./OrdersTable"
import MenuTable from "../Menu/MenuTable"

export default function OrdersScreen() {
  const location = useLocation()

  const refreshPage = () => {
    /*   dispatch(
      fetchMenus({
        restaurantId: user.restaurantId
      })
    )
    setCardsSelected([]) */
  }

  const handleDisableSelected = async (cardsSelected) => {
    /*  await Promise.all(
      cardsSelected.map(async (data) => {
        await dispatch(updateMenu({ data: { id: data, isActive: false }, propertyToUpdate: "isActive" }))
      })
    )
 */
    refreshPage()
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Pedidos</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        {orders && orders.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable
              refreshPage={refreshPage}
              items={orders}
              handleDisableSelected={handleDisableSelected}
              screenType="ordersScreen"
            />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin ordenes disponibles!</div>
        )}
      </section>
    </BaseLayout>
  )
}

const orders = [
  {
    id: 1,
    name: "Alfonso",
    phoneNumber: "+2323232",
    status: "Entregado",
    date: new Date(2020, 1, 2),
    type: "Domicilio",
    total: "233.31"
  },
  {
    id: 2,
    name: "Adrian",
    phoneNumber: "+2323232",
    status: "Entregado",
    date: new Date(2020, 1, 2),
    type: "Domicilio",
    total: "233.31"
  },
  {
    id: 3,
    name: "Antonio",
    phoneNumber: "+2323232",
    status: "Entregado",
    date: new Date(2020, 1, 2),
    type: "Domicilio",
    total: "233.31"
  }
]
