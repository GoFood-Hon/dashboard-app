/* eslint-disable indent */
import {
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Stepper,
  Text,
  Title,
  Button,
  Loader
} from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getFormattedHNL } from "../../utils"
import { APP_ROLES, orderDeliveryTypes, orderStates, orderStatusValues } from "../../utils/constants"
import { DishOrderDetailCard } from "./DishOrderDetailCard"
import { useSelector } from "react-redux"
import { IconCircleCheck } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { IconCancel } from "@tabler/icons-react"
import BackButton from "../Dishes/components/BackButton"
import { useDispatch } from "react-redux"
import {
  cancelOrder,
  confirmOrder,
  fetchOrderDetails,
  markOrderDelivered,
  updateOrderStatus
} from "../../store/features/ordersSlice"

export const OrderDetails = () => {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [driver, setDriver] = useState(null)
  const [driverList, setDriverList] = useState([])
  const { orderDetails, loadingDetails, updatingOrderStatus, cancelOrderStatus } = useSelector((state) => state.orders)

  // Función para obtener el step inicial basado en serviceType y status
  const getInitialStep = () => {
    const serviceSteps = orderStates[orderDetails?.serviceType] || []
    const matchingStep = serviceSteps.find((step) => step.value === orderDetails.status)
    return matchingStep ? matchingStep.step : 0 // Default a 1 si no se encuentra
  }
  const [active, setActive] = useState(getInitialStep)

  useEffect(() => {
    console.log(orderDetails)
    setActive(getInitialStep())
  }, [orderDetails])

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId))
  }, [])

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
              <BackButton title="Vista detalla del pedido" show />
            </Flex>
          </Group>

          <Stack gap="md">
            <Paper withBorder p="md" radius="md" bg={orderDetails?.status === "canceled" ? "red" : ""}>
              {orderDetails?.status !== "canceled" ? (
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
                      loading={false}
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

            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper withBorder radius="md" p="md">
                  <Stack gap="sm">
                    <Title order={4}>Lista de productos</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                      {orderDetails?.OrderDetails?.map((item, index) => (
                        <DishOrderDetailCard key={index} orderDetails={item} />
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper withBorder radius="md" p="md">
                  <Stack gap="sm">
                    <Title order={4}>Detalles de facturación</Title>
                    <Divider />
                    <Grid>
                      <Grid.Col span={{ base: 12, md: "auto" }}>
                        <Flex direction="column">
                          <Stack gap="md">
                            <Text>Subtotal</Text>
                            <Text>Descuento</Text>
                            <Text>Precio de envío</Text>
                            <Text>ISV ( 15% )</Text>
                            <Space />
                            <Text>Total</Text>
                          </Stack>
                        </Flex>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: "auto" }}>
                        <Flex direction="column">
                          <Stack gap="md">
                            <Text c="dimmed">+ {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.subtotal)}</Text>
                            <Text c="dimmed">- {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.discount)}</Text>
                            <Text c="dimmed">+ {orderDetails?.shippingPrice}</Text>
                            <Text c="dimmed">+ {getFormattedHNL(orderDetails?.isv)}</Text>
                            <Divider />
                            <Text c="dimmed">{getFormattedHNL(orderDetails?.total)}</Text>
                          </Stack>
                        </Flex>
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col>
                {/* Botones que realizan las acciones de actualización del pedido */}
                {orderDetails?.status === orderStatusValues.onHold &&
                (user.role === APP_ROLES.branchAdmin ||
                  user.role === APP_ROLES.cashierUser ||
                  user.role === APP_ROLES.restaurantAdmin) ? (
                  <Flex justify="end" gap="sm">
                    <Button
                      loading={cancelOrderStatus}
                      color={colors.main_app_color}
                      variant="outline"
                      onClick={() => dispatch(cancelOrder(orderId))}>
                      Cancelar pedido
                    </Button>
                    <Button
                      loading={updatingOrderStatus}
                      color={colors.main_app_color}
                      onClick={() => dispatch(confirmOrder(orderId))}>
                      Confirmar pedido
                    </Button>
                  </Flex>
                ) : (
                  orderDetails?.status === orderStatusValues.confirmed && user.role === APP_ROLES.kitchenUser
                )}
                {(orderDetails?.status === orderStatusValues.confirmed) & (user.role === APP_ROLES.kitchenUser) ? (
                  <Flex justify="end">
                    <Button
                      loading={updatingOrderStatus}
                      color={colors.main_app_color}
                      onClick={() => orderId && dispatch(updateOrderStatus(orderId))}>
                      Marcar como preparado
                    </Button>
                  </Flex>
                ) : null}

                {orderDetails?.serviceType === orderDeliveryTypes.delivery &&
                (user.role === APP_ROLES.restaurantAdmin ||
                  user.role === APP_ROLES.branchAdmin ||
                  user.role === APP_ROLES.cashierUser) &&
                orderDetails?.status === orderStatusValues.ready ? (
                  <div className="w-full rounded-md mt-4">
                    <div className="my-4 flex flex-col gap-4">
                      <Select
                        placeholder="Seleccione motorista"
                        data={driverList}
                        allowDeselect={false}
                        value={driver}
                        onChange={setDriver}
                        searchable
                        nothingFoundMessage="No se encontraron motoristas"
                      />
                      <Button loading={updatingOrderStatus} onClick={confirmDriver} color={colors.main_app_color}>
                        Asignar motorista
                      </Button>
                    </div>
                  </div>
                ) : orderDetails?.status === orderStatusValues.readyForCustomer &&
                  (user.role === APP_ROLES.restaurantAdmin || user.role === APP_ROLES.branchAdmin) ? (
                  <Flex justify="end">
                    <Button
                      loading={updatingOrderStatus}
                      color={colors.main_app_color}
                      onClick={() => orderId && dispatch(markOrderDelivered(orderId))}>
                      Marcar como entregado
                    </Button>
                  </Flex>
                ) : null}
              </Grid.Col>
            </Grid>
          </Stack>
        </>
      )}
    </>
  )
}
