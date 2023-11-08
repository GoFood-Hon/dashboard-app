import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation } from "react-router-dom"
import OrdersTable from "./OrdersTable"

export default function OrdersScreen() {
  const location = useLocation()

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
        <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
          <OrdersTable />
        </div>
      </section>
    </BaseLayout>
  )
}
