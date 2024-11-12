import React, { useEffect } from "react"
import MenuTable from "../Menu/MenuTable"
import { useDispatch, useSelector } from "react-redux"
import { Paper, Text, Title, Group, Flex } from "@mantine/core"
import { fetchReservationByBranch, fetchReservationByRestaurant, setPage } from "../../store/features/reservationsSlice"

export const Reservations = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)

  const limit = useSelector((state) => state.reservations.itemsPerPage)
  const page = useSelector((state) => state.reservations.currentPage)
  const reservationsPerPage = useSelector((state) => state.reservations.reservationsPerPage)
  const totalReservations = useSelector((state) => state.reservations.totalReservations)
  const totalPageCount = useSelector((state) => state.reservations.totalPagesCount)
  const reservationsList = reservationsPerPage[page] || []
  const loadingReservations = useSelector((state) => state.reservations.loadingReservations)

  useEffect(() => {
    if (!reservationsPerPage[page]) {
      user?.role === "admin-restaurant"
        ? dispatch(fetchReservationByRestaurant({ restaurantId: user?.restaurantId, limit, page, order: "DESC" }))
        : dispatch(fetchReservationByBranch({ branchId: user?.sucursalId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, reservationsPerPage])

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
                <Flex gap={5}>
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalReservations)}{" "}
                  <Text>de</Text>
                  {totalReservations} reservaciones
                </Flex>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Group>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable
            items={reservationsList.map((reservation) => ({
              ...reservation,
              name: reservation.Sucursal.name
            }))}
            //handleDisableSelected={handleDisableSelected}
            screenType="reservationsScreen"
            totalItems={totalPageCount}
            currentPage={page}
            loadingData={loadingReservations}
            setPage={(newPage) => dispatch(setPage(newPage))}
          />
        </Paper>
      </section>
    </>
  )
}
