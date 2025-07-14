import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchReservationByBranch,
  fetchReservationByRestaurant,
  setPage,
  setSearchData,
  setSelectedSearchOption
} from "../../store/features/reservationsSlice"
import TableViewLayout from "../TableViewLayout"
import { searchOptionsReservations } from "../../utils/constants"
import { NoPermissionsAnimation } from "../../components/Plans/NoPermissionsAnimation"

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
  const searchData = useSelector((state) => state.reservations.searchData)
  const searchField = useSelector((state) => state.reservations.searchField)
  const haveReservationsModule = !!user?.Restaurant?.Subscription?.Plan?.PlanFeatures?.some(
    (feature) => feature.featureCode === "reservations-module" && feature.PlanPlanFeatures?.avai === true
  )

  useEffect(() => {
    if (!reservationsPerPage[page]) {
      user?.role === "admin-restaurant"
        ? dispatch(fetchReservationByRestaurant({ restaurantId: user?.restaurantId, limit, page, order: "DESC" }))
        : dispatch(fetchReservationByBranch({ branchId: user?.sucursalId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, reservationsPerPage])

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setPage(1))
    user?.role === "admin-restaurant"
      ? dispatch(
          fetchReservationByRestaurant({
            restaurantId: user?.restaurantId,
            limit,
            page: 1,
            order: "DESC",
            search_field: searchField,
            search: query
          })
        )
      : dispatch(
          fetchReservationByBranch({
            branchId: user?.sucursalId,
            limit,
            page: 1,
            order: "DESC",
            search_field: searchField,
            search: query
          })
        )
    dispatch(
      fetchMenus({ restaurantId: user.restaurantId, limit, page, order: "DESC", search_field: searchField, search: query })
    )
  }

  return haveReservationsModule ? (
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
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        searchOptions={searchOptionsReservations}
        selectedOption={searchField}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
      />
    </>
  ) : (
    <NoPermissionsAnimation moduleName="reservaciones" />
  )
}
