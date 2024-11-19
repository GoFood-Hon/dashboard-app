/* eslint-disable indent */
import {
  Avatar,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Stepper,
  Text,
  Title,
  Button,
  Container
} from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useDisclosure } from "@mantine/hooks"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"
//import Button from "../../components/Button"
import orderApi from "../../api/orderApi"
import { APP_ROLES, orderDeliveryTypes, orderStates, orderStatusValues } from "../../utils/constants"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { DishOrderDetailCard } from "./DishOrderDetailCard"
import { useSelector } from "react-redux"
import { IconCircleCheck } from "@tabler/icons-react"
import { IconUserCheck } from "@tabler/icons-react"
import { IconMailOpened } from "@tabler/icons-react"
import { IconShieldCheck } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { IconCancel } from "@tabler/icons-react"
import BackButton from "../Dishes/components/BackButton"
import { useDispatch } from "react-redux"
import { fetchOrderDetails } from "../../store/features/ordersSlice"

export const OrderDetails = () => {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate()
  const [orderDetailModalOpened, { open: openOrderDetailsModal, close: closeOrderDetailModal }] = useDisclosure(false)
  //const [orderDetails, setOrderDetails] = useState({})
  const [driver, setDriver] = useState(null)
  const [driverList, setDriverList] = useState([])
  const { orderDetails } = useSelector((state) => state.orders)

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
    // ;(async () => {
    //   try {
    //     const response = await orderApi.getOrderDetails(orderId)
    //     setOrderDetails(response?.data)

    //     if (user.role === APP_ROLES.restaurantAdmin) {
    //       let sucursalId = 0
    //       sucursalId = response?.data?.sucursalId

    //       const driversResponseRequest = await orderApi.getDrivers(sucursalId)

    //       const newDriverList = driversResponseRequest?.data?.map((item) => ({
    //         label: item.AdminUser.name,
    //         value: item.driverId
    //       }))

    //       setDriverList(newDriverList)

    //       if (response?.status !== "success") {
    //         toast.error(`Fallo al obtener la información de la orden. ${response.message}`, {
    //           duration: 7000
    //         })
    //       }
    //     }
    //   } catch (error) {
    //     toast.error(`Error. Por favor intente de nuevo. ${error.message}`, {
    //       duration: 7000
    //     })
    //   }
    // })()
  }, [])

  const confirmOrder = async () => {
    const response = await orderApi.confirmOrder(orderId)
    if (response?.status === "success") {
      toast.success("Pedido confirmado!")
      navigate(NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path)
    } else {
      toast.error("Hubo un error confirmando el pedido, por favor intente de nuevo.")
    }
  }

  const cancelOrder = async () => {
    try {
      const response = await orderApi.cancelOrder(orderId)
      if (response?.status === "success") {
        toast.success("Orden cancelada exitosamente")
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path)
      } else {
        toast.error("Hubo un error cancelando la orden")
      }
    } catch (error) {
      toast.error("Fallo al cancelar la orden, ", error)
    }
  }

  const orderReady = async () => {
    try {
      const response = await orderApi.updateOrderStatus(orderId)
      if (response?.status === "success") {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path)
        toast.success("Orden lista!")
      } else {
        toast.error("Hubo un error en la orden.")
      }
    } catch (error) {
      toast.error("Fallo la solicitud, ", error)
    }
  }

  const confirmDriver = async () => {
    try {
      const formData = new FormData()
      formData.append("driverId", driver)
      formData.append("suborderId", orderId)

      const response = await orderApi.assignDriver(formData)

      if (response?.status === "success") {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path)
        toast.success("Orden enviada al conductor!")
      } else {
        toast.error(`Hubo un error en la orden. ${response.message}`)
      }
    } catch (error) {
      toast.error(`Fallo la confirmación del motorista, por favor intente nuevamente. ${error}`)
    }
  }

  const confirmDelivery = async () => {
    try {
      const response = await orderApi.markOrderDelivered(orderId)
      if (response?.status === "success") {
        toast.success("Orden marcada como entregada!")
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path)
      } else {
        toast.error(`Hubo un error en la orden. ${response.message}`)
      }
    } catch (error) {
      toast.error(`Fallo confirmar el pedido como entregado, intente nuevamente. ${error}`)
    }
  }

  return (
    <Container fluid>
      <Group grow className="mb-2">
        <Flex align="center" justify="space-between">
          <BackButton title="Vista detalla del pedido" show />
        </Flex>
      </Group>

      <Stack gap="sm">
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
                <Button color={colors.main_app_color} variant="outline" onClick={() => cancelOrder()}>
                  Cancelar pedido
                </Button>
                <Button color={colors.main_app_color} onClick={() => dispatch(confirmOrder({ id: orderId }))}>
                  Confirmar pedido
                </Button>
              </Flex>
            ) : (
              orderDetails?.status === orderStatusValues.confirmed && user.role === APP_ROLES.kitchenUser
            )}
            {(orderDetails?.status === orderStatusValues.confirmed) & (user.role === APP_ROLES.kitchenUser) ? (
              <Flex justify="end">
                <Button color={colors.main_app_color} onClick={() => orderReady()}>
                  Marcar pedido preparado
                </Button>
              </Flex>
            ) : null}

            {orderDetails?.Order?.type === orderDeliveryTypes.delivery &&
            (user.role === APP_ROLES.restaurantAdmin ||
              user.role === APP_ROLES.branchAdmin ||
              user.role === APP_ROLES.cashierUser) &&
            orderDetails?.status === orderStatusValues.ready ? (
              <div className="w-full rounded-md p-5 mt-4">
                <span>Seleccionar motorista</span>
                <div className="w-full mt-4" />
                <div className="my-4 flex flex-col gap-4">
                  <Select
                    placeholder="Seleccione motorista"
                    data={driverList}
                    allowDeselect={false}
                    size="md"
                    value={driver}
                    onChange={setDriver}
                    searchable
                    nothingFoundMessage="No se ha encontrado"
                  />
                  <Button
                    text={"Confirmar motorista"}
                    onClick={confirmDriver}
                    className={"text-md px-3 py-2 text-white bg-primary_button font-bold"}
                  />
                </div>
              </div>
            ) : orderDetails?.status === orderStatusValues.readyForCustomer ? (
              <Flex justify="end">
                <Button color={colors.main_app_color} onClick={() => confirmDelivery()}>
                  Marcar como entregado
                </Button>
              </Flex>
            ) : null}
          </Grid.Col>
        </Grid>
      </Stack>

      {/* <section>

        <Grid grow gutter="sm">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <div className="w-full h-full rounded-md p-5">
              <Grid>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm leading-normal">Pedido</span>
                    <span className="text-sm  font-bold leading-normal">{`#${orderDetails?.id}`}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sm  font-medium leading-normal">Estado</span>
                    <span className="text-sm  font-bold leading-normal">{orderDetails?.status}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sm  font-medium leading-normal">Tipo</span>
                    <span className="text-sm  font-bold leading-normal">{orderDetails?.Order?.type}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sm  font-medium leading-normal">Fecha</span>
                    <span className="text-sm  font-bold leading-normal">{formatDateDistanceToNow(orderDetails?.createdAt)}</span>
                  </div>
                </Grid.Col>
              </Grid>

              <Grid pt="xl">
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-normal">Total compra</span>
                    <span className="text-sm font-bold leading-normal">{getFormattedHNL(orderDetails?.total)}</span>
                  </div>
                </Grid.Col>
              </Grid>

          

              {orderDetails?.OrderDetails?.map((item, index) => (
                <DishOrderDetailCard key={index} orderDetails={item} />
              ))}

            

              <Grid pt="lg">
                
                <Grid.Col span={{ base: 12, md: 3 }} />

                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sm py-2 font-normal leading-normal">Subtotal</span>
                    <span className="text-sm py-2 font-normal leading-normal">Descuento</span>
                    <span className="text-sm py-2 font-normal leading-normal">Precio de envío</span>
                    <span className="text-sm py-2 font-normal leading-normal">ISV ( 15% )</span>
                    <div className="w-full " />
                    <span className="text-sm pt-4 font-normal leading-normal">Total</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sm py-2 font-normal leading-normal">
                      + {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.subtotal)}
                    </span>
                    <span className="text-sm py-2 font-normal leading-normal">
                      - {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.discount)}
                    </span>
                    <span className="text-sm py-2 font-normal leading-normal">+ {orderDetails?.shippingPrice}</span>
                    <span className="text-sm py-2 font-normal leading-normal">+ {getFormattedHNL(orderDetails?.isv)}</span>
                    <div className="w-full border border-blue-100" />
                    <span className="text-sm pt-4 font-normal leading-normal">{getFormattedHNL(orderDetails?.total)}</span>
                  </div>
                </Grid.Col>
              </Grid>
              
            </div>
          </Grid.Col>
          
          <Grid.Col span={4}>
            {orderDetails?.status === orderStatusValues.onHold &&
            (user.role === APP_ROLES.branchAdmin ||
              user.role === APP_ROLES.cashierUser ||
              user.role === APP_ROLES.restaurantAdmin) ? (
              <>
                <Button
                  type="submit"
                  text={"Confirmar pedido"}
                  onClick={() => confirmOrder()}
                  className={"text-white text-md px-3 py-2 mb-4 bg-primary_button  font-bold"}
                />
                <Button
                  text={"Cancelar pedido"}
                  onClick={() => cancelOrder()}
                  className={"text-md px-3 py-2 mb-4 text-white bg-red-500 font-bold"}
                />
              </>
            ) : (
              orderDetails?.status === orderStatusValues.confirmed && user.role === APP_ROLES.kitchenUser
            )}
            {(orderDetails?.status === orderStatusValues.confirmed) & (user.role === APP_ROLES.kitchenUser) ? (
              <Button
                type="submit"
                text={"Marcar pedido como listo"}
                onClick={() => orderReady()}
                className={"text-white text-md px-3 py-2 mb-4 bg-green-700  font-bold"}
              />
            ) : null}
            <div className="w-full rounded-md p-5">
              <span>Cliente</span>
              <div className="w-full mt-4" />
              <div className="my-4 flex flex-row">
                <Avatar size="lg" />
                <div className="flex flex-col text-sm justify-center pl-2">
                  <span>{orderDetails?.Order?.User?.name}</span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="text-sm font-normal mt-2">{orderDetails?.Order?.User?.phoneNumber}</div>
              </div>

              <div className="flex flex-col mt-4">
                <div className="text-base font-semibold mb-2">Dirección envío</div>
                <div className="text-sm py-2 font-normal leading-normal">
                  {orderDetails?.Order?.User?.UserAddress || "Dirección no disponible "}
                </div>
              </div>
            </div>

            {orderDetails?.Order?.type === orderDeliveryTypes.delivery &&
            (user.role === APP_ROLES.restaurantAdmin ||
              user.role === APP_ROLES.branchAdmin ||
              user.role === APP_ROLES.cashierUser) &&
            orderDetails?.status === orderStatusValues.ready ? (
              <div className="w-full rounded-md p-5 mt-4">
                <span>Seleccionar motorista</span>
                <div className="w-full mt-4" />
                <div className="my-4 flex flex-col gap-4">
                  <Select
                    placeholder="Seleccione motorista"
                    data={driverList}
                    allowDeselect={false}
                    size="md"
                    value={driver}
                    onChange={setDriver}
                    searchable
                    nothingFoundMessage="No se ha encontrado"
                  />
                  <Button
                    text={"Confirmar motorista"}
                    onClick={confirmDriver}
                    className={"text-md px-3 py-2 text-white bg-primary_button font-bold"}
                  />
                </div>
              </div>
            ) : orderDetails?.status === orderStatusValues.readyForCustomer ? (
              <Button
                text={"Confirmar pedido entregado"}
                onClick={confirmDelivery}
                className={"mt-4 text-md px-3 py-2 text-white bg-primary_button font-bold"}
              />
            ) : null}
          </Grid.Col>
        </Grid>
      </section>
      <section>
        <Modal
          opened={orderDetailModalOpened}
          onClose={closeOrderDetailModal}
          centered
          size={"2xl"}
          radius={"lg"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <Paper withBorder>
            <div className="flex flex-row items-center">
              <Image
                h={"120px"}
                w={"130px"}
                fit="contain"
                src="https://via.placeholder.com/132x120"
                radius={"xl"}
                fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
              />
              <div className="text-2xl font-bold pl-4 leading-loose">{orderDetails?.OrderDetails?.[0]?.Dish?.name}</div>
            </div>
            <Grid mt={"xl"}>
              <Grid.Col span={{ base: 12, md: "auto" }}>
                <div className="flex flex-col">
                  <span className="text-sm  font-medium leading-normal">Cantidad</span>
                  <span className="text-xs py-2 font-bold leading-normal">{orderDetails?.OrderDetails?.[0]?.quantity}</span>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: "auto" }}>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-normal">Precio Unit.</span>
                  {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.price)}
                  <span className="text-xs py-2 font-bold leading-normal"></span>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <div className="flex flex-col">
                  <span className="text-sm  font-medium leading-normal">SubTotal</span>
                  <span className="text-xs py-2 font-bold leading-normal">
                    {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.subtotal)}
                  </span>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <div className="flex flex-col">
                  <span className="text-sm  font-medium leading-normal">Total</span>
                  <span className="text-xs py-2 font-bold leading-normal">{getFormattedHNL(orderDetails?.total)}</span>
                </div>
              </Grid.Col>
            </Grid>
            <div className="text-xl font-bold leading-loose">Complementos</div>
            <div className="text-xl font-bold leading-loose py-2">Notas de la orden</div>
            <div className="text-base font-normal leading-normal"></div>
          </Paper>
        </Modal>
      </section> */}
    </Container>
  )
}
