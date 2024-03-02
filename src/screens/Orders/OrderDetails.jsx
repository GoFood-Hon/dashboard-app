import { Avatar, Breadcrumbs, Grid, Image, Modal } from "@mantine/core"
import React, { useEffect, useState } from "react"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import Button from "../../components/Button"
import { useDisclosure } from "@mantine/hooks"
import BackButton from "../Dishes/components/BackButton"
import toast from "react-hot-toast"
import orderApi from "../../api/orderApi"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"

export const OrderDetails = () => {
  const { orderId } = useParams()
  const location = useLocation()

  const [orderDetailModalOpened, { open: openOrderDetailsModal, close: closeOrderDetailModal }] = useDisclosure(false)

  const [orderDetails, setOrderDetails] = useState({})

  useEffect(() => {
    ;(async () => {
      try {
        const response = await orderApi.getOrderDetails(orderId)
        setOrderDetails(response.data)
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
  }, [])
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
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{`#${orderDetails.id}`}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Estado</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{orderDetails.status}</span>
                  </div>
                </Grid.Col>
                {/*  <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Método de envío</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">Delivery</span>
                  </div>
                </Grid.Col> */}
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Fecha</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">
                      {formatDateDistanceToNow(orderDetails.createdAt)}
                    </span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Tiempo de preparación</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">
                      {orderDetails?.OrderDetails?.[0]?.Dish?.preparationTime?.maxTime}
                      {" - "}
                      {orderDetails?.OrderDetails?.[0]?.Dish?.preparationTime?.minTime} mins
                    </span>
                  </div>
                </Grid.Col>
              </Grid>

              <Grid pt="xl">
                {/*
                <Grid.Col span={{ base: 12, md: 2.5 }}>
                  <div className="flex flex-row gap-4">
                    <img className="w-16 h-16 rounded-lg" src="https://via.placeholder.com/64x64" />

                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-sm  font-medium leading-normal">Cantidad</span>
                      <span className="text-sky-950 text-sm  font-bold leading-normal">
                        {orderDetails?.OrderDetails?.[0]?.quantity}
                      </span>
                    </div>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 2.5 }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Promociones</span>
                    <div className="my-1 px-3 py-1 w-fit bg-blue-100 rounded-full justify-center items-center inline-flex">
                      <div className="text-sky-950 text-xs font-bold leading-normal">XAN-FJWI-FRJUQ</div>
                    </div>
                    <div className="my-1 px-3 py-1 w-fit bg-blue-100 rounded-full justify-center items-center inline-flex">
                      <div className="text-sky-950 text-xs font-bold leading-normal">DAW-FADA-ADWFS</div>
                    </div>
                  </div>
                </Grid.Col>{" "}
                */}
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Total compra</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{getFormattedHNL(orderDetails.total)}</span>
                  </div>
                </Grid.Col>
              </Grid>

              {/*
               * ORDER CARD
               */}

              <div className="w-full bg-white rounded-2xl border border-blue-100 p-4 mt-4">
                <Grid gutter={"xs"}>
                  <Grid.Col span={{ base: 12, md: "auto" }}>
                    <Image
                      h={"120px"}
                      w={"130px"}
                      fit="contain"
                      src="https://via.placeholder.com/132x120"
                      radius={"xl"}
                      fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: "auto" }}>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-sm  font-medium leading-normal">
                        {orderDetails?.OrderDetails?.[0]?.Dish?.name}
                      </span>
                      <span
                        className="text-blue-600 text-xs py-2 font-bold leading-normal cursor-pointer"
                        onClick={() => {
                          openOrderDetailsModal()
                        }}>
                        Ver orden
                      </span>
                    </div>
                  </Grid.Col>
                  {/*  <Grid.Col span={{ base: 12, md: "auto" }}>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-sm  font-medium leading-normal">Cantidad</span>
                      <span className="text-sky-950  text-xs py-2 font-bold leading-normal">12</span>
                    </div>
                  </Grid.Col> */}
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-sm  font-medium leading-normal">Precio Unit.</span>
                      <span className="text-sky-950  text-xs py-2 font-bold leading-normal">
                        {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.Dish?.price)}
                      </span>
                    </div>
                  </Grid.Col>
                  {/* <Grid.Col span={{ base: 12, md: 2 }}>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-sm  font-medium leading-normal">Descuento aplicado</span>
                      <span className="text-sky-950  text-xs py-2 font-bold leading-normal">XAN-FJWI-FRJUQ</span>
                      <span className="text-sky-950  text-xs font-bold leading-normal">25% (HND 377.97)</span>
                    </div>
                  </Grid.Col> */}
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
                        {getFormattedHNL(orderDetails.total)}
                      </span>
                    </div>
                  </Grid.Col>
                </Grid>
              </div>
              {/*
               * PAYMENT SECTION
               */}

              <Grid pt="lg">
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <div className="text-sky-950 text-lg font-medium">Método de pago</div>
                  <div className="text-zinc-500 text-base font-medium">
                    BAC VISA
                    <br />
                    **** **** **** 5874
                  </div>
                </Grid.Col>
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
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">+ {orderDetails.shippingPrice}</span>
                    <span className="text-sky-950 text-sm py-2 font-normal leading-normal">+ HND 1500.00</span>
                    <div className="w-full border border-blue-100" />
                    <span className="text-sky-950 text-sm pt-4 font-normal leading-normal">
                      {getFormattedHNL(orderDetails.total)}
                    </span>
                  </div>
                </Grid.Col>
              </Grid>
              {/*
               * BUTTONS
               */}
              <Grid justify="flex-end" pt="lg">
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Button text={"Descargar"} className={"text-white text-md px-3 py-2 bg-primary_button"} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Button text={"Imprimir"} className={"text-white text-md px-3 py-2 bg-primary_button"} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Button text={"Enviar factura"} className={"text-white text-md px-3 py-2 bg-primary_button"} />
                </Grid.Col>
              </Grid>
            </div>
          </Grid.Col>
          {/*
           * 2nd GRID
           */}
          <Grid.Col span={4}>
            <Button text={"Confirmar pedido"} className={"text-white text-md px-3 py-2 bg-primary_button"} />

            <div className="w-full bg-white rounded-md  border border-blue-100 p-5 mt-4">
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
              <Grid.Col span={{ base: 12, md: "auto" }}>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm  font-medium leading-normal">Descuento aplicado</span>
                  <span className="text-sky-950  text-xs py-2 font-bold leading-normal">XAN-FJWI-FRJUQ</span>
                  {getFormattedHNL(orderDetails?.OrderDetails?.[0]?.discount)}
                  <span className="text-sky-950  text-xs font-bold leading-normal"></span>
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
