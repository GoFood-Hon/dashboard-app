import React from "react"
import BaseLayout from "../components/BaseLayout"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { Breadcrumbs } from "@mantine/core"

export default function NewDish() {
  const breadcrumbItems = [
    { title: "Inicio", href: "/" },
    { title: "Menu", href: "/menu" },
    { title: "Platillos", href: "/menu/dishes" },
    { title: "Nuevo platillo", href: "/menu/dishes/newDish" }
  ].map((item, index) => (
    <Link to={item.href} key={index}>
      {item.title}
    </Link>
  ))
  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Nuevo Platillo</h1>
          </div>
          <div>
            <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}
