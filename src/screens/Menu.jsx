import React from "react"
import BaseLayout from "../components/BaseLayout"
import Button from "../components/Button"
import { Breadcrumbs } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES } from "../routes"
import BreadCrumbNavigation from "../components/BreadCrumbNavigation"

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
    </BaseLayout>
  )
}
