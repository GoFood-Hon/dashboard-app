import { Avatar, Breadcrumbs, Grid, Image, Modal, Select } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useDisclosure } from "@mantine/hooks"
import BaseLayout from "../../components/BaseLayout"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"
import Button from "../../components/Button"
import BackButton from "../Dishes/components/BackButton"
import orderApi from "../../api/orderApi"
import { APP_ROLES, orderStatusValues } from "../../utils/constants"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { DishOrderDetailCard } from "./DishOrderDetailCard"
import { useSelector } from "react-redux"

export const OrderDetails = () => {
  const user = useSelector((state) => state.user.value)
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [orderDetailModalOpened, { open: openOrderDetailsModal, close: closeOrderDetailModal }] = useDisclosure(false)
  const [orderDetails, setOrderDetails] = useState({})
  const [driver, setDriver] = useState(null)
  const [driverList, setDriverList] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await orderApi.getOrderDetails(orderId)
        setOrderDetails(response?.data)

        if (user.role === APP_ROLES.restaurantAdmin) {
          const driversResponseRequest = await orderApi.getDrivers("ea6ceeb0-5cd4-4f6e-8c20-2a71cfb79324")
          // TODO: change to driver name
          const newDriverList = driversResponseRequest?.data?.map((item) => item?.driverId)

          setDriverList(newDriverList)

          if (response?.status !== "success") {
            toast.error(`Fallo al obtener la información de la orden. ${response.message}`, {
              duration: 7000
            })
          }
        }
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error.message}`, {
          duration: 7000
        })
      }
    })()
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
        toast.error("Hubo un error en la orden.")
      }
    } catch (error) {
      toast.error("Fallo la confirmación del motorista, ", error)
    }
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <BackButton title="Pedidos" />
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={orderDetails?.id} />
            </Breadcrumbs>
          </div>
        </div>
      </section>

      <section>
        {/*
         * PRIMARY ORDER INFO
         */}

        <Grid grow gutter="sm">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <div className="w-full h-full bg-white rounded-md border border-blue-100 p-5">
              <Grid>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 font-medium text-sm leading-normal">Pedido</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{`#${orderDetails?.id}`}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Estado</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{orderDetails?.status}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Fecha</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">
                      {formatDateDistanceToNow(orderDetails?.createdAt)}
                    </span>
                  </div>
                </Grid.Col>
              </Grid>

              <Grid pt="xl">
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Total compra</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{getFormattedHNL(orderDetails?.total)}</span>
                  </div>
                </Grid.Col>
              </Grid>

              {/*
               * ORDER CARD
               */}

              {orderDetails?.OrderDetails?.map((item, index) => (
                <DishOrderDetailCard key={index} orderDetails={item} />
              ))}

              {/*
               * PAYMENT SECTION
               */}

              <Grid pt="lg">
                {/*  <Grid.Col span={{ base: 12, md: 3 }}>
                    <div className="text-sky-950 text-lg font-medium">Método de pago</div>
                    <div className="text-zinc-500 text-base font-medium">
                      BAC VISA
                      <br />
                      **** **** **** 5874
                    </div>
                  </Grid.Col> */}
                <Grid.Col span={{ base: 12, md: 3 }} />

                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">Subtotal</span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">Descuento</span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">Precio de envío</span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">ISV ( 15% )</span>
                    <div className="w-full border border-blue-100" />
                    <span className="text-sky-950 text-sm pt-4 font-normal leading-normal">Total</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">
                      + {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.subtotal)}
                    </span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">
                      - {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.discount)}
                    </span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">+ {orderDetails?.shippingPrice}</span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">
                      + {getFormattedHNL(orderDetails?.isv)}
                    </span>
                    <div className="w-full border border-blue-100" />
                    <span className="text-sky-950 text-sm pt-4 font-normal leading-normal">
                      {getFormattedHNL(orderDetails?.total)}
                    </span>
                  </div>
                </Grid.Col>
              </Grid>
              {/*
               * BUTTONS
               */}
              {/*   <Grid justify="flex-end" pt="lg">
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Button text={"Descargar"} className={"text-white text-md px-3 py-2 bg-primary_button"} />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Button text={"Imprimir"} className={"text-white text-md px-3 py-2 bg-primary_button"} />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Button text={"Enviar factura"} className={"text-white text-md px-3 py-2 bg-primary_button"} />
                  </Grid.Col>
                </Grid> */}
            </div>
          </Grid.Col>
          {/*
           * 2nd GRID
           */}
          <Grid.Col span={4}>
            {orderDetails?.status === orderStatusValues.onHold && (
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
            )}
            {(orderDetails?.status === orderStatusValues.confirmed) & (user.role === APP_ROLES.kitchenUser) ? (
              <Button
                type="submit"
                text={"Pedido listo"}
                onClick={() => orderReady()}
                className={"text-white text-md px-3 py-2 mb-4 bg-green-500  font-bold"}
              />
            ) : null}
            {/*  <div className="w-full bg-white rounded-md border border-blue-100 p-5">
              <span>Nota del pedido</span>
              <div className="w-full border border-blue-100 mt-4" />
              <div className="w-full text-sky-950 text-xs font-normal mt-4">
                {orderDetails?.OrderDetails?.[0]?.orderDetailNote}
              </div>
            </div> */}
            <div className="w-full bg-white rounded-md  border border-blue-100 p-5">
              <span>Cliente</span>
              <div className="w-full border border-blue-100 mt-4" />
              <div className="my-4 flex flex-row">
                <Avatar size="lg" />
                <div className="flex flex-col text-sm justify-center pl-2">
                  <span>{orderDetails?.Order?.User?.name}</span>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="text-blue-600 text-sm font-normal mt-2">{orderDetails?.Order?.User?.phoneNumber}</div>
              </div>

              <div className="flex flex-col mt-4">
                <div className="text-sky-950 text-base font-semibold mb-2">Dirección envío</div>
                <div className="text-sky-950 text-sm py-2 font-normal leading-normal">
                  {orderDetails?.Order?.User?.UserAddress || "Dirección no disponible "}
                </div>

                {/* <div className="text-sky-950 text-base font-semibold mt-4 mb-2">Dirección de facturación</div>
                <div className="text-sky-950 text-sm py-2 font-normal leading-normal">
                  {orderDetails?.Order?.User?.UserAddress || "Dirección no disponible "}
                </div> */}
              </div>
            </div>
            {(user.role === APP_ROLES.restaurantAdmin || user.role === APP_ROLES.branchAdmin) &
            (orderDetails?.status === orderStatusValues.ready) ? (
              <div className="w-full bg-white rounded-md border border-blue-100 p-5 mt-4">
                <span>Seleccionar motorista</span>
                <div className="w-full border border-blue-100 mt-4" />
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
                    onClick={() => confirmDriver()}
                    className={"text-md px-3 py-2 text-white bg-primary_button font-bold"}
                  />
                </div>
              </div>
            ) : null}
          </Grid.Col>
        </Grid>
      </section>
      <section>
        <Modal
          opened={orderDetailModalOpened}
          onClose={closeOrderDetailModal}
          centered
          size={"630px"}
          radius={"lg"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <div className="p-4 rounded-xl pt-6 bg-gradient-to-b from-sky-200 via-slate-100 to-neutral-100">
            <div className="flex flex-row items-center">
              <Image
                h={"120px"}
                w={"130px"}
                fit="contain"
                src="https://via.placeholder.com/132x120"
                radius={"xl"}
                fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
              />
              <div className="text-sky-950 text-2xl font-bold pl-4 leading-loose">
                {orderDetails?.OrderDetails?.[0]?.Dish?.name}
              </div>
            </div>
            <Grid mt={"xl"}>
              <Grid.Col span={{ base: 12, md: "auto" }}>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm  font-medium leading-normal">Cantidad</span>
                  <span className="text-sky-950  text-xs py-2 font-bold leading-normal">
                    {orderDetails?.OrderDetails?.[0]?.quantity}
                  </span>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: "auto" }}>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm  font-medium leading-normal">Precio Unit.</span>
                  {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.price)}
                  <span className="text-sky-950  text-xs py-2 font-bold leading-normal"></span>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm  font-medium leading-normal">SubTotal</span>
                  <span className="text-sky-950  text-xs py-2 font-bold leading-normal">
                    {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.subtotal)}
                  </span>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm  font-medium leading-normal">Total</span>
                  <span className="text-sky-950  text-xs py-2 font-bold leading-normal">
                    {getFormattedHNL(orderDetails?.total)}
                  </span>
                </div>
              </Grid.Col>
            </Grid>
            <div className="text-sky-950 text-xl font-bold leading-loose">Complementos</div>
            <div className="text-sky-950 text-xl font-bold leading-loose py-2">Notas de la orden</div>
            <div className="text-sky-950 text-base font-normal leading-normal"></div>
          </div>
        </Modal>
      </section>
    </BaseLayout>
  )
}
