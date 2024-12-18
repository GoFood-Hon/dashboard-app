import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { createDish } from "../../store/features/dishesSlice"
import { newItemValidationSchema } from "../../utils/inputRules"
import PreparationForm from "./PreparationForm"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { AdditionalForm } from "./AdditionalForm"
import FormLayout from "../../components/Form/FormLayout"

export default function NewDish() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [additional, setAdditional] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(newItemValidationSchema)
  })

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
      title: "Adicionales",
      requirement: "Opcional",
      form: <AdditionalForm additional={additional} setAdditional={setAdditional} />
    }
  ]

  const onSubmit = (data) => {
    setIsLoading(true)
    const restaurantId = user.restaurantId

    dispatch(createDish({ data, restaurantId, additionals: additional })).then((response) => {
      if (response.payload) {
        reset()
        setIsDataCleared(true)
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
      }
      setIsLoading(false)
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo platillo"
          show
          accordionTitles={["Información general", "Pagos", "Preparación", "Adicionales"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
