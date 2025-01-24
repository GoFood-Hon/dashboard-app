import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchAllOrders } from "../../store/features/ordersSlice"
import CardsViewLayout from "../CardsViewLayout"

const OrdersForKitchen = () => {
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
      dispatch(fetchAllOrders({ limit, page, order: "ASC", status: "confirmed" }))
    }
  }, [dispatch, limit, page, ordersPerPage, user.role])

  return (
    <CardsViewLayout
      title="Pedidos recientes"
      page={page}
      limit={limit}
      totalPageCount={totalPageCount}
      totalElements={totalOrders}
      elementsName="pedidos"
      loadingElements={loadingOrders}
      elementsList={ordersList}
      onPaginationChange={(newPage) => dispatch(setCurrentPage(newPage))}
      user={user}
      kitchenView
    />
  )
}

export default OrdersForKitchen
