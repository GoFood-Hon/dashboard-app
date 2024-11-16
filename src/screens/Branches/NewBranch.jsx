import React, { useState } from "react"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { newBranchValidation } from "../../utils/inputRules"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import { TimeForm } from "./TimeForm"
import BackButton from "../Dishes/components/BackButton"
import branchesApi from "../../api/branchesApi"
import { getDepartmentNameById } from "../../utils"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"
import { useDispatch } from "react-redux"
import { setShippingRange } from "../../store/features/branchesSlice"

export default function NewBranch() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [daysData, setDaysData] = useState([])
  const [workSchedule, setWorkSchedule] = useState([])
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false)

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
        <LocationForm register={register} errors={errors} setValue={setValue} control={control} isDataCleared={isDataCleared} />
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
    setIsLoading(true)
    const formData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`,
      maxDistanceShipping: data.maxDistanceShipping,
      address: data.address,
      city: data.city,
      state: getDepartmentNameById(parseInt(data.state)),
      geolocation: data.geolocation,
      delivery: data.delivery ?? false,
      pickup: data.pickup ?? false,
      onSite: data.onSite ?? false,
      alwaysOpen: isAlwaysOpen,
      schedules: !isAlwaysOpen ? Object.values(daysData) : null
    }

    try {
      const response = await branchesApi.createBranch(formData)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        const branchId = response.data.id

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
        } else {
          showNotification({
            title: "Creación exitosa",
            message: "La sucursal fue creada correctamente",
            color: "green",
            duration: 7000
          })
          navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
        }
      }
      setIsLoading(false)
      return response.data
    } catch (e) {
      showNotification({
        title: "Error",
        message: e,
        color: "red",
        duration: 7000
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nueva sucursal" show />
          </div>
        </section>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general", "Ubicación", "Horario"]}>
            {items}
          </Accordion>
        </section>
        <section className="mt-2">
          <Paper withBorder radius="md" className="w-full flex md:justify-end md:gap-3 rounded-md px-8 py-5">
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
