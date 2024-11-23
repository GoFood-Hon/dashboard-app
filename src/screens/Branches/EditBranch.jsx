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
import { setShippingRange, updateBranches } from "../../store/features/branchesSlice"
import FormLayout from "../../components/Form/FormLayout"
import { updateRestaurantData } from "../../store/features/restaurantSlice"

export const EditBranch = () => {
  const { branchId } = useParams()
  const dispatch = useDispatch()
  const [daysData, setDaysData] = useState([])
  const [workSchedule, setWorkSchedule] = useState([])
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false)
  const { updatingBranches } = useSelector((state) => state.branches)
  const handleScheduleChange = (newSchedule) => {
    setWorkSchedule(newSchedule)
    setTableOfficeModified(true)
  }
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

  const [isDataCleared, setIsDataCleared] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await branchesApi.getBranch(branchId)
        setDetails(response?.data)

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

    let formDataImage = null

    if (data?.files?.[0] && data.files[0] instanceof File) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(updateBranches({ formData, formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
      })
      .catch((error) => {
        console.error("Error updating branch:", error)
      })
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
          isLoading={updatingBranches}
          update
        />
      </form>
    </>
  )
}
