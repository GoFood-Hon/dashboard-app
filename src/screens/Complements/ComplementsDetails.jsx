import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import { getFormattedHNL } from "../../utils"
import { IconCamera } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import complementsApi from "../../api/complementsApi"
import { useDispatch } from "react-redux"
import { setError } from "../../store/features/complementsSlice"
import EditComplementScreen from "./EditComplementScreen"

export default function ComplementsDetails() {
  const { complementId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
  const [complementDetails, setComplementDetails] = useState({})

  useEffect(() => {
    const fetchComplement = async () => {
      try {
        const response = await complementsApi.getComplement(complementId)

        const details = response?.data
        setComplementDetails(details)
      } catch (error) {
        dispatch(setError("Error fetching complements"))
        throw error
      }
    }
    fetchComplement()
  }, [closeFormModal, formModalOpened])

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">{complementDetails?.name}</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={complementDetails?.name} />
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
                  src={complementDetails?.images?.[0]?.location}
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
            <section>
              <Grid>
                <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
                  <div className="p-5 bg-white flex md:items-center lg:items-start flex-col">
                    <span className="text-sky-950 font-bold pt-20 pb-5 text-left text-2xl">{complementDetails?.name}</span>
                    <div className="text-sky-950 text-sm font-medium pb-5 leading-snug">Pago</div>
                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Precio inicial</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">
                      {getFormattedHNL(complementDetails?.price)}
                    </div>
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Precio final</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">
                      {getFormattedHNL(complementDetails?.endPrice)}
                    </div>
                    <div className="text-sky-950 text-sm font-medium leading-snug mb-2">Cupones</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug mb-2 p-2 bg-blue-100 rounded-2xl">XAN-DA-3DA</div>
                    <div className="text-sky-950 text-sm font-medium leading-snug mb-2 mt-4">Preparación</div>
                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                    <div className="text-sky-950 text-sm font-medium leading-snug my-2">Tiempo estimado</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug mb-2">
                      {complementDetails?.preparationTime} minutos
                    </div>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 10, lg: 10 }}>
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-zinc-500 text-sm font-medium h-full w-full pt-20 p-8">
                        {complementDetails?.description}
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
                        Complementos ({complementDetails?.Addons?.length})
                      </span>
                    </div>
                    {complementDetails?.Addons?.map((item) => (
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
                  </div>
                </Grid.Col>
              </Grid>
            </section>
          </Card>
        </section>
        {/*  <section className="w-full xl:w-3/12 xl:pl-4 2xl:w-2/12">
          <Grid grow>
            {dashboardCards.map((item, key) => (
              <Grid.Col span={{ lg: 1 }} key={key}>
                <DashboardCard gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }} data={item} />
              </Grid.Col>
            ))}
          </Grid>
        </section> */}
      </div>
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
          src={complementDetails?.images?.[0]?.location}
          radius={"xl"}
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
        />
      </Modal>
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        centered
        size={"2xl"}
        radius={"lg"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <EditComplementScreen close={closeFormModal} complementDetails={complementDetails} />
      </Modal>
    </BaseLayout>
  )
}
