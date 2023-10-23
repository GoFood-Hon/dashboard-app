import React from "react"
import BaseLayout from "../components/BaseLayout"
import { Breadcrumbs } from "@mantine/core"
import { Link } from "react-router-dom"

export default function Complements() {
  const breadcrumbItems = [
    { title: "Inicio", href: "/" },
    { title: "Menu", href: "/menu" },
    { title: "Complementos", href: "/menu/complements" }
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
            <h1 className="text-white-200 text-2xl font-semibold">Complementos</h1>
          </div>
          <div>
            <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}
