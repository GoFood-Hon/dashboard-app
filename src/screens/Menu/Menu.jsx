import React, { useEffect, useState } from "react"
import { Breadcrumbs } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import MenuTable from "./MenuTable"
import { fetchMenus, selectAllMenus, updateMenu, selectMenusStatus, selectMenusError } from "../../store/features/menuSlice"
import { APP_ROLES } from "../../utils/constants"
import BackButton from "../Dishes/components/BackButton"

export default function Menu() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const menus = useSelector(selectAllMenus)
  const status = useSelector(selectMenusStatus)
  const error = useSelector(selectMenusError)
  const page = useSelector((state) => state.menus.currentPage)
  const user = useSelector((state) => state.user.value)
  const restaurant = useSelector((state) => state?.restaurant?.value)

  const [cardsSelected, setCardsSelected] = useState([])

  const handleDishes = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
  }
  const handleComplements = () => {
    // navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Complements.path)
  }
  const handleNewMenu = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.NewMenu.path)
  }

  //* Fetch menu data *//

  useEffect(() => {
    if (user?.restaurantId) {
      dispatch(fetchMenus({ restaurantId: user.restaurantId }))
    }
    setCardsSelected([])
  }, [page, dispatch, user])

  const refreshPage = () => {
    dispatch(
      fetchMenus({
        restaurantId: user.restaurantId
      })
    )
    setCardsSelected([])
  }

  //* disable menu data *//

  const handleDisableSelected = async (cardsSelected) => {
    await Promise.all(
      cardsSelected.map(async (data) => {
        await dispatch(updateMenu({ data: { id: data, isActive: false }, propertyToUpdate: "isActive" }))
      })
    )

    refreshPage()
  }

  //* enable menu data *//

  const handleEnableSelected = async (cardsSelected) => {
    await Promise.all(
      cardsSelected.map(async (id) => {
        await dispatch(updateDish({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
      })
    )

    refreshPage()
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title="Menús" />
          <div className="flex flex-row gap-x-3 items-center justify-between">
            <Button
              text="Nuevo"
              className={`text-white text-md px-3 py-2 bg-primary_button ${user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? "" : "hidden"}`}
              onClick={handleNewMenu}
            />
            <Button
              text={"Ver platillos"}
              className={`text-white text-md px-3 py-2 bg-primary_button mb-0 ${user.role !== APP_ROLES.branchAdmin || user.role !== APP_ROLES.cashierUser ? "" : "hidden"}`}
              onClick={handleDishes}
            />
            {/*   <Button
                  text={"Ver complementos"}
                  className={"text-white text-md px-3 py-2 bg-primary_button"}
                  onClick={handleComplements}
                /> */}
          </div>
        </div>
      </section>
      <section>
        {status === "loading" && <div className="text-center mt-4 text-gray-500">Cargando menús...</div>}
        {status === "failed" && <div className="text-center mt-4 text-gray-500">Error: {error}</div>}
        {menus && menus.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable
              refreshPage={refreshPage}
              items={menus.map((menu) => {
                return { ...menu, dishesCount: menu?.Dishes?.length }
              })}
              handleDisableSelected={handleDisableSelected}
              screenType="menuScreen"
            />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">No tienes menús creados</div>
        )}
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
