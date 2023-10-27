import React from "react"
import BaseLayout from "../components/BaseLayout"
import { Breadcrumbs } from "@mantine/core"
import { Link, useLocation } from "react-router-dom"
import BreadCrumbNavigation from "../components/BreadCrumbNavigation"

export default function Complements() {
  const location = useLocation()
  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Complementos</h1>
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
