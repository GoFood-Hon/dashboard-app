import { Grid, Stack, Title, Flex, Menu, Group, Button } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { DashboardScreen } from "./Dashboards/DashboardScreen"
import { MostSelledDishes } from "./Dashboards/MostSelledDishes"
import { OrdersByChannel } from "./Dashboards/OrdersByChannel"
import { SellsByChannel } from "./Dashboards/SellsByChannel"
import { MostSelledMenus } from "./Dashboards/MostSelledMenus"
import { colors } from "../theme/colors"
import { useEffect, useRef } from "react"
import { IconFilter } from "@tabler/icons-react"
import { useDispatch, useSelector } from "react-redux"
import {
  getMostSelledMenus,
  getMostSelledProducts,
  getOrdersData,
  getSellsData,
  mainAdminCardsStats,
  mainCardsStats,
  setDateRange,
  setSelectedFilter,
  setShowDatePickers
} from "../store/features/statsSlice"
import isoWeek from "dayjs/plugin/isoWeek"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(isoWeek)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("America/Tegucigalpa")

function Home() {
  const dispatch = useDispatch()
  const {
    cardsStats,
    loadingStats,
    sellsData,
    mostSelledProducts,
    ordersData,
    startDate,
    endDate,
    selectedFilter,
    showDatePickers,
    mostSelledMenus
  } = useSelector((state) => state.stats)

  const user = useSelector((state) => state.user.value)
  const firstRender = useRef(true)

  const fetchStats = (start, end) => {
    if (user.role === "superadmin") {
      dispatch(mainAdminCardsStats({ startDate: start, endDate: end }))
      dispatch(getSellsData({ startDate: start, endDate: end, type: "ventas" }))
      dispatch(getOrdersData({ startDate: start, endDate: end, type: "cantidad" }))
      dispatch(getMostSelledProducts({ startDate: start, endDate: end }))
      dispatch(getMostSelledMenus({ startDate: start, endDate: end }))
    } else {
      const payload = {
        restaurantId: user.restaurantId,
        startDate: start,
        endDate: end
      }
      dispatch(mainCardsStats(payload))
      dispatch(getSellsData({ ...payload, type: "ventas" }))
      dispatch(getOrdersData({ ...payload, type: "cantidad" }))
      dispatch(getMostSelledProducts(payload))
      dispatch(getMostSelledMenus(payload))
    }
  }

  useEffect(() => {
    if (!startDate || !endDate || !selectedFilter) {
      const today = dayjs()
      const start = today.startOf("isoWeek").format("YYYY-MM-DD")
      const end = today.endOf("day").format("YYYY-MM-DD")
      dispatch(setDateRange({ startDate: start, endDate: end }))
      dispatch(setSelectedFilter("Esta semana"))
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    if (startDate && endDate) {
      fetchStats(startDate, endDate)
    }
  }, [startDate, endDate])

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  const updateDateRange = (start, end) => {
    dispatch(
      setDateRange({
        startDate: start ? dayjs(start).tz().format("YYYY-MM-DD") : null,
        endDate: end ? dayjs(end).tz().format("YYYY-MM-DD") : null
      })
    )
  }

  const setFilter = (filterName, setDatesCallback) => {
    dispatch(setShowDatePickers(false))
    setDatesCallback()
    dispatch(setSelectedFilter(filterName))
  }

  const setToday = () => {
    const today = dayjs().format("YYYY-MM-DD")
    updateDateRange(today, today)
  }

  const setThisWeek = () => {
    const today = dayjs()
    const start = today.startOf("isoWeek").format("YYYY-MM-DD")
    const end = today.endOf("day").format("YYYY-MM-DD")
    updateDateRange(start, end)
  }

  const setLastWeek = () => {
    const start = dayjs().subtract(1, "week").startOf("isoWeek").format("YYYY-MM-DD")
    const end = dayjs().subtract(1, "week").endOf("isoWeek").format("YYYY-MM-DD")
    updateDateRange(start, end)
  }

  const setThisMonth = () => {
    const start = dayjs().startOf("month").format("YYYY-MM-DD")
    const end = dayjs().format("YYYY-MM-DD")
    updateDateRange(start, end)
  }

  const setLastMonth = () => {
    const start = dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD")
    const end = dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD")
    updateDateRange(start, end)
  }

  return (
    <Stack gap="xs">
      <Flex justify="space-between" align="center" wrap="wrap">
        <Title order={2}>Dashboard</Title>

        <Group align="center" gap="xs">
          {showDatePickers && (
            <>
              <DatePickerInput
                placeholder="Seleccione fecha inicial"
                value={startDate ? parseLocalDate(startDate) : null}
                onChange={(date) => updateDateRange(date, endDate ? parseLocalDate(endDate) : null)}
                maxDate={endDate ? parseLocalDate(endDate) : undefined}
                w={229}
                locale="es"
              />
              <DatePickerInput
                placeholder="Seleccione fecha final"
                value={endDate ? parseLocalDate(endDate) : null}
                onChange={(date) => updateDateRange(startDate ? parseLocalDate(startDate) : null, date)}
                minDate={startDate ? parseLocalDate(startDate) : undefined}
                w={229}
                locale="es"
              />
            </>
          )}

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button leftSection={<IconFilter size="1.1rem" />} color={colors.main_app_color}>
                {selectedFilter || "Filtros"}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Accesos rápidos</Menu.Label>
              <Menu.Item onClick={() => setFilter("Hoy", setToday)}>Hoy</Menu.Item>
              <Menu.Item onClick={() => setFilter("Esta semana", setThisWeek)}>Esta semana</Menu.Item>
              <Menu.Item onClick={() => setFilter("Semana pasada", setLastWeek)}>Semana pasada</Menu.Item>
              <Menu.Item onClick={() => setFilter("Este mes", setThisMonth)}>Este mes</Menu.Item>
              <Menu.Item onClick={() => setFilter("Mes pasado", setLastMonth)}>Mes pasado</Menu.Item>
              <Menu.Divider />
              <Menu.Label>Rango personalizado</Menu.Label>
              <Menu.Item
                onClick={() => {
                  dispatch(setShowDatePickers(true))
                  updateDateRange(null, null)
                  dispatch(setSelectedFilter("Personalizado"))
                }}>
                Seleccionar fechas
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>

      <DashboardScreen userRole={user.role} cardsStats={cardsStats} loadingStats={loadingStats} />

      <Grid gutter="xs">
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <OrdersByChannel data={ordersData} loading={loadingStats} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <SellsByChannel data={sellsData} loading={loadingStats} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <MostSelledMenus data={mostSelledMenus} loading={loadingStats} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <MostSelledDishes data={mostSelledProducts} loading={loadingStats} />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

export default Home
