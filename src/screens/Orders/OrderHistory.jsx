import React, { useEffect, useState } from "react"
import MenuTable from "../Menu/MenuTable"
import { useSelector } from "react-redux"
import { Flex, Group, Text, Title } from "@mantine/core"
import { useDispatch } from "react-redux"
import { fetchOrdersForKitchen } from "../../store/features/ordersSlice"

export const OrderHistory = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.orders.itemsPerPage)
  const page = useSelector((state) => state.orders.currentHistoryPage)
  const ordersPerPage = useSelector((state) => state.orders.ordersHistoryPerPage)
  const totalOrders = useSelector((state) => state.orders.totalHistoryOrders)
  const totalPageCount = useSelector((state) => state.orders.totalHistoryPagesCount)
  const ordersList = ordersPerPage[page] || []
  const loadingOrders = useSelector((state) => state.orders.loadingHistory)

  useEffect(() => {
    if (!ordersPerPage[page]) {
      dispatch(fetchOrdersForKitchen({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, ordersPerPage, user.role])

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <Title order={2} fw={700}>
            Historial de pedidos
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
        screenType="orderHistoryScreen"
        totalItems={totalPageCount}
        currentPage={page}
        loadingData={loadingOrders}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
      />
    </>
  )
}
