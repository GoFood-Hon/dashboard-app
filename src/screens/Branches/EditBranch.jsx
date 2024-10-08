import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Accordion, Button, Flex, Paper } from "@mantine/core"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import TimeForm from "./TimeForm"
import { getDepartmentNameById } from "../../utils"
import branchesApi from "../../api/branchesApi"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import BackButton from "../Dishes/components/BackButton"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"

export const EditBranch = () => {
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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: details || {}
  })
  const navigate = useNavigate()
  const imageLocation = watch("images[0].location")

  const restaurant = useSelector((state) => state?.restaurant?.value)
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await branchesApi.getBranch(branchId)

        setDetails(response?.data)

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
        throw error
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (Object.keys(details).length > 0) {
      reset(details)
    }
    window.scrollTo(0, 0)
  }, [details, reset])

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <GeneralInformationForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          image={imageLocation}
          isDataCleared={isDataCleared}
          itemDetails={details}
        />
      )
    },
    {
      title: "Ubicación",
      requirement: "Obligatorio",
      form: (
        <LocationForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
          itemDetails={details}
        />
      )
    },
    {
      title: "Horario",
      requirement: "Obligatorio",
      form: <TimeForm setValue={setValue} scheduleModels={details.ScheduleModels} />
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div className="text-slate-50 text-base font-bold bg-[#EE364C] rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = async (data) => {
    setIsLoading(true)
    const formData = JSON.stringify({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      state: getDepartmentNameById(parseInt(data.state)),
      geolocation: data.geolocation.coordinates,
      delivery: data.delivery ?? false,
      pickup: data.pickup ?? false,
      onSite: data.onSite ?? false,
      alwaysOpen: data.alwaysOpen ?? false,
      schedules: !data.alwaysOpen ? data.schedule : null
    })

    try {
      const response = await branchesApi.updateBranches(formData, branchId)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
        setIsLoading(false)
      } else {
        if (data?.files) {
          const uploadBranchImage = async (branchId, file) => {
            const formDataImage = new FormData()
            formDataImage.append("files", file)

            return await branchesApi.addImage(branchId, formDataImage)
          }

          const addImageResponse = await uploadBranchImage(branchId, data?.files?.[0])

          if (addImageResponse.error) {
            showNotification({
              title: "Error",
              message: addImageResponse.message,
              color: "red",
              duration: 7000
            })
          }
        }
        setIsLoading(false)
        showNotification({
          title: "Actualización exitosa",
          message: `Se actualizó la sucursal ${response?.data?.name}`,
          color: "green",
          duration: 7000
        })
        reset()
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
      }
      return response.data
    } catch (e) {
      showNotification({
        title: "Error",
        message: e,
        color: "red",
        duration: 7000
      })
    }
  }

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={details?.name} show />
        </div>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general", "Ubicación", "Horario"]}>
            {items}
          </Accordion>
        </section>
        <section>
          <Paper withBorder radius="md" className="w-full flex md:justify-end mt-3 md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
              <Button
                color={colors.main_app_color}
                variant="outline"
                onClick={() => {
                  reset()
                  localStorage.removeItem("draft")
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
                }}>
                Descartar
              </Button>
              <Button loading={isLoading} color={colors.main_app_color} type="submit">
                Guardar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
