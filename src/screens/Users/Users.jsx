import React, { useEffect } from "react"
import { Paper, Button, Group, Flex, Text } from "@mantine/core"
import MenuTable from "../Menu/MenuTable"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import BackButton from "../../screens/Dishes/components/BackButton"
import { fetchUsers, setCurrentUserPage } from "../../store/features/userSlice"
import { useDispatch } from "react-redux"

export default function Users() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.user.itemsPerPage)
  const page = useSelector((state) => state.user.currentUserPage)
  const usersByPage = useSelector((state) => state.user.usersByPage)
  const totalUsers = useSelector((state) => state.user.totalUsers)
  const totalPageCount = useSelector((state) => state.user.totalUserPagesCount)
  const users = usersByPage[page] || []
  const loadingUsers = useSelector((state) => state.user.loadingOtherUsers)

  useEffect(() => {
    if (!usersByPage[page]) {
      dispatch(fetchUsers({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, usersByPage])

  const handleNavigateNewUser = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.NewUser.path)
  }

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <BackButton title="Usuarios" />
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalUsers)}
              </Text>
              <Text>de</Text>
              <Text fw={700}>{totalUsers} usuarios</Text>
            </Flex>
            <Button color={colors.main_app_color} onClick={handleNavigateNewUser}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <MenuTable
        items={users}
        screenType="usersScreen"
        totalItems={totalPageCount}
        currentPage={page}
        loadingData={loadingUsers}
        setPage={(newPage) => dispatch(setCurrentUserPage(newPage))}
      />
    </>
  )
}
