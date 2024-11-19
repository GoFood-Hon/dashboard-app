import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Accordion, Button, Flex, Paper } from "@mantine/core"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import { TimeForm } from "./TimeForm"
import { getDepartmentNameById } from "../../utils"
import branchesApi from "../../api/branchesApi"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import BackButton from "../Dishes/components/BackButton"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"
import { setShippingRange } from "../../store/features/branchesSlice"
import FormLayout from "../../components/Form/FormLayout"

export const EditBranch = () => {
  const { branchId } = useParams()
  const user = useSelector((state) => state.user.value.role)
  const [daysData, setDaysData] = useState([])
  const [workSchedule, setWorkSchedule] = useState([])
  const [markerPosition, setMarkerPosition] = useState(null)
  const [errorLocalizacion, setErrorLocalizacion] = useState(false)
  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false)

  const handleMapClick = (event) => {
    const { lngLat } = event
    setLng(lngLat.lng)
    setLat(lngLat.lat)
    setMarkerPosition({ longitude: lngLat.lng, latitude: lngLat.lat })
    setValue("geolocation", [lngLat.lng, lngLat.lat])
    setErrorLocalizacion(false)
  }

  const handleScheduleChange = (newSchedule) => {
    setWorkSchedule(newSchedule)
    setTableOfficeModified(true)
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
  dispatch(setShippingRange(watch("maxDistanceShipping") || 0))

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

        console.log(response?.data?.alwaysOpen)

        setIsAlwaysOpen(response?.data?.alwaysOpen)
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
          watch={watch}
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
      form: (
        <TimeForm
          schedule={workSchedule}
          setDaysData={setDaysData}
          onScheduleChange={handleScheduleChange}
          hoursData={details?.ScheduleModels}
          isAlwaysOpen={isAlwaysOpen}
          setIsAlwaysOpen={setIsAlwaysOpen}
        />
      )
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
    const formData = {
      id: branchId,
      name: data.name,
      email: data.email,
      note: data.note,
      phoneNumber: data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`,
      maxDistanceShipping: data.maxDistanceShipping,
      address: data.address,
      city: data.city,
      state: getDepartmentNameById(parseInt(data.state)),
      geolocation: data.geolocation.coordinates ? data.geolocation.coordinates : data.geolocation,
      delivery: data.delivery ?? false,
      pickup: data.pickup ?? false,
      onSite: data.onSite ?? false,
      allowTableBooking: data.allowTableBooking ?? false,
      alwaysOpen: isAlwaysOpen,
      schedules: !isAlwaysOpen ? Object.values(daysData) : null
    }

    console.log(formData)

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={details?.name}
          show
          accordionTitles={["Información general", "Ubicación", "Horario"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
