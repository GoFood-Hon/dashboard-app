import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import { createMenu, getAllDishes } from "../../store/features/menuSlice"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import FormLayout from "../../components/Form/FormLayout"
import { newMenuSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export default function NewMenu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const { dishes, currentDishPage, hasMore, dishesPerPage, creatingMenus } = useSelector((state) => state.menus)

  useEffect(() => {
    if (dishes.length === 0) {
      dispatch(
        getAllDishes({
          limit: dishesPerPage,
          restaurantId: user.restaurantId,
          page: currentDishPage
        })
      )
    }
  }, [dispatch, currentDishPage])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newMenuSchema)
  })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: "Productos",
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          moreData={hasMore}
          defaultMessage="Los productos seleccionados aparecerán aquí"
          itemsAvailableLabel="Productos disponibles"
          data={dishes}
          name={"dishes"}
          errors={errors}
        />
      )
    }
  ]

  const onSubmit = (data) => {
    const restaurantId = user.restaurantId
    dispatch(createMenu({ data, restaurantId })).then((response) => {
      if (response.payload) {
        reset()
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo menú"
          show
          accordionTitles={["Información general", "Productos"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)}
          isLoading={creatingMenus}
        />
      </form>
    </>
  )
}
