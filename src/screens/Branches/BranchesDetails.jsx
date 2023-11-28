import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"

import { IconCamera } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { useDispatch } from "react-redux"
import { setError } from "../../store/features/complementsSlice"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import branchesApi from "../../api/branchesApi"
import { getFormattedHNL } from "../../utils"
import DashboardCard from "../../components/DashboardCard"

export default function BranchesDetails() {
  const { branchId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
  const [details, setDetails] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await branchesApi.getBranch(branchId)

        const details = response?.data
        setDetails(details)
        console.log(details, "le detail")
      } catch (error) {
        dispatch(setError("Error fetching branches"))
        throw error
      }
    }
    fetchData()
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
            <h1 className="text-white-200 text-2xl font-semibold">{details?.name}</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={details?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
          <section className="w-full xl:w-9/12 2xl:w-10/12 border border-blue-100 rounded-lg">
            <Card padding="lg" radius="md">
              <Card.Section>
                <div className="relative">
                  <img
                    className="w-full h-60 object-cover"
                    src="https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  />

                  <div
                    className="w-[34px] h-[34px] bg-sky-950 rounded-full absolute top-[190px] left-[20px] flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      openImageModal()
                    }}>
                    <IconCamera color="white" size={18} />
                  </div>
                </div>
              </Card.Section>
              <section>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
                    <div className="p-5 bg-white flex md:items-center lg:items-start flex-col">
                      <span className="text-sky-950 font-bold pt-10 pb-5 text-left text-2xl">{details?.name}</span>
                      <div className="text-sky-950 text-sm font-medium pb-5 leading-snug">Información general</div>
                      <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                      <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Correo</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug pb-2">{details?.email}</div>
                      <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Teléfono</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug pb-4">{details?.phoneNumber}</div>
                      <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                      <div className="text-sky-950 text-sm font-medium leading-snug my-2">Dirección</div>
                      <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                      <div className="text-sky-950 text-sm font-bold leading-snug py-3">
                        {details?.address},{details?.addressNote}
                      </div>
                      <div className="text-sky-950 text-sm font-medium leading-snug mb-2 mt-4">Código postal</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details.zipCode || "no disponible"}</div>

                      <div className="text-sky-950 text-sm font-medium leading-snug my-2">Ciudad</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details.city}</div>
                      <div className="text-sky-950 text-sm font-medium leading-snug my-2">Departamento</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details.state}</div>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 10, lg: 10 }}>
                    <div className="flex w-full flex-col">
                      <div className="flex flex-row justify-between w-full">
                        <p className="text-zinc-500 text-sm font-medium h-full w-full pt-20 p-8">
                          {details.description || "Sin descripción disponible"}
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
                        <span className="text-sky-950 text-base font-bold leading-normal">
                          Personal ({details?.Addons?.length || "0"})
                        </span>
                      </div>
                      {details?.Personal?.map((item) => (
                        <div
                          className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm"
                          key={item?.id}>
                          <div className="flex flex-row items-center w-1/2">
                            <img className="w-10 h-10" src={item?.images?.[0]?.location} />
                            <span className="text-sky-950 pl-3">{item?.name}</span>
                          </div>
                          <div className="flex flex-row w-1/2 justify-end">
                            <span className="text-sky-950 pl-3">{getFormattedHNL(item?.price)}</span>
                          </div>
                        </div>
                      ))}

                      <div className="flex flex-row justify-between">
                        <span className="text-sky-950 text-base font-bold leading-normal">Ubicación</span>
                      </div>

                      <div className="flex flex-row justify-between">
                        <span className="text-sky-950 text-base font-bold leading-normal">Horario</span>
                      </div>
                    </div>
                  </Grid.Col>
                </Grid>
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
        </div>
      </section>
      <section>
        <Modal
          opened={imageModalOpened}
          onClose={closeImageModal}
          centered
          size={"xl"}
          radius={"lg"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <Image
            h={"auto"}
            w="full"
            fit="contain"
            src={details?.images?.[0]?.location}
            radius={"xl"}
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
        </Modal>
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
          <span>editar</span>
        </Modal>
      </section>
    </BaseLayout>
  )
}
