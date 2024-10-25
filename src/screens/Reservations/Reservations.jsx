import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage, fetchAdminUsers } from "../../store/features/userSlice"
import { Paper, Button, Text, Title, Group, Flex } from "@mantine/core"
import { colors } from "../../theme/colors"
import { fetchReservationByRestaurant } from "../../store/features/reservationsSlice"
import { name } from "dayjs/locale/es"

export const Reservations = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reservations = useSelector((state) => state.reservations.reservations)
  const status = useSelector((state) => state.reservations.status)

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }

  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.user.itemsPerPage)
  const page = useSelector((state) => state.user.currentPage)
  const adminUsersByPage = useSelector((state) => state.user.adminUsersByPage)
  const totalAdminUsers = useSelector((state) => state.user.totalAdminUsers)
  const totalPageCount = useSelector((state) => state.user.totalPagesCount)
  const adminUsers = adminUsersByPage[page] || []
  const loadingUsers = useSelector((state) => state.user.loadingUsers)

  useEffect(() => {
    dispatch(fetchReservationByRestaurant(user?.Restaurant?.id))
    console.log(reservations)
  }, [dispatch, user?.Restaurant?.id])

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <Title order={2} fw={700}>
            Reservaciones
          </Title>
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {/* <Flex gap={5}>
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalAdminUsers)}{" "}
                  <Text>de</Text>3 reservaciones
                </Flex> */}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Group>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable
            items={reservations.map((reservation) => ({
              ...reservation,
              name: reservation?.Sucursal?.name
            }))}
            //handleDisableSelected={handleDisableSelected}
            screenType="reservationsScreen"
            totalItems={1}
            currentPage={1}
            loadingData={loadingUsers}
            setPage={(newPage) => dispatch(setCurrentPage(newPage))}
          />
        </Paper>
      </section>
    </>
  )
}
