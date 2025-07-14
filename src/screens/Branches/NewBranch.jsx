import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import { TimeForm } from "./TimeForm"
import { getDepartmentNameById, onError } from "../../utils"
import { useDispatch } from "react-redux"
import { createBranch, setShippingRange } from "../../store/features/branchesSlice"
import FormLayout from "../../components/Form/FormLayout"
import { useSelector } from "react-redux"
import { newBranchSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export default function NewBranch() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [daysData, setDaysData] = useState([])
  const [workSchedule, setWorkSchedule] = useState([])
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false)
  const { creatingBranches } = useSelector((state) => state.branches)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ resolver: zodResolver(newBranchSchema) })

  dispatch(setShippingRange(watch("maxDistanceShipping") || 0))

  const handleScheduleChange = (newSchedule) => {
    setWorkSchedule(newSchedule)
  }

  const accordionStructure = [
    {
      title: "Información general",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: "Ubicación",
      form: <LocationForm register={register} errors={errors} setValue={setValue} control={control} newBranch />
    },
    {
      title: "Horario",
      form: (
        <TimeForm
          schedule={workSchedule}
          setDaysData={setDaysData}
          onScheduleChange={handleScheduleChange}
          isAlwaysOpen={isAlwaysOpen}
          setIsAlwaysOpen={setIsAlwaysOpen}
        />
      )
    }
  ]

  const onSubmit = async (data) => {
    const formData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`,
      maxDistanceShipping: data.maxDistanceShipping,
      address: data.address,
      city: data.city,
      state: getDepartmentNameById(parseInt(data.state)),
      geolocation: data.geolocation,
      note: data.note,
      delivery: data.delivery ?? false,
      pickup: data.pickup ?? false,
      onSite: data.onSite ?? false,
      alwaysOpen: isAlwaysOpen,
      schedules: !isAlwaysOpen ? Object.values(daysData) : null
    }

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0] || [])

    dispatch(createBranch({ formData, formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
      })
      .catch((error) => {
        console.error("Error creating branch:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <FormLayout
          title="Nueva sucursal"
          show
          accordionTitles={["Información general", "Ubicación", "Horario"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)}
          isLoading={creatingBranches}
        />
      </form>
    </>
  )
}
