import React, { useState } from "react"
import { Accordion } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { newBranchValidation } from "../../utils/inputRules"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import { TimeForm } from "./TimeForm"
import branchesApi from "../../api/branchesApi"
import { getDepartmentNameById } from "../../utils"
import { showNotification } from "@mantine/notifications"
import { useDispatch } from "react-redux"
import { createBranch, setShippingRange } from "../../store/features/branchesSlice"
import FormLayout from "../../components/Form/FormLayout"
import { useSelector } from "react-redux"

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
  } = useForm({
    resolver: yupResolver(newBranchValidation)
  })

  dispatch(setShippingRange(watch("maxDistanceShipping") || 0))

  const [isDataCleared, setIsDataCleared] = useState(false)

  const handleScheduleChange = (newSchedule) => {
    setWorkSchedule(newSchedule)
  }

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
          isDataCleared={isDataCleared}
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
          newBranch
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

    let formDataImage = null

    if (data?.files?.[0] && data.files[0] instanceof File) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nueva sucursal"
          show
          accordionTitles={["Información general", "Ubicación", "Horario"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)}
          isLoading={creatingBranches}
        />
      </form>
    </>
  )
}
