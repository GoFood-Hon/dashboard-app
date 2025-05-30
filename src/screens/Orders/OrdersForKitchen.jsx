import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchOrdersForKitchen } from "../../store/features/ordersSlice"
import CardsViewLayout from "../CardsViewLayout"

const OrdersForKitchen = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.orders.itemsForKitchenPerPage)
  const page = useSelector((state) => state.orders.currentOrdersForKitchenPage)
  const ordersPerPage = useSelector((state) => state.orders.ordersForKitchenPerPage)
  const totalOrders = useSelector((state) => state.orders.totalOrdersForKitchen)
  const totalPageCount = useSelector((state) => state.orders.totalOrdersForKitchenPagesCount)
  const ordersList = ordersPerPage[page] || []
  const loadingOrders = useSelector((state) => state.orders.loadingOrdersForKitchen)

  useEffect(() => {
    if (!ordersPerPage[page]) {
      dispatch(fetchOrdersForKitchen({ limit, page, order: "DESC", status: "confirmed" }))
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
      onPaginationChange={(newPage) => dispatch(setCurrentPageForKitchen(newPage))}
      user={user}
      kitchenView
    />
  )
}

export default OrdersForKitchen
