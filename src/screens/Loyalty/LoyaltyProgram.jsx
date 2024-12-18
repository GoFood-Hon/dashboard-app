import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  createLoyaltyProgram,
  fetchLoyaltyProgramsByRestaurant,
  getLoyaltyProgramById,
  updateLoyaltyProgram
} from "../../store/features/loyaltySlice"
import { useForm } from "react-hook-form"
import FormLayout from "../../components/Form/FormLayout"
import { colors } from "../../theme/colors"
import { GeneralInformationForm } from "./GeneralInformationForm"
import { Accordion } from "@mantine/core"
import LoyaltyCards from "./LoyaltyCards"
import { useParams } from "react-router-dom"

export const LoyaltyProgram = () => {
  const { loyaltyId } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const { programs, updatingPrograms, creatingPrograms } = useSelector((state) => state.loyalty)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: programs
  })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <GeneralInformationForm data={programs} register={register} errors={errors} setValue={setValue} control={control} />
    },
    {
      title: "Tarjetas de descuento",
      requirement: "Obligatorio",
      form: (
        <LoyaltyCards
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          watch={watch}
        />
      )
    }
  ]

  useEffect(() => {
    if (user.role === "superadmin") {
      dispatch(getLoyaltyProgramById(loyaltyId))
    } else {
      programs.length === 0 && dispatch(fetchLoyaltyProgramsByRestaurant(user?.restaurantId))
    }
  }, [dispatch])

  useEffect(() => {
    if (programs) {
      reset(programs)
    }
  }, [reset, programs])

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("amountOfDaysSinceFirstPurchaseToRestartCounting", data.amountOfDaysSinceFirstPurchaseToRestartCounting)
    formData.append("maximumAmountOfPurchasesAllowed", data.maximumAmountOfPurchasesAllowed)
    formData.append("minimumPurchasePriceForActivation", data.minimumPurchasePriceForActivation)
    formData.append("title", data.title)
    formData.append("description", data.description)

    if (programs && Object.keys(programs).length !== 0) {
      dispatch(
        updateLoyaltyProgram({
          id: programs.id,
          params: formData
        })
      )
    } else {
      formData.append("restaurantId", user?.restaurantId)
      dispatch(createLoyaltyProgram(formData))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={"Vista detallada del programa"}
          show={user.role === "superadmin"}
          accordionTitles={["Información general", "Tarjetas de descuento"]}
          accordionStructure={accordionStructure}
          statusButton
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
          isLoading={programs && Object.keys(programs).length !== 0 ? updatingPrograms : creatingPrograms}
          update={programs && Object.keys(programs).length !== 0}
          noDiscard
          noButtons={user.role === "superadmin"}
        />
      </form>
    </>
  )
}
