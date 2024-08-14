import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import { IconCamera, IconEdit } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import { Map, Marker, GeolocateControl } from "react-map-gl"
import { useDispatch, useSelector } from "react-redux"
import "mapbox-gl/dist/mapbox-gl.css"
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

  const [markerPosition, setMarkerPosition] = useState(null)
  const [errorLocalizacion, setErrorLocalizacion] = useState(false)
  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)

  const handleMapClick = (event) => {
    const { lngLat } = event
    setLng(lngLat.lng)
    setLat(lngLat.lat)
    setMarkerPosition({ longitude: lngLat.lng, latitude: lngLat.lat })
    setValue("geolocation", [lngLat.lng, lngLat.lat])
    setErrorLocalizacion(false)
  }

  const handleMapInput = () => {
    setErrorLocalizacion(false)
    setMarkerPosition({ longitude: lng, latitude: lat })
    setValue("geolocation", [lng, lat])
  }

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

    console.log(details)

    fetchData()
  }, [closeFormModal, formModalOpened])

  const todayIndex = new Date().getDay()

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={details?.name} />
        </div>
      </section>
      <section className="bg-white">
        <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
          <section className="w-full border border-blue-100 rounded-lg">
            <div className="relative mt-2">
              <Image
                src={details?.images?.[0]?.location}
                h={"300px"}
                fit="contain"
                fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
              />
              <div
                className="w-[34px] h-[34px] bg-sky-950 rounded-full absolute top-2 left-[20px] flex items-center justify-center cursor-pointer"
                onClick={() => {
                  openImageModal()
                }}>
                <IconCamera color="white" size={18} />
              </div>
              {user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? (
                <div
                  className="w-[34px] h-[34px] bg-sky-950 rounded-full absolute top-2 right-[20px] flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    openFormModal()
                  }}>
                  <IconEdit color="white" size={18} />
                </div>
              ) : null}
            </div>
            <section>
              <div className="p-5 bg-white flex md:items-center lg:items-start flex-col">
                <div className="text-sky-950 text-xl font-bold pb-5 leading-snug">Información general</div>
                <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                <div className="flex justify-between w-full px-2 py-4">
                  <div>
                    <div className="text-sky-950 text-sm font-medium leading-snug my-2">Dirección</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">{details?.address}</div>

                    <div className="text-sky-950 text-sm font-medium leading-snug my-2">Ciudad</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details?.city}</div>
                    <div className="text-sky-950 text-sm font-medium leading-snug my-2">Departamento</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug mb-2">{details?.state}</div>
                  </div>
                  <div>
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Correo</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">
                      {details?.email || "Sin correo asociado"}
                    </div>
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Teléfono</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-4">{details?.phoneNumber}</div>
                  </div>
                </div>
                <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                <div className="flex flex-col justify-between w-full py-4 space-y-4">
                  <span className="text-sky-950 text-base font-bold leading-normal">Ubicación</span>
                  <div className="h-72 relative">
                    <Map
                      initialViewState={{
                        longitude: `${import.meta.env.VITE_MAPBOX_LNG_DEFAULT}`,
                        latitude: `${import.meta.env.VITE_MAPBOX_LAT_DEFAULT}`,
                        zoom: 10
                      }}
                      mapStyle={import.meta.env.VITE_MAPBOX_STYLE_URL}
                      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                      onClick={"handleMapClick"}>
                      {markerPosition && <Marker {...markerPosition} longitude={lng} latitude={lat} color="red" />}
                      <GeolocateControl
                        positionOptions={{ enableHighAccuracy: true }}
                        trackUserLocation={true}
                        onGeolocate={(position) => {
                          setLng(position.coords.longitude)
                          setLat(position.coords.latitude)
                          handleMapInput()
                        }}
                      />
                    </Map>
                  </div>
                </div>
                <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                <div className="flex flex-col justify-between w-full mt-5">
                  <span className="text-sky-950 text-base font-bold leading-normal">Horario</span>
                  {details?.alwaysOpen ? (
                    <div className="flex py-2 bg-green-500 text-white text-lg font-bold rounded-lg px-4">Siempre Abierto</div>
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
              <div className="flex w-full flex-col"></div>
            </section>
          </section>
        </div>
      </section>
      <section>
        <Modal
          opened={imageModalOpened}
          onClose={closeImageModal}
          centered
          size={"xl"}
          radius={"md"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <Image
            h={"auto"}
            w="full"
            fit="contain"
            src={details?.images?.[0]?.location}
            radius={"md"}
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
          <EditBranch close={closeFormModal} itemDetails={details} />
        </Modal>
      </section>
    </BaseLayout>
  )
}
