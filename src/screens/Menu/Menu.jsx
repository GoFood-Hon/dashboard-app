import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Breadcrumbs, Checkbox } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES } from "../../routes"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import MenuTable from "./MenuTable"

import { useDispatch, useSelector } from "react-redux"
import { fetchMenus, selectAllMenus, selectMenusError, selectMenusStatus, updateMenu } from "../../store/features/menuSlice"
import LoadingCircle from "../../components/LoadingCircle"

export default function Menu() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const menus = useSelector(selectAllMenus)
  const status = useSelector(selectMenusStatus)
  const error = useSelector(selectMenusError)
  const limit = useSelector((state) => state.menus.itemsPerPage)
  const totalItems = useSelector((state) => state.menus.totalItems)
  const filters = useSelector((state) => state.menus.filters)
  const page = useSelector((state) => state.menus.currentPage)

  const restaurant = useSelector((state) => state.restaurant.value)

  const totalControlBtn = Math.ceil(totalItems / limit)
  const [cardsSelected, setCardsSelected] = useState([])

  const handleDishes = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.path)
  }
  const handleComplements = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Complements.path)
  }
  const handleNewMenu = () => {
    navigate(NAVIGATION_ROUTES.Menu.NewMenu.path)
  }

  //* Fetch menu data *//

  useEffect(() => {
    dispatch(
      fetchMenus({
        restaurantId: restaurant.id
      })
    )

    setCardsSelected([])
  }, [page, dispatch, restaurant])

  const refreshPage = () => {
    dispatch(
      fetchMenus({
        restaurantId: restaurant.id
      })
    )
    setCardsSelected([])
  }

  //* disable menu data *//

  const handleDisableSelected = async (cardsSelected) => {
    await Promise.all(
      cardsSelected.map(async (id) => {
        await dispatch(updateMenu({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
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
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Menu</h1>
            <Button text={"Nuevo Menu"} className={"text-white text-md px-3 py-2 bg-primary_button"} onClick={handleNewMenu} />

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
          {menus?.length > 0 ? (
            <MenuTable
              refreshPage={refreshPage}
              items={menus}
              handleDisableSelected={handleDisableSelected}
              screenType="menuScreen"
            />
          ) : (
            <div className="w-full h-screen flex justify-center items-center">
              <LoadingCircle />
            </div>
          )}
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
