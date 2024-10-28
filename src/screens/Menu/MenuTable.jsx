import { useState } from "react"
import {
  Table,
  Checkbox,
  ScrollArea,
  Group,
  TextInput,
  Avatar,
  ActionIcon,
  Pagination,
  Switch,
  createTheme,
  MantineProvider,
  rem,
  Loader,
  Paper,
  Flex,
  Text,
  Container,
  Grid,
  Badge
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
import { fetchAdminUsers } from "../../store/features/userSlice"
import { getFormattedHNL } from "../../utils"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.locale("es")

export default function MenuTable({
  refreshPage,
  items,
  handleDisableSelected,
  screenType,
  totalItems,
  currentPage,
  setPage,
  loadingData
}) {
  const [itemsSelected, setItemsSelected] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user) // Ajusta según tu estado

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
      reservationsScreen: NAVIGATION_ROUTES_RES_ADMIN.Reservations.path
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
      { label: "Fecha", accessor: "createdAt" },
      { label: "N° de platillos", accessor: "dishesCount", center: true },
      {
        label: "Estado",
        accessor: "isActive",
        render: (isActive) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={isActive}
              //onChange={() => (isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
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
      { label: "Rol", accessor: "role" },
      { label: "Correo", accessor: "email" },
      { label: "Teléfono", accessor: "phoneNumber" },
      { label: "Fecha", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "active",
        render: (active) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              //onChange={() => (isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
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
      { label: "Fecha", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "active",
        render: (active) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              //onChange={() => (isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
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
      { label: "Usuario", accessor: "Order.User.name" },
      { label: "Teléfono", accessor: "Order.User.phoneNumber" },
      { label: "Estado", accessor: "status" },
      { label: "Fecha", accessor: "createdAt" },
      { label: "Tipo", accessor: "Order.type" },
      { label: "Total", accessor: "total" },
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
        render: (active) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              //onChange={() => (isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
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
            size="md"
            w={100}
            color={status === "pending" ? colors.yellow_logo : status === "cancelled" ? colors.main_app_color : "green"}>
            {status === "pending" ? "Pendiente" : status === "cancelled" ? "Cancelado" : "Aprobado"}
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
      { label: "Nombre", accessor: "name" },
      { label: "Contiene", accessor: "content" },
      { label: "Clientes que utilizan", accessor: "clients", center: true },
      { label: "Fecha de creación", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "isActive",
        render: (active) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={active}
              //onChange={() => (isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
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
    ]
  }

  const currentColumns = columns[screenType] || []

  return (
    <>
      <Grid className={`flex w-full justify-between items-center mb-4 `}>
        <Grid.Col span={{ base: 12 }}>
          <TextInput
            radius="md"
            placeholder="Buscar"
            value={search}
            onChange={handleChange}
            rightSection={loading && <Loader color={colors.main_app_color} size={20} />}
          />
        </Grid.Col>
      </Grid>

      {loadingData ? (
        <TableSkeleton />
      ) : items && items.length > 0 ? (
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
                        {column.accessor === "createdAt" || column.accessor === "updatedAt"
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
      ) : (
        <Container h={450}>
          <Flex justify="center" h={450} align="center">
            <Text>No hay datos para mostrar</Text>
          </Flex>
        </Container>
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
