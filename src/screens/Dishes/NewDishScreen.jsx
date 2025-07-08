import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import GeneralInformationForm from "./GeneralInformationForm"
import { createDish } from "../../store/features/dishesSlice"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { AdditionalForm } from "./AdditionalForm"
import FormLayout from "../../components/Form/FormLayout"
import { newDishSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export default function NewDish() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [additional, setAdditional] = useState([])
  const isLoading = useSelector((state) => state.dishes.creatingDish)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newDishSchema)
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
          reset={reset}
          watch={watch}
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
    const restaurantId = user.restaurantId

    dispatch(createDish({ data, restaurantId, additionals: additional })).then((response) => {
      if (response.payload) {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo producto"
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
