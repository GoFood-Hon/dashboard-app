import React from "react"
import BaseLayout from "../components/BaseLayout"
import Button from "../components/Button"
import { Breadcrumbs } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom"

export default function Menu() {
  const navigate = useNavigate()
  const breadcrumbItems = [
    { title: "Inicio", href: "/" },
    { title: "Menu", href: "/menu" }
  ].map((item, index) => (
    <Link to={item.href} key={index}>
      {item.title}
    </Link>
  ))

  const handleDishes = () => {
    navigate("/menu/dishes")
  }
  const handleComplements = () => {
    navigate("/menu/complements")
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
            <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}
