import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchReservationByBranch, fetchReservationByRestaurant, setPage } from "../../store/features/reservationsSlice"
import TableViewLayout from "../TableViewLayout"

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
      <TableViewLayout
        title="Reservaciones"
        page={page}
        limit={limit}
        totalElements={totalReservations}
        items={reservationsList.map((reservation) => ({
          ...reservation,
          name: reservation.Sucursal.name
        }))}
        tableStructure="reservationsScreen"
        totalItems={totalPageCount}
        loading={loadingReservations}
        setPage={(newPage) => dispatch(setPage(newPage))}
      />
    </>
  )
}
