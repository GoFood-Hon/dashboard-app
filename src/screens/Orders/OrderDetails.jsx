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
  Loader,
  Modal,
  Avatar,
  ScrollArea,
  Checkbox,
  Card,
  MantineProvider,
  BackgroundImage,
  Skeleton
} from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getFormattedHNL } from "../../utils"
import {
  APP_ROLES,
  orderDeliveryTypes,
  orderStates,
  orderStatusValues,
  PRIMARY_COL_HEIGHT,
  SECONDARY_COL_HEIGHT,
  theme
} from "../../utils/constants"
import { DishOrderDetailCard } from "./DishOrderDetailCard"
import { useSelector } from "react-redux"
import { IconCircleCheck } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { IconCancel } from "@tabler/icons-react"
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
import { IconHelmet } from "@tabler/icons-react"
import { IconUser } from "@tabler/icons-react"
import { IconShoppingCart } from "@tabler/icons-react"
import { IconMail } from "@tabler/icons-react"
import { IconPhone } from "@tabler/icons-react"
import { IconMapPin } from "@tabler/icons-react"
import { IconReceipt } from "@tabler/icons-react"
import { IconBrandRedux } from "@tabler/icons-react"
import { IconId } from "@tabler/icons-react"
import ConfirmationModal from "../ConfirmationModal"

export const OrderDetails = () => {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [driver, setDriver] = useState(null)
  const { orderDetails, loadingDetails, updatingOrderStatus, cancelOrderStatus, loadingDrivers, drivers, updatingDriver } =
    useSelector((state) => state.orders)
  const [opened, { open, close }] = useDisclosure(false)
  const [openedModal, { openModal, closeModal }] = useDisclosure(false)
  const isMediumScreen = useMediaQuery("(max-width: 1140px)")
  const isSmallScreen = useMediaQuery("(max-width: 760px)")
  const getInitialStep = () => {
    const serviceSteps = orderStates[orderDetails?.serviceType] || []
    const matchingStep = serviceSteps.find((step) => step.value === orderDetails.status)
    return matchingStep ? matchingStep.step : 0
  }
  const [active, setActive] = useState(getInitialStep)

  useEffect(() => {
    setActive(getInitialStep())
  }, [orderDetails])

  useEffect(() => {
    console.log(orderDetails)
    dispatch(fetchOrderDetails(orderId))
  }, [])

  const UserData = ({ title, photo, name, email, phoneNumber, address, bikeId }) => (
    <Stack h="100%" gap="sm">
      <Flex align="center" gap={5}>
        {title.includes("repartidor") ? <IconHelmet size="1.1rem" /> : <IconUser size="1.1rem" />}
        <Title order={isSmallScreen ? 6 : 5}>{title}</Title>
      </Flex>
      <Divider />
      {name ? (
        <>
          <Flex align="center" gap="sm">
            <Avatar
              src={photo}
              alt="it's me"
              name={name
                ?.split(" ")
                .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                .map((palabra) => palabra.charAt(0))
                .join("")
                .toUpperCase()}
            />
            <Text c="dimmed" size="sm">
              {name}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            <IconMail size="1.1rem" />
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {email}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            <IconPhone size="1.1rem" />
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {phoneNumber}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            {bikeId ? <IconId size="1.1rem" /> : <IconMapPin size="1.1rem" />}
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {bikeId ? bikeId : address || "No se proporcionó"}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex direction="column" justify="center" align="center" style={{ flexGrow: 1 }} gap="sm">
          {updatingDriver ? (
            <Loader color={colors.main_app_color} />
          ) : (
            <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
              {orderDetails?.serviceType === "delivery"
                ? orderDetails?.status === "canceled"
                  ? "No fue posible asignar un repartidor"
                  : "No se ha asignado un repartidor"
                : "No aplica para este pedido"}
            </Text>
          )}
        </Flex>
      )}
    </Stack>
  )

  return (
    <>
      {loadingDetails ? (
        <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
          <Loader color={colors.main_app_color} />
        </div>
      ) : (
        <>
          <Group grow className="mb-2">
            <Flex align="center" justify="space-between">
              <BackButton title="Vista detallada del pedido" show />
            </Flex>
          </Group>

          <Stack gap="md">
            <Paper withBorder p="md" radius="md" bg={orderDetails?.status === "canceled" ? "red" : ""}>
              {orderDetails?.status !== "canceled" ? (
                <Stepper
                  active={active}
                  color={colors.main_app_color}
                  size={isSmallScreen ? "xs" : "sm"}
                  onStepClick={setActive}
                  allowNextStepsSelect={false}
                  completedIcon={<IconCircleCheck size="1.8rem" />}
                  //orientation={isMediumScreen ? "vertical" : "horizontal"}
                >
                  {orderStates[orderDetails?.serviceType]?.map((item, index) => (
                    <Stepper.Step
                      key={index}
                      icon={<item.icon size="1.2rem" />}
                      label={`Paso ${index + 1}`}
                      description={item.label}
                    />
                  ))}
                </Stepper>
              ) : (
                <Flex align="center" justify="center" gap="xs">
                  <IconCancel color="white" size={40} />
                  <Text fw={700} color="white">
                    Este pedido fue marcado como cancelado
                  </Text>
                </Flex>
              )}
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Paper withBorder radius="md" h={PRIMARY_COL_HEIGHT} p="md">
                <Stack gap="sm">
                  <Group grow>
                    <BackgroundImage h={150} src={orderDetails?.Sucursal?.images?.[0]?.location} radius="md">
                      <Flex
                        p="md"
                        direction="column"
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          height: "100%",
                          borderRadius: "inherit"
                        }}>
                        <Text c="white" size="lg" tt="uppercase" fw={700}>
                          {orderDetails?.Sucursal?.name}
                        </Text>
                        <Text c="white">{orderDetails?.Sucursal?.city + ", " + orderDetails?.Sucursal?.state}</Text>
                      </Flex>
                    </BackgroundImage>
                  </Group>
                  <Flex align="center" gap={5}>
                    <IconShoppingCart size="1.1rem" />
                    <Title order={5}>Lista de productos</Title>
                  </Flex>
                  <ScrollArea h={"280px"}>
                    <SimpleGrid spacing="xs">
                      {orderDetails?.OrderDetails?.map((item, index) => (
                        <DishOrderDetailCard key={index} orderDetails={item} />
                      ))}
                    </SimpleGrid>
                  </ScrollArea>
                </Stack>
              </Paper>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    <UserData
                      title="Datos del cliente"
                      photo={orderDetails?.Order?.User?.photo}
                      name={orderDetails?.Order?.User?.name}
                      email={orderDetails?.Order?.User?.email}
                      phoneNumber={orderDetails?.Order?.User?.phoneNumber}
                      address={orderDetails?.Order?.User?.address}
                    />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    <UserData
                      title="Datos del repartidor"
                      photo={orderDetails?.driver?.AdminUser?.images?.[0]?.location}
                      name={orderDetails?.driver?.AdminUser?.name}
                      email={orderDetails?.driver?.AdminUser?.email}
                      phoneNumber={orderDetails?.driver?.AdminUser?.phoneNumber}
                      bikeId={orderDetails?.driver?.motorcycleId}
                    />
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    <Stack gap="xs">
                      <Flex align="center" gap={5}>
                        <IconReceipt size="1.1rem" />
                        <Title order={isSmallScreen ? 6 : 5}>Datos de facturación</Title>
                      </Flex>
                      <Divider />
                      <Grid>
                        <Grid.Col span={6}>
                          <Flex direction="column">
                            <Stack gap="xs">
                              <Text size={isSmallScreen ? "xs" : "sm"}>Subtotal</Text>
                              <Text size={isSmallScreen ? "xs" : "sm"}>Descuento</Text>
                              <Text size={isSmallScreen ? "xs" : "sm"}>Precio de envío</Text>
                              <Text size={isSmallScreen ? "xs" : "sm"}>ISV ( 15% )</Text>
                              <Space />
                              <Text size={isSmallScreen ? "xs" : "sm"}>Total</Text>
                            </Stack>
                          </Flex>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Flex direction="column">
                            <Stack gap="xs">
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                {getFormattedHNL(orderDetails?.subtotal)}
                              </Text>
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                {getFormattedHNL(orderDetails?.discount)}
                              </Text>
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                {orderDetails?.shippingPrice}
                              </Text>
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                {getFormattedHNL(orderDetails?.isv)}
                              </Text>
                              <Divider />
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                {getFormattedHNL(orderDetails?.total)}
                              </Text>
                            </Stack>
                          </Flex>
                        </Grid.Col>
                      </Grid>
                    </Stack>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder radius="md" h={SECONDARY_COL_HEIGHT} p="md">
                    <Stack gap="xs" h="100%">
                      <Flex align="center" gap={5}>
                        <IconBrandRedux size="1.1rem" />
                        <Title order={isSmallScreen ? 6 : 5}>Acciones del pedido</Title>
                      </Flex>
                      <Divider />
                      <Flex direction="column" justify="center" align="center" style={{ flexGrow: 1 }} gap="sm">
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
                                  onClick={() => dispatch(confirmOrder(orderId))}
                                  radius="md"
                                  size={isSmallScreen ? "xs" : "sm"}>
                                  Confirmar pedido
                                </Button>
                                <Button
                                  fullWidth
                                  loading={cancelOrderStatus}
                                  color={colors.main_app_color}
                                  variant="outline"
                                  onClick={() => dispatch(cancelOrder(orderId))}
                                  radius="md"
                                  size={isSmallScreen ? "xs" : "sm"}>
                                  Cancelar pedido
                                </Button>
                              </>
                            ) : (
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                El pedido ahora está en cocina
                              </Text>
                            )
                          ) : orderDetails?.status === orderStatusValues.confirmed ? (
                            user.role === APP_ROLES.kitchenUser ? (
                              <Button
                                fullWidth
                                loading={updatingOrderStatus}
                                color={colors.main_app_color}
                                onClick={() => orderId && dispatch(updateOrderStatus(orderId))}
                                radius="md"
                                size={isSmallScreen ? "xs" : "sm"}>
                                Marcar como preparado
                              </Button>
                            ) : (
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                El pedido ahora está en cocina
                              </Text>
                            )
                          ) : orderDetails?.serviceType === orderDeliveryTypes.delivery &&
                            orderDetails?.status === orderStatusValues.ready ? (
                            user.role === APP_ROLES.restaurantAdmin ||
                            user.role === APP_ROLES.branchAdmin ||
                            user.role === APP_ROLES.cashierUser ? (
                              <Button
                                fullWidth
                                onClick={() => {
                                  open()
                                  if (!drivers || drivers.length === 0) {
                                    dispatch(fetchDrivers(orderDetails?.sucursalId))
                                  }
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
                            user.role === APP_ROLES.restaurantAdmin || user.role === APP_ROLES.branchAdmin ? (
                              <Button
                                fullWidth
                                loading={updatingOrderStatus}
                                color={colors.main_app_color}
                                onClick={() => orderId && dispatch(markOrderDelivered(orderId))}
                                radius="md">
                                Marcar como entregado
                              </Button>
                            ) : (
                              <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                                No hay acciones pendientes
                              </Text>
                            )
                          ) : (
                            <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
                              No hay acciones pendientes
                            </Text>
                          )}
                        </>
                      </Flex>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </SimpleGrid>
          </Stack>

          <ConfirmationModal
            opened={openedModal}
            close={closeModal}
            title="¿Estás seguro que deseas actualiza?"
            description="El tag se quitará de todos los platillos a los que esté asociado"
            onConfirm={() => handleDeleteTag(tagId)}
          />

          <Modal
            opened={opened}
            onClose={() => {
              close()
              setDriver(null)
            }}
            title="Lista de repartidores disponibles"
            centered
            radius="md">
            <Stack>
              {loadingDrivers ? (
                Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} radius="md" h={70} />)
              ) : drivers && drivers.length > 0 ? (
                drivers.map((driverItem) => (
                  <Card key={driverItem.driverId} radius="md">
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap="xs">
                        <Avatar
                          src={driverItem?.AdminUser?.photo}
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
                disabled={!driver}
                color={colors.main_app_color}
                loading={updatingOrderStatus}
                fullWidth
                onClick={() =>
                  dispatch(assignDriver({ driverId: driver, suborderId: orderId })).then((response) => {
                    response.payload && close()
                  })
                }>
                Seleccionar
              </Button>
            </Stack>
          </Modal>
        </>
      )}
    </>
  )
}
