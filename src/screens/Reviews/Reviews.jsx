import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { fetchAllOrders, setCurrentPage } from "../../store/features/ordersSlice"
import { useDispatch } from "react-redux"
import TableViewLayout from "../TableViewLayout"
import { formatTimeDifference } from "../../utils"

export default function Reviews() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.orders.itemsPerPage)
  const page = useSelector((state) => state.orders.currentPage)
  const ordersPerPage = useSelector((state) => state.orders.ordersPerPage)
  const totalOrders = useSelector((state) => state.orders.totalOrders)
  const totalPageCount = useSelector((state) => state.orders.totalPagesCount)
  const ordersList = ordersPerPage[page] || []
  const loadingOrders = useSelector((state) => state.orders.loadingOrders)

  useEffect(() => {
    if (!ordersPerPage[page]) {
      if (user.role === "kitchen") {
        dispatch(fetchAllOrders({ limit, page, order: "DESC", status: "confirmed" }))
      } else {
        dispatch(fetchAllOrders({ limit, page, order: "DESC" }))
      }
    }
  }, [dispatch, limit, page, ordersPerPage, user.role])

  return (
    <>
      <TableViewLayout
        title="Reseñas"
        page={page}
        limit={limit}
        totalElements={0}
        items={[]}
        tableStructure="ordersScreen"
        totalItems={totalPageCount}
        loading={loadingOrders}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
        noSearch
      />
    </>
  )
}
