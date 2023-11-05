import React, { useEffect, useState } from "react"
import BaseLayout from "../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import BreadCrumbNavigation from "../components/BreadCrumbNavigation"
import { Badge, Breadcrumbs, Card, Grid, Modal, Group, Image, Text, Avatar } from "@mantine/core"
import Button from "../components/Button"
import dishesApi from "../api/dishesApi"
import { getFormattedHNL } from "../utils"
import { IconCamera } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"

export default function DishDetails() {
  const { dishId } = useParams()
  const location = useLocation()
  const [opened, { open, close }] = useDisclosure(false)

  const [dishDetails, setDishDetails] = useState({})

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await dishesApi.getDish(dishId)

        const details = response?.data
        setDishDetails(details)
      } catch (error) {
        dispatch(setError("Error fetching dishes"))
        throw error
      }
    }
    fetchDishes()
  }, [])

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">{dishDetails?.name}</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={dishDetails?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section className="border border-blue-100 rounded-lg">
        <Card padding="lg" radius="md">
          <Card.Section>
            <div className="relative">
              <img
                className="w-full h-60 object-cover"
                src="https://images.pexels.com/photos/255469/pexels-photo-255469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              />
              <img
                className="w-44 h-44 rounded-full object-contain absolute border top-[150px] left-[50px] bg-white"
                src={dishDetails.images?.[0]?.location}
              />
              <div
                className="w-[34px] h-[34px] bg-sky-950 rounded-full absolute top-[280px] left-[190px] flex items-center justify-center cursor-pointer"
                onClick={open}>
                <IconCamera color="white" size={18} />
              </div>
            </div>
          </Card.Section>
          <section className="">
            <Grid>
              <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
                <div className="p-5 bg-white flex md:items-center lg:items-start flex-col">
                  <span className="text-sky-950 font-bold pt-20 pb-5 text-left text-2xl">{dishDetails?.name}</span>
                  <div className="text-sky-950 text-sm font-medium pb-5 leading-snug">Pago</div>
                  <div className="w-[125px] h-px bg-zinc-300 sm:w-full" />
                  <div className="text-sky-950 text-sm font-medium py-5 leading-snug">Precio inicial</div>
                  <div className="text-sky-950 text-sm font-bold leading-snug">{getFormattedHNL(dishDetails?.price)}</div>
                  <div className="text-sky-950 text-sm font-medium py-5 leading-snug">Precio final</div>
                  <div className="text-sky-950 text-sm font-bold leading-snug">{getFormattedHNL(dishDetails?.endPrice)}</div>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 10, lg: 10 }}>
                <div className="flex w-full flex-col">
                  <p className="text-zinc-500 text-sm font-medium h-full w-full pt-20 p-8">{dishDetails?.description}</p>
                  <div className="flex flex-row justify-between">
                    <div>
                      <span className="text-sky-950 text-base font-bold leading-normal">Complementos </span>
                      <span className="text-sky-950 text-base font-normal leading-normal"> </span>
                    </div>
                    <div className="text-blue-600 text-base font-normal leading-normal cursor-pointer">Editar</div>
                  </div>
                  <div className="w-full h-20 p-5 bg-white rounded-lg border border-blue-100 my-2">item</div>
                  <div className="w-full h-20 p-5 bg-white rounded-lg border border-blue-100 my-2">item</div>
                  <div className="text-sky-950 text-xs font-bold leading-normal w-full text-center cursor-pointer">Ver todos</div>
                  <div className="flex flex-row justify-between mt-6">
                    <div className="">
                      <span className="text-sky-950 text-base font-bold leading-normal">Bebidas </span>
                      <span className="text-sky-950 text-base font-normal leading-normal"> </span>
                    </div>
                    <div className="text-blue-600 text-base font-normal leading-normal cursor-pointer">Editar</div>
                  </div>
                  <div className="w-full h-20 p-5 bg-white rounded-lg border border-blue-100 my-2">item</div>
                  <div className="w-full h-20 p-5 bg-white rounded-lg border border-blue-100 my-2">item</div>
                  <div className="text-sky-950 text-xs font-bold leading-normal w-full text-center cursor-pointer">Ver todos</div>
                  <div className="flex flex-row justify-between mt-6">
                    <div className="">
                      <span className="text-sky-950 text-base font-bold leading-normal">Extras </span>
                      <span className="text-sky-950 text-base font-normal leading-normal"> </span>
                    </div>
                    <div className="text-blue-600 text-base font-normal leading-normal cursor-pointer">Editar</div>
                  </div>
                  <div className="w-full h-20 p-5 bg-white rounded-lg border border-blue-100 my-2">item</div>
                  <div className="w-full h-20 p-5 bg-white rounded-lg border border-blue-100 my-2">item</div>
                  <div className="text-sky-950 text-xs font-bold leading-normal w-full text-center cursor-pointer">Ver todos</div>
                </div>
              </Grid.Col>
            </Grid>
          </section>
        </Card>
      </section>
      <Modal
        opened={opened}
        onClose={close}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <img src={dishDetails.images?.[0]?.location} />
      </Modal>
    </BaseLayout>
  )
}
