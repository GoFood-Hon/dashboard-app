import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import { getFormattedHNL } from "../../utils"
import { IconCamera } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import complementsApi from "../../api/complementsApi"
import { useDispatch, useSelector } from "react-redux"
import { setError } from "../../store/features/complementsSlice"
import EditComplementScreen from "./EditComplementScreen"
import BackButton from "../Dishes/components/BackButton"

export default function ComplementsDetails() {
  const { complementId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const restaurant = useSelector((state) => state.restaurants.restaurants)

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
          <BackButton title={complementDetails?.name} />
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
                <Image
                  src={restaurant?.bannerDishes?.[0]?.location}
                  h={"240px"}
                  w={"100%"}
                  fit="cover"
                  fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
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
              <Grid mt={"xl"} p={"xl"}>
                <Grid.Col span={{ base: 12, md: 10 }}>
                  <div className="flex w-full flex-col pt-14">
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-zinc-500 text-sm font-medium h-full w-full">{complementDetails?.description}</p>
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
              <Grid px={"xl"}>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Precio inicial</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">
                      {getFormattedHNL(complementDetails?.price)}
                    </span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Precio final</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">
                      {getFormattedHNL(complementDetails?.endPrice)}
                    </span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Tipo</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">{complementDetails?.category}</span>
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: "auto" }}>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-sm  font-medium leading-normal">Disponibilidad</span>
                    <span className="text-sky-950 text-sm  font-bold leading-normal">
                      {complementDetails?.isActive ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
          </Card>
        </section>
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
        size={"xl"}
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
