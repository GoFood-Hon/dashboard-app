import React, { useState, useEffect } from "react"
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
  rem
} from "@mantine/core"
import { IconSearch, IconReload, IconTrash, IconEye, IconCheck, IconX } from "@tabler/icons-react"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { colors } from "../../theme/colors"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_KITCHEN, NAVIGATION_ROUTES_RES_ADMIN, NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"
dayjs.extend(relativeTime)
dayjs.locale("es")
dayjs.extend(relativeTime)
dayjs.locale("es")
dayjs.extend(relativeTime)

export default function MenuTable({ refreshPage, items, handleDisableSelected, screenType, totalItems, currentPage, setPage }) {
  const [data, setData] = useState(items)
  const [itemsSelected, setItemsSelected] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const totalControlBtn = Math.ceil(totalItems / ITEMS_PER_PAGE)

  useEffect(() => {
    setData(items)
  }, [items, currentPage])

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
      orderHistoryScreen: NAVIGATION_ROUTES_KITCHEN.Orders.path
    }

    navigate(`${routes[screenType]}/${id}`)
  }

  const toggleRow = (id) => {
    setItemsSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const toggleAll = () => {
    setItemsSelected((current) => (current.length === items.length ? [] : items.map((item) => item.id)))
  }

  const filteredData = data.filter((item) => {
    const searchField =
      screenType === "ordersScreen" ? item.Order?.User?.name : screenType === "orderHistoryScreen" ? item?.orderId : item.name
    return searchField?.toLowerCase().includes(search.toLowerCase())
  })

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
              color={colors.primary_button}
              size="md"
              thumbIcon={
                isActive ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.primary_button} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.primary_button} />
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
            color={colors.primary_button}
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
              color={colors.primary_button}
              size="sm"
              thumbIcon={
                active ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.primary_button} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.primary_button} />
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
            color={colors.primary_button}
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
              color={colors.primary_button}
              size="sm"
              thumbIcon={
                active ? (
                  <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.primary_button} />
                ) : (
                  <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.primary_button} />
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
            color={colors.primary_button}
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
            color={colors.primary_button}
            radius="xl">
            <IconEye />
          </ActionIcon>
        )
      }
    ],
    planScreen: [
      { label: "Nombre", accessor: "name" },
      { label: "Tipo de pago", accessor: "paymentType" },
      { label: "Precio", accessor: "price" },
      { label: "Última actualización", accessor: "updatedAt" },
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
            color={colors.primary_button}
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
            color={colors.primary_button}
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
      <div className="flex w-full justify-between items-center mb-4">
        <Group mx={10}>
          <TextInput
            placeholder="Buscar aquí"
            value={search}
            w={500}
            icon={<IconSearch />}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Group>
        <div className="flex items-center gap-1 mr-5">
          <ActionIcon
            onClick={refreshPage}
            className="transition ease-in-out duration-200"
            variant="subtle"
            p={6}
            color={colors.primary_button}
            radius="xl"
            size="lg">
            <IconReload />
          </ActionIcon>
          {handleDisableSelected && (
            <ActionIcon
              onClick={() => handleDisableSelected(itemsSelected)}
              className="transition ease-in-out duration-200"
              variant="subtle"
              p={6}
              color={colors.primary_button}
              radius="xl"
              size="lg">
              <IconTrash />
            </ActionIcon>
          )}
        </div>
      </div>

      <ScrollArea>
        <Table miw={800} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={itemsSelected.length === items.length}
                  indeterminate={itemsSelected.length > 0 && itemsSelected.length !== items.length}
                  color={colors.primary_button}
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
                    <Checkbox color={colors.primary_button} checked={selected} onChange={() => toggleRow(item.id)} />
                  </Table.Td>
                  {currentColumns.map((column) => (
                    <Table.Td
                      style={{
                        textAlign: column.center ? "center" : "left"
                      }}
                      key={column.accessor}>
                      {column.accessor === "createdAt" || column.accessor === "updatedAt"
                        ? dayjs(item[column.accessor]).fromNow()
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

      <div className="flex w-full justify-end">
        <Group mx={20} mt={10}>
          <Pagination
            total={totalControlBtn}
            page={currentPage}
            onChange={(page) => setPage(page)}
            color={colors.primary_button}
            defaultValue={currentPage}
          />
        </Group>
      </div>
    </>
  )
}
