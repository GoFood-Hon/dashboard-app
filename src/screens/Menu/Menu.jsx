import React from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Breadcrumbs } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES } from "../../routes"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import MenuTable from "./MenuTable"
import { Icon } from "../../components/Icon"

export default function Menu() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleDishes = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.path)
  }
  const handleComplements = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Complements.path)
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Menu</h1>
            <Button
              text={"Ver platillos"}
              className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
              onClick={handleDishes}
            />
            <Button
              text={"Ver complementos"}
              className={"text-white text-md px-3 py-2 bg-primary_button"}
              onClick={handleComplements}
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
          <MenuTable />
        </div>
      </section>
    </BaseLayout>
  )
}

/*
<div className="flex flex-row mr-4">
              <span className="text-sky-950 text-base font-bold leading-normal">{page === 1 ? 1 : (page - 1) * limit + 1}</span>
              <span className="text-zinc-500 text-base font-bold leading-normal">-</span>
              <span className="text-sky-950 text-base font-bold leading-normal">
                {page === 1 ? limit : Math.min(page * limit, totalItems)}
              </span>
              <span className="text-zinc-500 text-base font-medium leading-normal px-1"> de </span>
              <span className="text-sky-950 text-base font-bold leading-normal">{totalItems} platillos</span>
            </div>
*/
