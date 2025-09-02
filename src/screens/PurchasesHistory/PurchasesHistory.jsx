import { useDispatch, useSelector } from "react-redux"
import TableViewLayout from "../../screens/TableViewLayout"
import { getOrdersHistoryRestaurant, getOrdersHistorySucursal, setDateRange } from "../../store/features/ordersSlice"

export default function PurchasesHistory() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const { dateRange, loadingHistory, purchaseHistoryData } = useSelector((state) => state.orders)

  const handleFilterSearch = () => {
    if (user.role === "admin-sucursal") {
      dispatch(
        getOrdersHistorySucursal({
          sucursalId: user.sucursalId,
          startDate: dateRange?.[0] || null,
          endDate: dateRange?.[1] || null
        })
      )
    } else {
      dispatch(
        getOrdersHistoryRestaurant({
          restaurantId: user.restaurantId,
          startDate: dateRange?.[0] || null,
          endDate: dateRange?.[1] || null
        })
      )
    }
  }

  const handleDateChange = (value) => {
    if (!Array.isArray(value)) return
    const formattedRange = value.filter((date) => date instanceof Date).map((date) => date.toISOString())
    dispatch(setDateRange(formattedRange))
  }

  return (
    <TableViewLayout
      title="Historial de clientes"
      items={purchaseHistoryData}
      tableStructure="purchasesHistoryScreen"
      loading={loadingHistory}
      noSearch
      dates
      filterData
      value={dateRange.map((date) => (date ? new Date(date) : null))}
      setRange={handleDateChange}
      filterAction={handleFilterSearch}
      noCounts
    />
  )
}
