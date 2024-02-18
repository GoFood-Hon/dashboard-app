import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"

import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import restaurantsApi from "../../api/restaurantApi"
import { useDisclosure } from "@mantine/hooks"
import EditComplementScreen from "../Complements/EditComplementScreen"
import { EditRestaurant } from "./EditRestaurant"

export const RestaurantDetailScreen = () => {
  const { restaurantId } = useParams()
  const location = useLocation()

  const [restaurantsDetails, setRestaurantDetails] = useState({})

  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
  const [complementDetails, setComplementDetails] = useState({})

  useEffect(() => {
    const fetchDish = async () => {
      const response = await restaurantsApi.getRestaurant(restaurantId)

      const details = response?.data
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
                  src={restaurantsDetails?.images?.[0]?.location}
                  h={"240px"}
                  w={"100%"}
                  fit="contain"
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
                        {restaurantsDetails?.billingAddress || "Sin dirección disponible"}
                      </p>
                      <a
                        className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                        onClick={() => {
                          openFormModal()
                        }}>
                        Editar
                      </a>
                    </div>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20">
              <div className="pt-8">
                <span className="text-sky-950 text-base font-bold leading-normal">Razón social</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{restaurantsDetails?.socialReason}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Email </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{restaurantsDetails?.email}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">CAI </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{restaurantsDetails?.cai}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">RTN </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{restaurantsDetails?.rtn}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Maxima distancia permitida</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{restaurantsDetails?.maxDistanceShipping}</p>
              </div>
            </section>
          </Card>
        </section>
      </div>
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        centered
        size={"xl"}
        radius={"lg"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <EditRestaurant close={closeFormModal} details={restaurantsDetails} restaurantId={restaurantId} />
      </Modal>
    </BaseLayout>
  )
}
