import React, { useEffect, useState } from "react"
import { Button, Paper } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import MenuTable from "./MenuTable"
import { fetchMenus, selectAllMenus, updateMenu, selectMenusStatus, selectMenusError } from "../../store/features/menuSlice"
import { APP_ROLES } from "../../utils/constants"
import BackButton from "../Dishes/components/BackButton"
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton"
import { colors } from "../../theme/colors"

export default function Menu() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const menus = useSelector(selectAllMenus)
  const status = useSelector(selectMenusStatus)
  const error = useSelector(selectMenusError)
  const page = useSelector((state) => state.menus.currentPage)
  const limit = useSelector((state) => state.restaurants.itemsPerPage)
  const totalItems = useSelector((state) => state.restaurants.totalItems)
  const user = useSelector((state) => state.user.value)
  const restaurant = useSelector((state) => state?.restaurant?.value)
  const isLoading = useSelector((state) => state.menus.isLoading)

  const [cardsSelected, setCardsSelected] = useState([])

  const handleDishes = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
  }

  const handleNewMenu = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.NewMenu.path)
  }

  //* Fetch menu data *//

  useEffect(() => {
    if (user?.restaurantId) {
      dispatch(fetchMenus({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
    }
    setCardsSelected([])
  }, [page, dispatch, user])

  const refreshPage = () => {
    dispatch(fetchMenus({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
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
    <>
      <section className="mb-3">
        <div className="flex flex-row justify-between items-center">
          <BackButton title="Menús" />
          <div className="flex flex-row gap-x-3 items-center justify-between">
            {user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? (
              <Button
                text="Nuevo"
                color={colors.main_app_color}
                style={{
                  visibility: `${user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? "" : "hidden"}`
                }}
                onClick={handleNewMenu}>
                Nuevo
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable
            refreshPage={refreshPage}
            items={menus.map((menu) => {
              return { ...menu, dishesCount: menu?.Dishes?.length }
            })}
            handleDisableSelected={handleDisableSelected}
            screenType="menuScreen"
            loadingData={isLoading}
          />
        </Paper>
      </section>
    </>
  )
}
