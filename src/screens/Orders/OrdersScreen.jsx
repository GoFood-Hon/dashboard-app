import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import MenuTable from "../Menu/MenuTable"
import orderApi from "../../api/orderApi"
import BackButton from "../Dishes/components/BackButton"
import { showNotification } from "@mantine/notifications"
import { Flex, Group, Title, Button, Paper, Text } from "@mantine/core"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"

export default function OrdersScreen() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const page = useSelector((state) => state.user.currentPage)
  const limit = useSelector((state) => state.user.itemsPerPage)

  const ordersData = [
    {
      id: "9fad22a9-5f78-4be2-a37a-e518a07f8c0b",
      user: "Andrea Santos",
      phone: "98227423",
      status: "pending",
      createdAt: "2024-10-28T08:52:14.412Z",
      total: "899"
    },
    {
      id: "fcc19bca-6b8f-46f8-88a5-3f6b22b65245",
      user: "Roberto Castillo",
      phone: "98227423",
      status: "pending",
      createdAt: "2024-10-27T20:52:14.412Z",
      total: "899"
    },
    {
      id: "8dd4e41b-ab0c-4668-8314-796baf297ace",
      user: "Antonio Aguilar",
      phone: "98227423",
      status: "hola",
      createdAt: "2024-10-26T20:52:14.412Z",
      total: "899"
    }
  ]

  const fetchOrders = async () => {
    try {
      setIsLoading(true)

      const response = await orderApi.getAllOrders()
      console.log(response)
      setOrders(response?.data)
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      }
    } catch (e) {
      showNotification({
        title: "Error",
        message: e.message,
        color: "red",
        duration: 7000
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const refreshPage = () => {
    fetchOrders()
  }

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
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalAdminUsers)}{" "}
                  <Text>de</Text>3 pedidos
                </Flex>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Group>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable
            items={ordersData}
            //handleDisableSelected={handleDisableSelected}
            screenType="ordersScreen"
            totalItems={1}
            currentPage={1}
            loadingData={isLoading}
            setPage={(newPage) => dispatch(setCurrentPage(newPage))}
          />
        </Paper>
      </section>
    </>
  )
}
