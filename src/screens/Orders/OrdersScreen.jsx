import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { fetchAllOrders, setCurrentPage, setSelectedSearchOption, setSearchData } from "../../store/features/ordersSlice"
import { useDispatch } from "react-redux"
import TableViewLayout from "../TableViewLayout"
import { formatTimeDifference } from "../../utils"
import { searchOptionsOrders } from "../../utils/constants"

export default function OrdersScreen() {
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.orders.itemsPerPage)
  const page = useSelector((state) => state.orders.currentPage)
  const ordersPerPage = useSelector((state) => state.orders.ordersPerPage)
  const totalOrders = useSelector((state) => state.orders.totalOrders)
  const totalPageCount = useSelector((state) => state.orders.totalPagesCount)
  const ordersList = ordersPerPage[page] || []
  const loadingOrders = useSelector((state) => state.orders.loadingOrders)
  const searchData = useSelector((state) => state.orders.searchData)
  const searchField = useSelector((state) => state.orders.searchField)

  useEffect(() => {
    if (!ordersPerPage[page]) {
      dispatch(fetchAllOrders({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page])

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setCurrentPage(1))
    dispatch(
      fetchAllOrders({ limit, page: 1, order: "DESC", search_field: searchField, search: query })
    )
  }

  return (
    <>
      <TableViewLayout
        title="Pedidos"
        page={page}
        limit={limit}
        totalElements={totalOrders}
        items={ordersList.map((order) => {
          return {
            ...order,
            user: order?.Order?.User?.name,
            phone: order?.Order?.User?.phoneNumber,
            cookingTime:
              order?.finishedCookingTimestamp !== null && order?.sentToKitchenTimestamp !== null
                ? formatTimeDifference(order?.sentToKitchenTimestamp, order?.finishedCookingTimestamp)
                : "No disponible",
            orderDate: order?.paidDate
          }
        })}
        tableStructure="ordersScreen"
        totalItems={totalPageCount}
        loading={loadingOrders}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        searchOptions={searchOptionsOrders}
        selectedOption={searchField}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
      />
    </>
  )
}
