import {
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Stepper,
  Text,
  Title,
  Button,
  Avatar,
  ScrollArea,
  Checkbox,
  Card,
  MantineProvider,
  BackgroundImage,
  Skeleton,
  CopyButton,
  Tooltip,
  ActionIcon,
  rem,
  Box
} from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { calculateTimeDifference, Countdown, formatTime, getFormattedHNL } from "../../utils"
import {
  APP_ROLES,
  billsData,
  orderDeliveryTypes,
  orderStates,
  orderStatusValues,
  SECONDARY_COL_HEIGHT,
  theme
} from "../../utils/constants"
import { DishOrderDetailCard } from "./DishOrderDetailCard"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import BackButton from "../Dishes/components/BackButton"
import { useDispatch } from "react-redux"
import {
  assignDriver,
  cancelOrder,
  confirmOrder,
  fetchOrderDetails,
  markOrderDelivered,
  updateOrderStatus,
  fetchDrivers
} from "../../store/features/ordersSlice"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import ConfirmationModal from "../ConfirmationModal"
import ModalLayout from "./ModalLayout"
import UserData from "../../components/UserData/UserData"
import {
  IconCircleCheck,
  IconCancel,
  IconReceipt,
  IconBrandRedux,
  IconMotorbike,
  IconCar,
  IconToolsKitchen3,
  IconStopwatch,
  IconBox,
  IconHelmet,
  IconUser,
  IconCheck,
  IconCopy,
  IconFlame,
  IconClock,
  IconTable,
  IconCash,
  IconCreditCard
} from "@tabler/icons-react"
import { LoadingPage } from "../../components/LoadingPage"
import dayjs from "dayjs"

export const OrderDetails = () => {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [driver, setDriver] = useState(null)
  const { orderDetails, loadingDetails, updatingOrderStatus, cancelOrderStatus, loadingDrivers, drivers, updatingDriver } =
    useSelector((state) => state.orders)
  const [opened, { open, close }] = useDisclosure(false)
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [openedComments, { open: openModalComment, close: closeModalComment }] = useDisclosure(false)
  const [openedBill, { open: openBillModal, close: closeBillModal }] = useDisclosure(false)
  const isSmallScreen = useMediaQuery("(max-width: 1080px)")
  const getInitialStep = () => {
    const serviceSteps = orderStates[orderDetails?.serviceType] || []
    const matchingStep = serviceSteps.find((step) => step.value === orderDetails.status)
    return matchingStep ? matchingStep.step : 0
  }
  const [active, setActive] = useState(getInitialStep)
  const [selectedAction, setSelectedAction] = useState(null)
  const [readyMap, setReadyMap] = useState({})
  const markReady = (id) => setReadyMap((prev) => ({ ...prev, [id]: true }))
  const isScheduled = Boolean(orderDetails?.scheduledDate) && !orderDetails?.isWantedAsSoonAsItIsReady
  const isPast = isScheduled ? dayjs().isAfter(dayjs(orderDetails?.scheduledDate)) : true
  const isAvailable = !isScheduled || isPast || readyMap[orderDetails?.id] === true

  useEffect(() => {
    setActive(getInitialStep())
  }, [orderDetails])

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId))
  }, [])

  return (
    <>
      {loadingDetails ? (
        <LoadingPage />
      ) : (
        <>
          <Stack gap="xs">
            <Group>
              <Flex align="center" justify="space-between" gap="xs">
                <BackButton title={orderDetails?.orderId} show />
                <CopyButton value={orderDetails?.orderId} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? "Copiado" : "Copiar"} withArrow position="right">
                      <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Flex>
            </Group>
            <Paper withBorder p="md" radius="md" bg={orderDetails?.status === "canceled" ? "red" : ""}>
              {orderDetails?.status !== "canceled" ? (
                isSmallScreen ? (
                  <ScrollArea>
                    <Stepper
                      active={active}
                      onStepClick={setActive}
                      allowNextStepsSelect={false}
                      color={colors.main_app_color}
                      size="xs"
                      completedIcon={<IconCircleCheck size="1.8rem" />}
                      orientation="horizontal"
                      style={{
                        display: "flex",
                        gap: rem(24),
                        minWidth: "max-content",
                        paddingBottom: rem(8)
                      }}>
                      {orderStates[orderDetails?.serviceType]?.map((item, index) => (
                        <Stepper.Step
                          key={index}
                          allowStepSelect={false}
                          icon={<item.icon size="1.2rem" />}
                          label={`Paso ${index + 1}`}
                          description={item.label}
                          loading={index === active}
                          style={{
                            scrollSnapAlign: "center",
                            flex: "0 0 auto"
                          }}
                        />
                      ))}
                    </Stepper>
                  </ScrollArea>
                ) : (
                  <Stepper
                    active={active}
                    color={colors.main_app_color}
                    size="sm"
                    onStepClick={setActive}
                    allowNextStepsSelect={false}
                    completedIcon={<IconCircleCheck size="1.8rem" />}>
                    {orderStates[orderDetails?.serviceType]?.map((item, index) => (
                      <Stepper.Step
                        key={index}
                        allowStepSelect={false}
                        icon={<item.icon size="1.2rem" />}
                        label={`Paso ${index + 1}`}
                        description={item.label}
                        loading={index === active}
                      />
                    ))}
                  </Stepper>
                )
              ) : (
                <Flex align="center" justify="center" gap="xs">
                  <IconCancel color="white" size={40} />
                  <Text fw={700}>Este pedido fue marcado como cancelado</Text>
                </Flex>
              )}
            </Paper>

            <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="xs">
              <Paper withBorder radius="md" style={{ height: "77vh", display: "flex", flexDirection: "column" }} p="md">
                <Stack gap="xs">
                  <Group grow>
                    <BackgroundImage h={150} src={orderDetails?.Sucursal?.images?.[0]?.location} radius="md">
                      <Flex
                        p="md"
                        direction="column"
                        justify="space-between"
                        gap={isSmallScreen && 3}
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.45)",
                          height: "100%",
                          borderRadius: "inherit"
                        }}>
                        <Flex direction="column">
                          <Text c="white" size="lg" tt="uppercase" fw={700}>
                            {orderDetails?.Sucursal?.name}
                          </Text>
                          <Text c="white">{orderDetails?.Sucursal?.city + ", " + orderDetails?.Sucursal?.state}</Text>
                        </Flex>
                        <Flex direction={isSmallScreen ? "column" : "row"} gap={isSmallScreen && 3} justify="space-between">
                          <Flex direction="column" gap={3}>
                            <Flex c="white" align="center" gap={2}>
                              {orderDetails?.serviceType === "delivery" ? (
                                <IconMotorbike size="1.1rem" />
                              ) : orderDetails?.serviceType === "onSite" ? (
                                <IconToolsKitchen3 size="1.1rem" />
                              ) : (
                                <IconCar size="1.1rem" />
                              )}
                              <Text c="white" ta="end" size="sm" fw={700}>
                                {orderDetails?.serviceType === "delivery"
                                  ? "Pedido a domicilio"
                                  : orderDetails?.serviceType === "onSite"
                                    ? "Pedido para venta en mesa"
                                    : "Pedido para llevar"}
                              </Text>
                            </Flex>
                            <Flex c="white" align="center" gap={2}>
                              {orderDetails?.paymentMethod === "cash" ? (
                                <IconCash size="1.1rem" />
                              ) : (
                                <IconCreditCard size="1.1rem" />
                              )}
                              <Text c="white" ta="end" size="sm" fw={700}>
                                {orderDetails?.paymentMethod === "cash"
                                  ? `Se ${orderDetails?.status === "delivered" ? "pagó" : "pagará"} en efectivo`
                                  : "Pagado con tarjeta"}
                              </Text>
                            </Flex>
                          </Flex>
                          {orderDetails?.sentToKitchenTimestamp && orderDetails?.finishedCookingTimestamp && (
                            <Flex c="white" align="end" gap={2}>
                              <IconStopwatch size={20} />
                              <Text c="white" size="sm" fw={700}>
                                Preparado en{" "}
                                {calculateTimeDifference(
                                  orderDetails?.sentToKitchenTimestamp,
                                  orderDetails?.finishedCookingTimestamp
                                )}
                              </Text>
                            </Flex>
                          )}
                        </Flex>
                      </Flex>
                    </BackgroundImage>
                  </Group>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={5}>
                      {orderDetails?.isWantedAsSoonAsItIsReady ? <IconFlame size={18} /> : <IconClock size={18} />}
                      <Text size="sm">
                        {orderDetails?.isWantedAsSoonAsItIsReady
                          ? "Pedido para preparar de inmediato"
                          : `Pedido programado para el ${formatTime(orderDetails?.scheduledDate)}`}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <Button
                        style={{ display: orderDetails?.note ? "block" : "none" }}
                        color={colors.main_app_color}
                        radius="md"
                        onClick={() => openModalComment()}>
                        Ver nota
                      </Button>
                    </Flex>
                  </Flex>
                  <ScrollArea style={{ maxHeight: "calc(77vh - 230px)" }}>
                    <SimpleGrid spacing="xs">
                      {orderDetails?.OrderDetails?.map((item, index) => (
                        <DishOrderDetailCard key={index} orderDetails={item} />
                      ))}
                    </SimpleGrid>
                  </ScrollArea>
                </Stack>
              </Paper>
              <Grid grow gutter="xs">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    <UserData
                      title="Datos del cliente"
                      icon={<IconUser size="1.1rem" />}
                      photo={orderDetails?.Order?.User?.photo}
                      name={orderDetails?.Order?.User?.name}
                      email={orderDetails?.Order?.User?.email}
                      userId={orderDetails?.Order?.User?.identityNumber}
                      phoneNumber={orderDetails?.Order?.User?.phoneNumber}
                      address={user?.role === APP_ROLES.kitchenUser ? null : orderDetails?.userAddress?.address}
                      isSmallScreen={isSmallScreen}
                      orderDetails={orderDetails}
                      rtnName={orderDetails?.name}
                      rtn={orderDetails?.rtn}
                    />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    {user?.role !== "kitchen" && orderDetails?.serviceType !== "onSite" ? (
                      <UserData
                        title="Datos del repartidor"
                        icon={<IconHelmet size="1.1rem" />}
                        photo={orderDetails?.driver?.AdminUser?.images?.[0]?.location}
                        name={orderDetails?.driver?.AdminUser?.name}
                        email={orderDetails?.driver?.AdminUser?.email}
                        userId={orderDetails?.driver?.nationalIdentityNumber}
                        phoneNumber={orderDetails?.driver?.AdminUser?.phoneNumber}
                        bikeId={orderDetails?.driver?.motorcycleId}
                        isSmallScreen={isSmallScreen}
                        updatingDriver={updatingDriver}
                        orderDetails={orderDetails}
                      />
                    ) : (
                      <UserData
                        title="Método de servicios"
                        icon={<IconTable size="1.1rem" />}
                        tableNumberAndText={
                          orderDetails?.serviceType === "delivery"
                            ? "Pedido a domicilio"
                            : orderDetails?.serviceType === "onSite"
                              ? `${orderDetails?.tableNumber ? `Servir pedido en mesa ${orderDetails.tableNumber}` : "Pedido para servir en mesa"}`
                              : "Pedido para llevar"
                        }
                      />
                    )}
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    {user?.role !== "kitchen" ? (
                      <Flex direction="column" h="100%">
                        <Stack gap="xs">
                          <Flex align="center" gap={5}>
                            <IconReceipt size="1.1rem" />
                            <Title order={isSmallScreen ? 6 : 5}>Datos de facturación</Title>
                          </Flex>
                          <Divider />
                          <Grid>
                            <Grid.Col span={6}>
                              <Stack gap="xs">
                                <Text size={isSmallScreen ? "xs" : "sm"}>Subtotal</Text>
                                <Text size={isSmallScreen ? "xs" : "sm"}>Descuento</Text>
                                <Text size={isSmallScreen ? "xs" : "sm"}>Precio de envío</Text>
                                <Text size={isSmallScreen ? "xs" : "sm"}>ISV 15%</Text>
                                <Text size={isSmallScreen ? "xs" : "sm"}>ISV 18%</Text>
                                <Space />
                                <Text size={isSmallScreen ? "xs" : "sm"}>Total</Text>
                              </Stack>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Stack gap="xs">
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  {getFormattedHNL(orderDetails?.subtotal)}
                                </Text>
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  {getFormattedHNL(orderDetails?.discount)}
                                </Text>
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  {getFormattedHNL(orderDetails?.shippingPrice)}
                                </Text>
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  {getFormattedHNL(orderDetails?.isv15)}
                                </Text>
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  {getFormattedHNL(orderDetails?.isv18)}
                                </Text>
                                <Divider />
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  {getFormattedHNL(orderDetails?.total)}
                                </Text>
                              </Stack>
                            </Grid.Col>
                          </Grid>
                        </Stack>

                        <Button mt="auto" py="xs" color={colors.main_app_color} onClick={() => openBillModal()}>
                          Ver factura detallada
                        </Button>
                      </Flex>
                    ) : (
                      <UserData
                        title="Estado del pedido"
                        icon={<IconBox size="1.1rem" />}
                        tableNumberAndText={
                          orderStates.delivery.find((state) => state.value === orderDetails?.status)?.label ?? "Sin confirmar"
                        }
                      />
                    )}
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    {user?.role !== "kitchen" ? (
                      <Stack gap="xs" h="100%">
                        <Flex align="center" gap={5}>
                          <IconBrandRedux size="1.1rem" />
                          <Title order={isSmallScreen ? 6 : 5}>Acciones del pedido</Title>
                        </Flex>
                        <Divider />
                        <Flex direction="column" justify="center" align="center" style={{ flexGrow: 1 }} gap="xs">
                          <>
                            {orderDetails?.status === orderStatusValues.onHold ? (
                              user.role === APP_ROLES.branchAdmin ||
                              user.role === APP_ROLES.cashierUser ||
                              user.role === APP_ROLES.restaurantAdmin ? (
                                <>
                                  <Button
                                    fullWidth
                                    loading={updatingOrderStatus}
                                    color={colors.main_app_color}
                                    //onClick={() => dispatch(confirmOrder(orderId))}
                                    onClick={() => {
                                      openModal()
                                      setSelectedAction("confirmOrder")
                                    }}
                                    radius="md"
                                    size={isSmallScreen ? "xs" : "sm"}>
                                    Confirmar pedido
                                  </Button>
                                </>
                              ) : (
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  El pedido ahora está en cocina
                                </Text>
                              )
                            ) : orderDetails?.status === orderStatusValues.confirmed ? (
                              <Button
                                fullWidth
                                color={colors.main_app_color}
                                loading={updatingOrderStatus}
                                radius="md"
                                disabled={!isAvailable}
                                onClick={() => {
                                  openModal()
                                  setSelectedAction("markOrderAsPrepared")
                                }}>
                                {isScheduled && !isAvailable ? (
                                  <Countdown
                                    scheduledDate={orderDetails?.scheduledDate}
                                    onExpire={() => markReady(orderDetails?.id)}
                                  />
                                ) : (
                                  "Marcar como preparado"
                                )}
                              </Button>
                            ) : orderDetails?.serviceType === orderDeliveryTypes.delivery &&
                              orderDetails?.status === orderStatusValues.ready ? (
                              user.role === APP_ROLES.restaurantAdmin ||
                              user.role === APP_ROLES.branchAdmin ||
                              user.role === APP_ROLES.cashierUser ? (
                                <Button
                                  fullWidth
                                  onClick={() => {
                                    open()
                                    dispatch(fetchDrivers(orderDetails?.sucursalId))
                                  }}
                                  color={colors.main_app_color}
                                  radius="md"
                                  size={isSmallScreen ? "xs" : "sm"}>
                                  Asignar repartidor
                                </Button>
                              ) : (
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  El pedido lo tiene el administrador
                                </Text>
                              )
                            ) : orderDetails?.status === orderStatusValues.readyForCustomer ? (
                              user.role === APP_ROLES.restaurantAdmin ||
                              user.role === APP_ROLES.branchAdmin ||
                              user.role === APP_ROLES.cashierUser ? (
                                <Button
                                  fullWidth
                                  loading={updatingOrderStatus}
                                  color={colors.main_app_color}
                                  //onClick={() => dispatch(markOrderDelivered(orderId))}
                                  onClick={() => {
                                    openModal()
                                    setSelectedAction("markOrderDelivered")
                                  }}
                                  radius="md">
                                  Marcar como entregado
                                </Button>
                              ) : (
                                <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                  No hay acciones pendientes
                                </Text>
                              )
                            ) : orderDetails?.status === orderStatusValues.delivered ||
                              orderDetails?.status === orderStatusValues.canceled ? (
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                No hay acciones pendientes
                              </Text>
                            ) : null}

                            {orderDetails?.status !== orderStatusValues.delivered &&
                              orderDetails?.status !== orderStatusValues.onDelivery &&
                              orderDetails?.status !== orderStatusValues.canceled && (
                                <Button
                                  fullWidth
                                  loading={cancelOrderStatus}
                                  color={colors.main_app_color}
                                  variant="outline"
                                  //onClick={() => dispatch(cancelOrder(orderId))}
                                  onClick={() => {
                                    openModal()
                                    setSelectedAction("cancelOrder")
                                  }}
                                  radius="md"
                                  size={isSmallScreen ? "xs" : "sm"}>
                                  Cancelar pedido
                                </Button>
                              )}
                          </>
                        </Flex>
                      </Stack>
                    ) : (
                      <UserData
                        title="Tiempo de preparación"
                        icon={<IconStopwatch size="1.1rem" />}
                        tableNumberAndText={
                          orderDetails?.finishedCookingTimestamp === null
                            ? "El pedido no ha sido preparado"
                            : calculateTimeDifference(
                                orderDetails?.sentToKitchenTimestamp,
                                orderDetails?.finishedCookingTimestamp
                              )
                        }
                      />
                    )}
                  </Paper>
                </Grid.Col>
              </Grid>
            </SimpleGrid>
          </Stack>

          <ConfirmationModal
            opened={openedModal}
            close={closeModal}
            title={`¿Estás seguro que deseas ${selectedAction === "cancelOrder" ? "cancelar" : "actualizar"} el pedido?`}
            description={`El pedido ${selectedAction === "cancelOrder" ? "será cancelado" : "pasará al siguiente estado"} y se le notificará al cliente`}
            onConfirm={() => {
              if (selectedAction === "confirmOrder") {
                dispatch(confirmOrder(orderId))
              } else if (selectedAction === "markOrderAsPrepared") {
                dispatch(updateOrderStatus(orderId))
              } else if (selectedAction === "markOrderDelivered") {
                dispatch(markOrderDelivered(orderId))
              } else if (selectedAction === "cancelOrder") {
                dispatch(cancelOrder(orderId))
              }
            }}
          />

          <ModalLayout
            opened={opened}
            onClose={() => {
              close()
              setDriver(null)
            }}
            title="Lista de repartidores disponibles">
            <Stack gap={5}>
              {loadingDrivers ? (
                Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} radius="md" h={70} />)
              ) : drivers && drivers.length > 0 ? (
                drivers.map((driverItem) => (
                  <Card key={driverItem.driverId} radius="md">
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap="xs">
                        <Avatar
                          src={driverItem?.AdminUser?.images?.[0]?.location}
                          alt="it's me"
                          name={driverItem?.AdminUser?.name
                            ?.split(" ")
                            .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                            .map((word) => word.charAt(0))
                            .join("")
                            .toUpperCase()}
                        />
                        <Text size="sm" fw={500}>
                          {driverItem?.AdminUser?.name}
                        </Text>
                      </Flex>
                      <MantineProvider theme={theme}>
                        <Checkbox
                          color={colors.main_app_color}
                          checked={driver === driverItem.driverId}
                          onChange={() => setDriver(driverItem.driverId)}
                        />
                      </MantineProvider>
                    </Flex>
                  </Card>
                ))
              ) : (
                <Text my="xl" size="sm" c="dimmed" align="center">
                  No hay repartidores disponibles
                </Text>
              )}

              <Button
                style={{ display: loadingDrivers ? "none" : "block" }}
                disabled={!driver}
                color={colors.main_app_color}
                loading={updatingOrderStatus}
                fullWidth
                onClick={() => {
                  dispatch(assignDriver({ driverId: driver, suborderId: orderId })).then((response) => {
                    response.payload && close()
                  })
                  setDriver(null)
                }}>
                Seleccionar
              </Button>
            </Stack>
          </ModalLayout>

          <ModalLayout
            opened={openedComments}
            onClose={() => {
              closeModalComment()
            }}
            title="Nota del pedido">
            <Paper withBorder radius="md" p="sm">
              <Group>
                <Flex align="center">
                  <Text fz="sm">{orderDetails?.Order?.User?.name + " comentó:"}</Text>
                </Flex>
              </Group>
              <Text c="dimmed" pt="xs" size="sm">
                {orderDetails?.note}
              </Text>
            </Paper>
          </ModalLayout>

          <ModalLayout opened={openedBill} onClose={closeBillModal} title="Detalle de factura" size="lg">
            <Paper p="md" withBorder radius="md">
              <Stack>
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    rowGap: 8,
                    columnGap: 16
                  }}>
                  {billsData(orderDetails).map(([label, value]) => (
                    <React.Fragment key={label}>
                      <Text size="sm">{label}</Text>
                      <Text size="sm" c="dimmed" ta="left">
                        {value}
                      </Text>
                    </React.Fragment>
                  ))}
                </Box>

                <Card withBorder radius="md" p="xs">
                  <Box
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center"
                    }}>
                    <Text size="sm" fw={600}>
                      Total
                    </Text>
                    <Text size="sm" fw={600} ta="left">
                      {getFormattedHNL(orderDetails?.total)}
                    </Text>
                  </Box>
                </Card>
              </Stack>
            </Paper>
          </ModalLayout>
        </>
      )}
    </>
  )
}
