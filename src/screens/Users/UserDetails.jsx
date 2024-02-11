import { useDisclosure } from "@mantine/hooks"
import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import menuApi from "../../api/menuApi"
import DashboardCard from "../../components/DashboardCard"
import EditMenuScreen from "../Menu/EditMenuScreen"
import { IconCamera } from "@tabler/icons-react"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"
import BackButton from "../Dishes/components/BackButton"
import { useSelector } from "react-redux"
import authApi from "../../api/authApi"
import { format, formatRelative, subDays } from "date-fns"

export default function UserDetails() {
  const { usersId } = useParams()
  const location = useLocation()
  const restaurant = useSelector((state) => state.restaurants.restaurants)

  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)

  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await authApi.getUser()

        const userDetails = response?.data?.data
        console.log(userDetails, "sr")
        setUserDetails(userDetails)
      } catch (error) {
        toast.error("Hubo un error obteniendo los detalles del menu")
        throw error
      }
    }
    fetchDetails()
  }, [closeFormModal, formModalOpened])

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

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={userDetails?.name} />
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={userDetails?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
        <section className="w-full xl:w-9/12 2xl:w-10/12 border border-blue-100 rounded-lg">
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
                <img
                  className="w-44 h-44 rounded-full object-contain absolute border top-[150px] left-[50px] bg-white"
                  src={userDetails?.images?.[0]?.location}
                />
                <div
                  className="w-[34px] h-[34px] bg-sky-950 rounded-full absolute top-[280px] left-[190px] flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    openImageModal()
                  }}>
                  <IconCamera color="white" size={18} />
                </div>
              </div>
            </Card.Section>
            <section className="">
              <Grid>
                <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
                  <div className="p-5 bg-white flex md:items-center lg:items-start flex-col">
                    <span className="text-sky-950 font-bold pt-20 pb-5 text-left text-2xl">{userDetails?.name}</span>
                    <div className="text-sky-950 text-sm font-medium pb-5 leading-snug">{userDetails?.role}</div>
                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Nombre</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">{userDetails?.role}</div>
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">{userDetails?.name}</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">{userDetails?.email}</div>
                    <div className="text-sky-950 text-sm font-medium leading-snug mb-2">{userDetails?.phoneNumber}</div>

                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20"></section>
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
            <EditMenuScreen close={closeFormModal} itemDetails={userDetails} />
          </Modal>
        </section>
      </div>
    </BaseLayout>
  )
}
