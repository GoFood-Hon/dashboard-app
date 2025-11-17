import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import { TimeForm } from "./TimeForm"
import { getDepartmentNameById } from "../../utils"
import branchesApi from "../../api/branchesApi"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { setShippingRange, updateBranches } from "../../store/features/branchesSlice"
import FormLayout from "../../components/Form/FormLayout"
import { editBranchSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingPage } from "../../components/LoadingPage"

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
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editBranchSchema),
    defaultValues: { ...details, state: details.state && getDepartmentNameById(details.state) } || {}
  })

  const navigate = useNavigate()
  const imageLocation = watch("images[0].location")
  dispatch(setShippingRange(watch("maxDistanceShipping") || 0))

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await branchesApi.getBranch(branchId)
        setDetails(response?.data)

        setIsAlwaysOpen(response?.data?.alwaysOpen)
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (Object.keys(details).length > 0) {
      const departmentId = getDepartmentNameById(details.state)
      reset({
        ...details,
        state: departmentId ?? ""
      })
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
          itemDetails={details}
          watch={watch}
        />
      )
    },
    {
      title: "Ubicación",
      requirement: "Obligatorio",
      form: <LocationForm register={register} errors={errors} setValue={setValue} control={control} itemDetails={details} />
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
    if (data?.files?.[0]) {
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
      {loading ? (
        <LoadingPage />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLayout
            title={details?.name}
            show
            accordionTitles={["Información general", "Ubicación", "Horario"]}
            accordionStructure={accordionStructure}
            navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)}
            isLoading={updatingBranches}
            update
          />
        </form>
      )}
    </>
  )
}
