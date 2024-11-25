import React, { useEffect } from "react"
import MenuTable from "../Menu/MenuTable"
import { Flex, Group, Title, Text } from "@mantine/core"
import { useSelector } from "react-redux"
import { fetchAllOrders, setCurrentPage } from "../../store/features/ordersSlice"
import { useDispatch } from "react-redux"

export default function OrdersScreen() {
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
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <Title order={2} fw={700}>
            Pedidos
          </Title>
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                <Flex gap={5}>
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalOrders)}{" "}
                  <Text>de</Text>
                  {totalOrders} pedidos
                </Flex>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Group>
      <MenuTable
        items={ordersList.map((order) => {
          return { ...order, user: order?.Order?.User?.name, phone: order?.Order?.User?.phoneNumber }
        })}
        screenType="ordersScreen"
        totalItems={totalPageCount}
        currentPage={page}
        loadingData={loadingOrders}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
      />
    </>
  )
}
