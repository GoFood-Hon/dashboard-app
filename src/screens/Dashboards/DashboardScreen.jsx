import { Grid } from "@mantine/core"
import React, { useEffect, useState } from "react"

import reportsApi from "../../api/reportsApi"
import toast from "react-hot-toast"
import { Icon } from "../../components/Icon"
import { getFormattedHNL } from "../../utils"
import { Group, Paper, SimpleGrid, Text } from "@mantine/core"
import { IconUserPlus, IconDiscount2, IconReceipt2, IconCoin, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react"
import classes from "../../assets/css/StatsGrid.module.css"
import { IconMoneybag } from "@tabler/icons-react"
import { IconTicket } from "@tabler/icons-react"
import { IconCube } from "@tabler/icons-react"
import { IconUsersGroup } from "@tabler/icons-react"

export const DashboardScreen = () => {
  const [dailySales, setDailySales] = useState(0)
  const [dailyOrders, setDailyOrders] = useState(0)
  const [dailyTicket, setDailyTicket] = useState(0)
  const [totalClients, setTotalClients] = useState(0)

  useEffect(() => {
    const getDailySales = async () => {
      try {
        const currentDate = new Date()

        const response = await reportsApi.getDailySales(currentDate.toLocaleDateString(), currentDate.toLocaleDateString())

        setDailySales(response?.data?.total_ventas || 0)
      } catch (error) {
        toast.error(`Hubo un error.  ${error}`, {
          duration: 7000
        })
      }
    }

    const getNewUsers = async () => {
      try {
        const response = await reportsApi.getUsersCount()

        setTotalClients(response?.results || 0)
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }

    const getAverageTicketDailyData = async () => {
      try {
        const response = await reportsApi.getAverageTicketDaily()
        // TODO: Fix this response
        setDailyOrders(response?.data?.total || 0)
        setDailyTicket(response?.data?.total || 0)
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }

    getAverageTicketDailyData()
    getDailySales()
    getNewUsers()
  }, [])

  const icons = {
    user: IconUserPlus,
    discount: IconDiscount2,
    receipt: IconReceipt2,
    coin: IconCoin
  }

  const data = [
    { title: "Ventas", icon: IconCoin, value: getFormattedHNL(dailySales), diff: 34, text: "Ventas diarias totales" },
    { title: "Pedidos", icon: IconCube, value: dailyOrders, diff: -13, text: "Total pedidos diarios" },
    { title: "Tickets", icon: IconTicket, value: getFormattedHNL(dailyTicket), diff: 18, text: "Tickets según venta diaria" },
    { title: "Usuarios", icon: IconUsersGroup, value: totalClients, diff: -30, text: "Total nuevos usuarios" }
  ]

  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          {/* Renderizar el ícono como un componente JSX */}
          <stat.icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text c={stat.diff > 0 ? "teal" : "red"} fz="sm" fw={500} className={classes.diff}>
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="sm" c="dimmed" mt={7}>
          {stat.text}
        </Text>
      </Paper>
    )
  })

  return (
    <div>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  )
}
