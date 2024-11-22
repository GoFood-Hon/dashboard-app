import { useState } from "react"
import {
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  ActionIcon,
  Pagination,
  Switch,
  createTheme,
  MantineProvider,
  rem,
  Flex,
  Badge,
  Box,
  Paper
} from "@mantine/core"
import { IconEye, IconCheck, IconX } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_KITCHEN, NAVIGATION_ROUTES_RES_ADMIN, NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"
import { useDebouncedCallback } from "@mantine/hooks"
import { useDispatch, useSelector } from "react-redux"
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton"
import { fetchAdminUsers, updateOtherUserStatus, updateUserStatus } from "../../store/features/userSlice"
import { getFormattedHNL } from "../../utils"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { updateMenuStatus } from "../../store/features/menuSlice"
import { updatePlanStatus } from "../../store/features/plansSlice"
import { updateCollectionStatus } from "../../store/features/collectionsSlice"
import Lottie from "react-lottie"
import animationData from "../../assets/animation/NothingFoundAnimation.json"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.locale("es")

export default function MenuTable({ items, screenType, totalItems, currentPage, setPage, loadingData }) {
  const [itemsSelected, setItemsSelected] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const getSearchResults = async (query, searchField) => {
    try {
      const limit = 10
      const page = 1
      const search_field = searchField
      const search = query

      dispatch(fetchAdminUsers({ limit, page, order: "DESC", search_field, search }))

      // Verifica el estado después de la acción
      if (userData.error) {
        return []
      } else {
        setLoading(false)
        return userData.data
      }
    } catch (error) {
      return []
    }
  }

  const handleSearch = useDebouncedCallback(async (query) => {
    setSearchResults(await getSearchResults(query, "name"))
  }, 500)

  const handleChange = (event) => {
    setLoading(true)
    setSearch(event.currentTarget.value)
    handleSearch(event.currentTarget.value)
  }

  const handleSelectChange = (id) => {
    setItemsSelected((prevState) => {
      const newSelection = prevState.includes(id) ? prevState.filter((item) => item !== id) : [...prevState, id]
      return newSelection
    })
  }

  const handleClick = (id) => {
    const routes = {
      menuScreen: NAVIGATION_ROUTES_RES_ADMIN.Menu.path,
      usersScreen: NAVIGATION_ROUTES_RES_ADMIN.Users.path,
      ordersScreen: NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path,
      adminUserScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Users.path,
      planScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path,
      orderHistoryScreen: NAVIGATION_ROUTES_KITCHEN.Orders.path,
      reservationsScreen: NAVIGATION_ROUTES_RES_ADMIN.Reservations.path,
      collectionsScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path
    }

    navigate(`${routes[screenType]}/${id}`)
  }

  const toggleRow = (id) => {
    setItemsSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const toggleAll = () => {
    setItemsSelected((current) => (current.length === items.length ? [] : items.map((item) => item.id)))
  }

  const theme = createTheme({
    cursorType: "pointer"
  })

  const columns = {
    menuScreen: [
      {
        label: "Nombre",
        accessor: "name",
        render: (name, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.images?.[0]?.location} radius={26} />
            {name}
          </div>
        )
      },
      { label: "Creado", accessor: "createdAt" },
      { label: "N° de platillos", accessor: "dishesCount", center: true },
      {
        label: "Estado",
        accessor: "isActive",
        render: (isActive, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={isActive}
              onChange={() =>
                dispatch(updateMenuStatus({ data: { id: item.id, isActive: !item.isActive }, propertyToUpdate: "isActive" }))
              }
              color={colors.main_app_color}
              size="md"
              thumbIcon={
                isActive ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                )
              }
            />
          </MantineProvider>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    usersScreen: [
      {
        label: "Usuario",
        accessor: "name",
        render: (name, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.images?.[0]?.location} radius={26} />
            {name}
          </div>
        )
      },
      {
        label: "Rol",
        accessor: "role",
        render: (role) =>
          role === "admin-restaurant"
            ? "Admin. de restaurante"
            : role === "admin-sucursal"
              ? "Admin. de sucursal"
              : role === "cashier"
                ? "Cajero"
                : role === "kitchen"
                  ? "Cocinero"
                  : "Repartidor"
      },
      { label: "Correo", accessor: "email" },
      { label: "Teléfono", accessor: "phoneNumber" },
      { label: "Fecha", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "active",
        render: (active, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              onChange={() =>
                dispatch(
                  updateOtherUserStatus({
                    params: { active: !item.active },
                    userId: item.role === "driver " ? item.AdminUserId : item.id
                  })
                )
              }
              color={colors.main_app_color}
              size="sm"
              thumbIcon={
                active ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                )
              }
            />
          </MantineProvider>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    adminUserScreen: [
      {
        label: "Usuario",
        accessor: "name",
        render: (name, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.images?.[0]?.location} radius={26} />
            {name}
          </div>
        )
      },
      { label: "Rol", accessor: "role" },
      { label: "Correo", accessor: "email" },
      { label: "Teléfono", accessor: "phoneNumber" },
      { label: "Creado", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "active",
        render: (active, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              onChange={() => dispatch(updateUserStatus({ id: item.id, params: { active: !item.active } }))}
              color={colors.main_app_color}
              size="sm"
              thumbIcon={
                active ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                )
              }
            />
          </MantineProvider>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    ordersScreen: [
      { label: "Usuario", accessor: "user" },
      { label: "Teléfono", accessor: "phone" },
      { label: "Fecha", accessor: "paidDate" },
      {
        label: "Tipo de servicio",
        accessor: "serviceType",
        render: (service) =>
          service === "pickup" ? "Para llevar" : service === "onSite" ? "Comer en restaurante" : "A domicilio"
      },
      { label: "Total", accessor: "total", render: (total) => getFormattedHNL(total) },
      {
        label: "Estado",
        accessor: "status",
        center: true,
        render: (status) => (
          <Badge
            size="lg"
            w={180}
            tt="capitalize"
            color={
              status === "pending" ||
              status === "on-hold" ||
              status === "confirmed" ||
              status === "ready" ||
              status === "ready-to-pick-up" ||
              status === "ready-for-customer" ||
              status === "on-delivery"
                ? "rgba(153, 135, 0, 1)"
                : status === "canceled"
                  ? colors.main_app_color
                  : "rgba(0, 94, 2, 1)"
            }>
            {status === "pending"
              ? "Pendiente"
              : status === "canceled"
                ? "Cancelado"
                : status === "on-hold"
                  ? "En espera"
                  : status === "confirmed"
                    ? "Confirmado"
                    : status === "ready-to-pick-up"
                      ? "Esperando repartidor"
                      : status === "ready" || status === "ready-for-customer"
                        ? "Preparado"
                        : status === "on-delivery"
                          ? "En camino"
                          : "Completado"}
          </Badge>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    planScreen: [
      { label: "Nombre", accessor: "name" },
      {
        label: "Tipo de pago",
        accessor: "paymentType"
      },
      {
        label: "Precio",
        render: (price) => {
          return getFormattedHNL(price)
        },
        accessor: "price"
      },
      {
        label: "Suscripciones",
        render: (hasSubscriptions) => (hasSubscriptions ? "Si" : "No"),
        accessor: "hasSubscriptions",
        center: true
      },
      { label: "Última actualización", accessor: "updatedAt" },
      {
        label: "Estado",
        accessor: "isActive",
        render: (active, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              onChange={() => dispatch(updatePlanStatus({ id: item.id, params: { isActive: !item.isActive } }))}
              color={colors.main_app_color}
              size="sm"
              thumbIcon={
                active ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                )
              }
            />
          </MantineProvider>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    orderHistoryScreen: [
      { label: "Costo de envío", accessor: "shippingPrice" },
      { label: "Descuento", accessor: "discount" },
      { label: "Subtotal", accessor: "subtotal" },
      { label: "ISV", accessor: "isv" },
      { label: "Total", accessor: "total" },
      { label: "Fecha de pago", accessor: "paidDate" },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    reservationsScreen: [
      { label: "Sucursal", accessor: "name" },
      { label: "Creación", accessor: "createdAt" },
      { label: "Sillas reservadas", accessor: "chairs", center: true },
      { label: "Fecha de reserva", accessor: "reservationDate" },
      {
        label: "Pagado",
        accessor: "isPayed",
        render: (pay) => (pay ? "Si" : "No")
      },
      {
        label: "Estado",
        accessor: "status",
        center: true,
        render: (status) => (
          <Badge
            size="lg"
            w={160}
            tt="capitalize"
            color={status === "pending" ? colors.yellow_logo : status === "cancelled" ? colors.main_app_color : "green"}>
            {status === "pending" ? "Pendiente" : status === "cancelled" ? "Cancelada" : "Aprobada"}
          </Badge>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    collectionsScreen: [
      {
        label: "Nombre",
        accessor: "name",
        render: (name, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.banner?.[0]?.location} radius={26} />
            {name}
          </div>
        )
      },
      { label: "Contiene", accessor: "type", render: (type) => (type === "restaurants" ? "Restaurantes" : "Platillos") },
      {
        label: "Cantidad",
        accessor: "dishes",
        center: true,
        render: (dishes, item) => (item.type === "restaurants" ? item.restaurants?.length || 0 : dishes?.length || 0)
      },
      { label: "Fecha de creación", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "isActive",
        render: (isActive, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={isActive}
              onChange={() => dispatch(updateCollectionStatus({ setId: item.id, params: { isActive: !item.isActive } }))}
              color={colors.main_app_color}
              size="sm"
              thumbIcon={
                isActive ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                )
              }
            />
          </MantineProvider>
        )
      },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => handleClick(id)}
            color={colors.main_app_color}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ]
  }

  const currentColumns = columns[screenType] || []

  return (
    <>
      {/* <Grid className={`flex w-full justify-between items-center mb-4 `}>
        <Grid.Col span={{ base: 12 }}>
          <TextInput
            radius="md"
            placeholder="Buscar"
            value={search}
            onChange={handleChange}
            rightSection={loading && <Loader color={colors.main_app_color} size={20} />}
          />
        </Grid.Col>
      </Grid> */}

      {loadingData ? (
        <TableSkeleton />
      ) : items && items.length > 0 ? (
        <Paper withBorder p="md" radius="md">
          <ScrollArea>
            <Table miw={800} verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 40 }}>
                    <Checkbox
                      onChange={toggleAll}
                      checked={itemsSelected.length === items.length}
                      indeterminate={itemsSelected.length > 0 && itemsSelected.length !== items.length}
                      color={colors.main_app_color}
                    />
                  </Table.Th>
                  {currentColumns.map((column) => (
                    <Table.Th style={{ textAlign: column.center ? "center" : "left" }} key={column.label}>
                      {column.label}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => {
                  const selected = itemsSelected.includes(item.id)
                  return (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Checkbox color={colors.main_app_color} checked={selected} onChange={() => toggleRow(item.id)} />
                      </Table.Td>
                      {currentColumns.map((column) => (
                        <Table.Td
                          style={{
                            textAlign: column.center ? "center" : "left"
                          }}
                          key={column.accessor}>
                          {column.accessor === "createdAt" || column.accessor === "updatedAt" || column.accessor === "paidDate"
                            ? dayjs(item[column.accessor]).fromNow()
                            : column.accessor === "reservationDate"
                              ? dayjs(item[column.accessor])
                                  .tz("America/Tegucigalpa")
                                  .format("D [de] MMMM [del] YYYY [a las] h:mm A")
                              : column.render
                                ? column.render(item[column.accessor], item)
                                : item[column.accessor]}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      ) : (
        <Box>
          <Flex direction="column" align="center">
            <Lottie options={defaultOptions} height={440} width={440} />
          </Flex>
        </Box>
      )}

      <div className="flex w-full justify-end">
        <Group mt={10}>
          <Pagination
            total={totalItems}
            page={currentPage}
            onChange={(page) => setPage(page)}
            color={colors.main_app_color}
            defaultValue={currentPage}
            size="md"
            withEdges
          />
        </Group>
      </div>
    </>
  )
}
