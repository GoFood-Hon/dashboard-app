import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import { IconCamera } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { Map, Marker } from "react-map-gl"
import { useDispatch, useSelector } from "react-redux"

import { setError } from "../../store/features/complementsSlice"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import branchesApi from "../../api/branchesApi"
import DashboardCard from "../../components/DashboardCard"
import BackButton from "../Dishes/components/BackButton"
import { APP_ROLES, dashboardCards, mapBoxStyles } from "../../utils/constants"
import { MAPBOX_KEY } from "../../services/env"
import { EditBranch } from "./EditBranch"

export default function BranchesDetails() {
  const { branchId } = useParams()
  const user = useSelector((state) => state.user.value.role)

  const location = useLocation()
  const dispatch = useDispatch()

  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
  const [details, setDetails] = useState({})
  const [marker, setMarker] = useState({
    longitude: -88.025,
    latitude: 15.50417
  })
  const [viewState, setViewState] = React.useState({
    longitude: -88.025,
    latitude: 15.50417,
    zoom: 12.2
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await branchesApi.getBranch(branchId)

        const details = response?.data
        setDetails(details)

        setViewState({
          longitude: details?.geolocation?.coordinates?.[0],
          latitude: details?.geolocation?.coordinates?.[1],
          zoom: 15
        })

        setMarker({
          longitude: details?.geolocation?.coordinates?.[0],
          latitude: details?.geolocation?.coordinates?.[1]
        })
      } catch (error) {
        dispatch(setError("Error fetching branches"))
        throw error
      }
    }

    fetchData()
  }, [closeFormModal, formModalOpened])

  const todayIndex = new Date().getDay()

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={details?.name} />
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
                  <Image
                    src={details.images?.[0]?.location}
                    h={"240px"}
                    w={"100%"}
                    fit="contain"
                    fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
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
                      <div className="text-sky-950 text-sm font-bold leading-snug pb-2">
                        {details?.email || "Sin correo asociado"}
                      </div>
                      <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Teléfono</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug pb-4">{details?.phoneNumber}</div>
                      <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                      <div className="text-sky-950 text-sm font-medium leading-snug my-2">Dirección</div>
                      <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                      <div className="text-sky-950 text-sm font-bold leading-snug py-3">{details?.address}</div>

                      <div className="text-sky-950 text-sm font-medium leading-snug my-2">Ciudad</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details.city}</div>
                      <div className="text-sky-950 text-sm font-medium leading-snug my-2">Departamento</div>
                      <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details.state}</div>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 10, lg: 10 }}>
                    <div className="flex w-full flex-col">
                      <div className="flex flex-row justify-between w-full">
                        <p />
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
                      <div className="flex flex-col justify-between w-full h-96 py-4">
                        <span className="text-sky-950 text-base font-bold leading-normal pb-4">Ubicación</span>
                        <Map
                          {...viewState}
                          onMove={(evt) => setViewState(evt.viewState)}
                          mapboxAccessToken={MAPBOX_KEY}
                          style={{ borderRadius: "1rem", width: "auto", height: "30rem", borderWidth: "2px" }}
                          mapStyle={mapBoxStyles}>
                          <Marker longitude={marker.longitude} latitude={marker.latitude} anchor="bottom" />
                        </Map>
                      </div>

                      <div className="flex flex-col justify-between mt-4">
                        <span className="text-sky-950 text-base font-bold leading-normal mb-4">Horario</span>

                        {details.alwaysOpen ? (
                          <div className="flex py-2 bg-green-500 text-white text-lg font-bold rounded-lg px-4">
                            Siempre Abierto
                          </div>
                        ) : (
                          <div className="container mx-auto mt-8">
                            <table className="table-auto border w-full">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 border">Día</th>
                                  <th className="px-4 py-2 border">Apertura</th>
                                  <th className="px-4 py-2 border">Cierre</th>
                                </tr>
                              </thead>
                              <tbody>
                                {details?.schedule?.map((day, index) => (
                                  <tr key={index} className={todayIndex === index ? "bg-blue-100" : ""}>
                                    <td className="px-4 py-2 border">{day.day}</td>
                                    <td className="px-4 py-2 border">{day.openingTime ?? "Cerrado"}</td>
                                    <td className="px-4 py-2 border">{day.closingTime ?? "Cerrado"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
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
          <EditBranch close={closeFormModal} itemDetails={details} />
        </Modal>
      </section>
    </BaseLayout>
  )
}
