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
import { getFormattedHNL } from "../../utils"

export default function UserDetails() {
  const { usersId } = useParams()
  const location = useLocation()
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)

  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await menuApi.getMenuDetails({ usersId })

        const userDetails = response?.data
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
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">{userDetails?.name}</h1>
          </div>
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
                <img
                  className="w-full h-60 object-cover"
                  src="https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
                    <div className="text-sky-950 text-sm font-medium pb-5 leading-snug">Cocinero</div>
                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Nombre</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">Hector Luis</div>
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Correo</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">mar@da.com</div>
                    <div className="text-sky-950 text-sm font-medium leading-snug mb-2">Teléfono</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">+504 9043 4349</div>

                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                    <div className="text-sky-950 text-sm font-medium leading-snug mb-2 mt-4">Creado</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug mb-2">12/23/2020</div>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 10, lg: 10 }}>
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-zinc-500 text-sm font-medium h-full w-full pt-20 p-8">
                        {userDetails?.description || "Sin descripción disponible"}
                      </p>
                      <a
                        className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                        onClick={() => {
                          openFormModal()
                        }}>
                        Editar
                      </a>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="text-sky-950 text-base font-bold leading-normal">Sucursal asignada</span>
                    </div>
                    {userDetails?.Addons?.map((item) => (
                      <div
                        className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm"
                        key={item?.id}>
                        <div className="flex flex-row items-center w-1/2">
                          <Image
                            src={item?.images?.[0]?.location}
                            h={60}
                            w={40}
                            fit="contain"
                            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                          />
                          <span className="text-sky-950 pl-3">{item?.name}</span>
                        </div>
                        <div className="flex flex-row w-1/2 justify-end">
                          <span className="text-sky-950 pl-3">{getFormattedHNL(item?.price)}</span>
                        </div>
                      </div>
                    ))}
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
