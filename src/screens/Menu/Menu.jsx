import React, { useEffect } from "react"
import { Button, Flex, Group, Text, Title } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import MenuTable from "./MenuTable"
import { fetchMenus, setPage } from "../../store/features/menuSlice"
import { APP_ROLES } from "../../utils/constants"
import { colors } from "../../theme/colors"

export default function Menu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.menus.itemsPerPage)
  const page = useSelector((state) => state.menus.currentPage)
  const menusPerPage = useSelector((state) => state.menus.menusPerPage)
  const totalMenus = useSelector((state) => state.menus.totalMenus)
  const totalPageCount = useSelector((state) => state.menus.totalPagesCount)
  const menusList = menusPerPage[page] || []
  const loadingMenus = useSelector((state) => state.menus.loadingMenus)

  const handleDishes = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
  }

  const handleNewMenu = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.NewMenu.path)
  }

  useEffect(() => {
    if (!menusPerPage[page]) {
      dispatch(fetchMenus({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, menusPerPage])

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <Title order={2} fw={700}>
            Menús
          </Title>
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                <Flex gap={5}>
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalMenus)}{" "}
                  <Text>de</Text>
                  {totalMenus} menús
                </Flex>
              </Text>
            </Flex>
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
          </Flex>
        </Flex>
      </Group>
      <MenuTable
        items={menusList.map((menu) => {
          return { ...menu, dishesCount: menu?.Dishes?.length }
        })}
        screenType="menuScreen"
        loadingData={loadingMenus}
        currentPage={page}
        totalItems={totalPageCount}
        setPage={(newPage) => dispatch(setPage(newPage))}
      />
    </>
  )
}
