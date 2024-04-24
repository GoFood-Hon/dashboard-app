import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation, useParams } from "react-router-dom"
import menuApi from "../../api/menuApi"
import toast from "react-hot-toast"

import { useDisclosure } from "@mantine/hooks"
import DashboardCard from "../../components/DashboardCard"
import { getFormattedHNL } from "../../utils"
import EditMenuScreen from "./EditMenuScreen"
import BackButton from "../Dishes/components/BackButton"
import { useSelector } from "react-redux"
import { APP_ROLES, dashboardCards } from "../../utils/constants"

export default function MenuDetails() {
  const { menuId } = useParams()
  const user = useSelector((state) => state.user.value)
  const location = useLocation()
  const restaurant = useSelector((state) => state.restaurants.restaurants)

  const [menuDetails, setMenuDetails] = useState({})
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuApi.getMenuDetails({ menuId })

        const menuDetails = response?.data
        setMenuDetails(menuDetails)
      } catch (error) {
        toast.error("Hubo un error obteniendo los detalles del menu")
        throw error
      }
    }
    fetchMenu()
  }, [closeFormModal, formModalOpened])

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={menuDetails?.name} />
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={menuDetails?.name} />
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
                  src={restaurant?.bannerDishes?.[0]?.location}
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
                    <h1 className="h-full w-full pt-12  text-2xl font-semibold">{menuDetails?.name}</h1>
                    <div className="flex w-full flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm font-medium pt-4">
                        {menuDetails?.description || "Sin descripción disponible"}
                      </p>
                      {user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? (
                        <a
                          className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                          onClick={() => {
                            openFormModal()
                          }}>
                          Editar
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20">
              <div className="pt-8">
                <span className="text-sky-950 text-base font-bold  leading-normal">Platillos </span>
                <span className="text-sky-950 text-base font-normal leading-normal">( {menuDetails?.Dishes?.length ?? 0} )</span>

                {menuDetails?.Dishes?.map((item) => (
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
        <section className="w-full xl:w-3/12 xl:pl-4 2xl:w-2/12">
          <Grid grow>
            {dashboardCards.map((item, key) => (
              <Grid.Col span={{ lg: 1 }} key={key}>
                <DashboardCard gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }} data={item} />
              </Grid.Col>
            ))}
          </Grid>
        </section>
        <section>
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
            <EditMenuScreen close={closeFormModal} itemDetails={menuDetails} />
          </Modal>
        </section>
      </div>
    </BaseLayout>
  )
}
