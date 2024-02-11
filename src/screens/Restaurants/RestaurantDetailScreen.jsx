import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Breadcrumbs, Card, Grid, Image } from "@mantine/core"

import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import restaurantsApi from "../../api/restaurantApi"
import { IconCamera } from "@tabler/icons-react"
import { getFormattedHNL } from "../../utils"

export const RestaurantDetailScreen = () => {
  const { restaurantId } = useParams()
  const location = useLocation()

  const [restaurantsDetails, setRestaurantDetails] = useState({})

  const dashboardCards = [
    {
      icon: "money",
      amount: 3500212.0,
      label: "Ventas totales",
      percentage: 0.43
    },
    {
      icon: "money",
      amount: 500212.0,
      label: "Ingresos totales",
      percentage: 2.59
    },
    {
      icon: "bag",
      amount: 1000,
      label: "Pedidos totales",
      percentage: 4.43
    },
    {
      icon: "search",
      amount: 3456,
      label: "Búsqueda totales",
      percentage: -0.95
    }
  ]

  useEffect(() => {
    const fetchDish = async () => {
      const response = await restaurantsApi.getRestaurant(restaurantId)

      const details = response?.data
      console.log(details)
      setRestaurantDetails(details)
    }
    fetchDish()
  }, [])

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={restaurantsDetails?.name} />
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={restaurantsDetails?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
        <section className="w-full xl:w-9/12 2xl:w-10/12 border border-blue-100 rounded-lg ">
          <Card padding="lg" radius="md">
            <Card.Section>
              <div className="relative">
                <Image
                  // src={restaurant?.bannerDishes?.[0]?.location}
                  h={"240px"}
                  w={"100%"}
                  fit="cover"
                  fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                />
              </div>
            </Card.Section>
            <section className="px-20">
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <div className="flex w-full flex-col ">
                    <h1 className="h-full w-full pt-12  text-2xl font-semibold">{restaurantsDetails?.name}</h1>
                    <div className="flex w-full flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm font-medium pt-4">
                        {restaurantsDetails?.description || "Sin descripción disponible"}
                      </p>
                      {/*   <a
                        className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                        onClick={() => {
                          openFormModal()
                        }}>
                        Editar
                      </a> */}
                    </div>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20">
              <div className="pt-8">
                <span className="text-sky-950 text-base font-bold  leading-normal">Platillos </span>
                <span className="text-sky-950 text-base font-normal leading-normal">
                  ( {restaurantsDetails.Dishes?.length ?? 0} )
                </span>

                {restaurantsDetails?.Dishes?.map((item) => (
                  <div
                    className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm"
                    key={item?.id}>
                    <div className="flex flex-row items-center w-1/2">
                      <div className="w-10 h-10 grid place-items-center">
                        <Image
                          h={"full"}
                          w="full"
                          fit="contain"
                          src={item?.images?.[0]?.location}
                          radius={"xs"}
                          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                        />
                      </div>
                      <span className="text-sky-950 pl-3">{item?.name}</span>
                    </div>
                    <div className="flex flex-row w-1/2 justify-end">
                      <span className="text-sky-950 pl-3">{getFormattedHNL(item?.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Card>
        </section>
      </div>
    </BaseLayout>
  )
}
