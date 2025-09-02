import {
  Table,
  ScrollArea,
  Group,
  Avatar,
  ActionIcon,
  Pagination,
  Switch,
  MantineProvider,
  rem,
  Flex,
  Badge,
  Box,
  Paper,
  Text,
  UnstyledButton,
  Center
} from "@mantine/core"
import { IconEye, IconCheck, IconX } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { useNavigate } from "react-router-dom"
import {
  NAVIGATION_ROUTES_KITCHEN,
  NAVIGATION_ROUTES_RES_ADMIN,
  NAVIGATION_ROUTES_SUPER_ADMIN,
  SETTING_NAVIGATION_ROUTES
} from "../../routes"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"
import { useDispatch } from "react-redux"
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton"
import { updateOtherUserStatus, updateUserStatus } from "../../store/features/userSlice"
import { formatTime, getFormattedHNL } from "../../utils"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { updateMenuStatus } from "../../store/features/menuSlice"
import { updatePlanStatus } from "../../store/features/plansSlice"
import { updateCollectionStatus } from "../../store/features/collectionsSlice"
import Lottie from "react-lottie"
import animationData from "../../assets/animation/NothingFoundAnimation.json"
import { theme } from "../../utils/constants"
import { setSelectedPromotion, updateOfferStatus } from "../../store/features/promotionsSlice"
import { IconTrash } from "@tabler/icons-react"
import { setSelectedCoupon, updateStatus } from "../../store/features/couponsSlice"
import { IconClock } from "@tabler/icons-react"
import { IconSelector } from "@tabler/icons-react"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.locale("es")

export default function MenuTable({
  totalElements,
  limit,
  items,
  screenType,
  totalItems,
  currentPage,
  setPage,
  loadingData,
  deleteAction,
  openModal
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const handleClick = (id) => {
    const routes = {
      menuScreen: NAVIGATION_ROUTES_RES_ADMIN.Menu.path,
      usersScreen: NAVIGATION_ROUTES_RES_ADMIN.Users.path,
      ordersScreen: NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path,
      adminUserScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Users.path,
      planScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path,
      orderHistoryScreen: NAVIGATION_ROUTES_KITCHEN.OrderHistory.path,
      reservationsScreen: NAVIGATION_ROUTES_RES_ADMIN.Reservations.path,
      collectionsScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path,
      loyaltyProgramsScreen: NAVIGATION_ROUTES_SUPER_ADMIN.Loyalty.path,
      promotionsScreen: SETTING_NAVIGATION_ROUTES.Promotions.path,
      couponsScreen: SETTING_NAVIGATION_ROUTES.Coupons.path,
      purchasesHistoryScreen: NAVIGATION_ROUTES_RES_ADMIN.Pedidos.OrderPurchasesHistory.path,
      reviewsScreen: NAVIGATION_ROUTES_RES_ADMIN.Reviews.path
    }

    navigate(`${routes[screenType]}/${id}`)
  }

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
      { label: "N° de productos", accessor: "dishesCount", center: true },
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
                    userId: item.id
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
      { label: "Fecha y hora", accessor: "orderDate" },
      {
        label: "Tiempo de preparación",
        accessor: "cookingTime",
        render: (cookingTime) => (
          <Flex align="center" gap={5}>
            <IconClock size={18} />
            <Text size="sm">{cookingTime}</Text>
          </Flex>
        )
      },
      {
        label: "Tipo de servicio",
        accessor: "serviceType",
        render: (service) => (service === "pickup" ? "Para llevar" : service === "onSite" ? "Venta en mesa" : "A domicilio")
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
      { label: "Usuario", accessor: "user" },
      { label: "Teléfono", accessor: "phone" },
      { label: "Fecha y hora", accessor: "orderDate" },
      {
        label: "Tiempo de preparación",
        accessor: "cookingTime",
        render: (cookingTime) => (
          <Flex align="center" gap={5}>
            <IconClock size={18} />
            <Text size="sm">{cookingTime}</Text>
          </Flex>
        )
      },
      {
        label: "Tipo de servicio",
        accessor: "serviceType",
        render: (service) => (service === "pickup" ? "Para llevar" : service === "onSite" ? "Venta en mesa" : "A domicilio")
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
            color={
              status === "pending" ? "rgba(153, 135, 0, 1)" : status === "cancelled" ? colors.main_app_color : "rgba(0, 94, 2, 1)"
            }>
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
    loyaltyProgramsScreen: [
      { label: "Título", accessor: "title" },
      { label: "Restaurante", accessor: "restaurantName" },
      { label: "Cantidad máxima de compras", accessor: "maximumAmountOfPurchasesAllowed", center: true },
      { label: "Fecha de creación", accessor: "createdAt" },
      { label: "Estado", accessor: "isActive", render: (active) => (active ? "Activo" : "Inactivo") },
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
      { label: "Contiene", accessor: "type", render: (type) => (type === "restaurants" ? "Comercios" : "Productos") },
      {
        label: "Cantidad",
        accessor: "dishes",
        center: true,
        render: (dishes, item) =>
          item.type === "restaurants" ? item.restaurants?.length || item.restaurants : dishes?.length || dishes
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
    ],
    promotionsScreen: [
      {
        label: "Nombre",
        accessor: "title",
        render: (title, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.images?.[0]?.location} radius={26} />
            {title}
          </div>
        )
      },
      { label: "Compra mínima", accessor: "minPurchase", render: (minPurchase) => getFormattedHNL(minPurchase) },
      {
        label: "Tipo de descuento",
        accessor: "category",
        render: (category) => (category === "fijo" ? "Monto fijo" : "Porcentaje")
      },
      { label: "Fecha de creación", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "available",
        render: (available, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={available}
              onChange={() => dispatch(updateOfferStatus({ promotionId: item.id, params: { isActive: !item.available } }))}
              color={colors.main_app_color}
              size="sm"
              thumbIcon={
                available ? (
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
          <Flex align="center" justify="center" gap={2}>
            <ActionIcon
              className="transition ease-in-out duration-200"
              variant="subtle"
              size="lg"
              onClick={() => {
                handleClick(id)
                dispatch(setSelectedPromotion(id))
              }}
              color="dimmed"
              radius="xl">
              <IconEye />
            </ActionIcon>
            <ActionIcon
              className="transition ease-in-out duration-200"
              variant="subtle"
              size="lg"
              onClick={() => deleteAction(id)}
              color={colors.main_app_color}
              radius="xl">
              <IconTrash />
            </ActionIcon>
          </Flex>
        )
      }
    ],
    couponsScreen: [
      {
        label: "Nombre",
        accessor: "title",
        render: (title, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.images?.[0]?.location} radius={26} />
            {title}
          </div>
        )
      },
      {
        label: "Tipo de descuento",
        accessor: "category",
        render: (category) => (category === "fijo" ? "Monto fijo" : "Porcentaje")
      },
      {
        label: "Tipo de cupón",
        accessor: "couponType",
        render: (type) => (type === "fecha" ? "Fecha de vigencia" : "Cantidad de usos")
      },
      { label: "Fecha de creación", accessor: "createdAt" },
      {
        label: "Estado",
        accessor: "isActive",
        render: (isActive, item) => (
          <MantineProvider theme={theme}>
            <Switch
              checked={isActive}
              onChange={() => dispatch(updateStatus({ couponId: item.id, params: { isActive: !item.isActive } }))}
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
          <Flex align="center" justify="center" gap={2}>
            <ActionIcon
              className="transition ease-in-out duration-200"
              variant="subtle"
              size="lg"
              onClick={() => {
                handleClick(id)
                dispatch(setSelectedCoupon(id))
              }}
              color="dimmed"
              radius="xl">
              <IconEye />
            </ActionIcon>
            <ActionIcon
              className="transition ease-in-out duration-200"
              variant="subtle"
              size="lg"
              onClick={() => deleteAction(id)}
              color={colors.main_app_color}
              radius="xl">
              <IconTrash />
            </ActionIcon>
          </Flex>
        )
      }
    ],
    purchasesHistoryScreen: [
      {
        label: "Nombre",
        accessor: "name",
        render: (name, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.photo} radius={26} />
            {name}
          </div>
        )
      },
      {
        label: "Identidad",
        accessor: "identityNumber"
      },
      {
        label: "Correo",
        accessor: "email"
      },
      { label: "Teléfono", accessor: "phoneNumber" },
      { label: "Pedidos realizados", accessor: "orderCount", center: true }
    ],
    reviewsScreen: [
      {
        label: "Nombre",
        accessor: "name",
        render: (name, item) => (
          <div className="flex items-center gap-2">
            <Avatar size={30} src={item?.User?.photo} radius={26} />
            {name}
          </div>
        )
      },
      {
        label: "Correo",
        accessor: "email"
      },
      { label: "Teléfono", accessor: "phoneNumber" },
      { label: "Fecha de creación", accessor: "createdAt" },
      {
        label: "Acciones",
        accessor: "id",
        center: true,
        render: (id) => (
          <ActionIcon
            className="transition ease-in-out duration-200"
            variant="subtle"
            size="lg"
            onClick={() => {
              openModal(id)
            }}
            color="dimmed"
            radius="xl">
            <IconEye color={colors.main_app_color} />
          </ActionIcon>
        )
      }
    ]
  }

  const currentColumns = columns[screenType] || []

  return (
    <>
      {loadingData ? (
        <TableSkeleton />
      ) : items && items.length > 0 ? (
        <>
          <Paper withBorder p="md" radius="md">
            <ScrollArea>
              <Table miw={800} verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    {currentColumns.map((column) => (
                      <Table.Th style={{ textAlign: column.center ? "center" : "left" }} key={column.label}>
                        <UnstyledButton className="w-full">
                          <Flex justify={column.center ? "center" : "start"} align="center" className="w-full" gap="xs">
                            <Text fw={500} fz="sm">
                              {column.label}
                            </Text>
                            <Center>
                              <IconSelector size="1.1rem" className="hidden" />
                            </Center>
                          </Flex>
                        </UnstyledButton>
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.map((item) => {
                    return (
                      <Table.Tr key={item.id}>
                        {currentColumns.map((column) => (
                          <Table.Td
                            style={{
                              textAlign: column.center ? "center" : "left"
                            }}
                            key={column.accessor}>
                            {column.accessor === "createdAt" || column.accessor === "updatedAt" || column.accessor === "paidDate"
                              ? dayjs(item[column.accessor]).fromNow()
                              : column.accessor === "orderDate"
                                ? formatTime(item[column.accessor])
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
          {totalElements > limit && (
            <Flex align="center" justify="end">
              <Group>
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
            </Flex>
          )}
        </>
      ) : (
        <Box className="h-[calc(100vh-200px)] w-full flex justify-center items-center">
          <Lottie isClickToPauseDisabled={true} options={defaultOptions} height={480} width={480} />
        </Box>
      )}
    </>
  )
}
