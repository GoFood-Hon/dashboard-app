import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useDisclosure } from "@mantine/hooks"
import { Avatar, Breadcrumbs, Grid, Image, Modal } from "@mantine/core"
import BaseLayout from "../../components/BaseLayout"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"
import Button from "../../components/Button"
import BackButton from "../Dishes/components/BackButton"
import orderApi from "../../api/orderApi"
import { orderSocket } from "../../services/sockets"
import { useForm } from "react-hook-form"
import { orderStatusValues } from "../../utils/constants"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { DishOrderDetailCard } from "./DishOrderDetailCard"

export const OrderDetails = () => {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [orderDetailModalOpened, { open: openOrderDetailsModal, close: closeOrderDetailModal }] = useDisclosure(false)
  const [orderDetails, setOrderDetails] = useState({})
  const [orderStatus, setOrderStatus] = useState(orderDetails?.status)

  console.log(orderDetails, "oS")

  useEffect(() => {
    orderSocket.on("orderReady", (order) => {
      console.log(orderStatus, "oS")
      setOrderStatus(order.status)
    })

    return () => {
      orderSocket.off("orderReady")
    }
  }, [])

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({})

  const onSubmit = async () => {
    const response = await orderApi.confirmOrder(orderId)
    if (response.status === "success") {
      toast.success("Pedido confirmado!")
      navigate(NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path)
    } else {
      toast.error("Hubo un error confirmando el pedido, por favor intente de nuevo.")
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response = await orderApi.getOrderDetails(orderId)
        setOrderDetails(response?.data)
        setOrderStatus(response?.data?.status)
        if (response.status !== "success") {
          toast.error(`Fallo al crear el cupón. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        }
      } catch (e) {
        toast.error(`Error. Por favor intente de nuevo. ${e.message}`, {
          duration: 7000
        })
      }
    })()
  }, [orderStatus])

  const cancelOrder = async () => {
    try {
      const response = await orderApi.cancelOrder(orderId)
      if (response.status === "success") {
        toast.success("Orden cancelada exitosamente")
      } else {
        toast.error("Hubo un error cancelando la orden")
      }
    } catch (error) {
      toast.error("Fallo al cancelar la orden, ", error)
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
                      <span className="text-sky-950 text-sm  font-bold leading-normal">
                        {getFormattedHNL(orderDetails?.total)}
                      </span>
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
                      <span className="text-sky-950 text-sm py-2 font-normal leading-normal">
                        + {orderDetails?.shippingPrice}
                      </span>
                      <span className="text-sky-950 text-sm py-2 font-normal leading-normal">+ HND 1500.00</span>
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
                    onClick={handleSubmit(onSubmit)}
                    className={"text-white text-md px-3 py-2 mb-4 bg-primary_button  font-bold"}
                  />
                  <Button
                    text={"Cancelar pedido"}
                    onClick={() => cancelOrder()}
                    className={"text-md px-3 py-2 mb-4 text-white bg-red-500 font-bold"}
                  />
                </>
              )}

              <div className="w-full bg-white rounded-md border border-blue-100 p-5">
                <span>Nota del pedido</span>
                <div className="w-full border border-blue-100 mt-4" />
                <div className="w-full text-sky-950 text-xs font-normal mt-4">
                  {orderDetails?.OrderDetails?.[0]?.orderDetailNote}
                </div>
              </div>
              <div className="w-full bg-white rounded-md  border border-blue-100 p-5 mt-4">
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

                  <div className="text-sky-950 text-base font-semibold mt-4 mb-2">Dirección de facturación</div>
                  <div className="text-sky-950 text-sm py-2 font-normal leading-normal"></div>
                </div>
              </div>
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
      </form>
    </BaseLayout>
  )
}
