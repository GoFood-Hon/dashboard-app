import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Affix, Breadcrumbs, Grid, Pagination } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"

export const AdminUserScreen = () => {
  const navigate = useNavigate()
  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }
  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Usuarios</h1>
            <Button
              text={"Crear nuevo usuario"}
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
    </BaseLayout>
  )
}
