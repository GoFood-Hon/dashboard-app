import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import { newMenuValidation } from "../../utils/inputRules"
import { createMenu, getAllDishes } from "../../store/features/menuSlice"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { colors } from "../../theme/colors"
import FormLayout from "../../components/Form/FormLayout"

export default function NewMenu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [isLoading, setIsLoading] = useState(false)
  const { dishes, currentDishPage, hasMore, dishesLoading, dishesPerPage } = useSelector((state) => state.menus)

  useEffect(() => {
    if (currentDishPage === 1 || dishes.length === 0 || currentDishPage > 1) {
      dispatch(
        getAllDishes({
          limit: dishesPerPage,
          restaurantId: user.restaurantId,
          page: currentDishPage
        })
      )
    }
  }, [dispatch, currentDishPage, dishesPerPage, user.restaurantId])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(newMenuValidation)
  })

  const [isDataCleared, setIsDataCleared] = useState(false)

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
      title: "Platillos",
      requirement: "Obligatorio",
      form: dishesLoading ? (
        <div>Cargando platillos...</div>
      ) : (
        <ComplementsForm
          setValue={setValue}
          moreData={hasMore}
          isDataCleared={isDataCleared}
          defaultMessage="Los platillos seleccionados aparecerán aquí"
          itemsAvailableLabel="Platillos disponibles"
          data={dishes}
          name={"dishes"}
        />
      )
    }
  ]

  const onSubmit = (data) => {
    setIsLoading(true)
    const restaurantId = user.restaurantId
    dispatch(createMenu({ data, restaurantId })).then((response) => {
      if (response.payload) {
        reset()
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)
        setIsDataCleared(true)
      }
      setIsLoading(false)
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo menú"
          show
          accordionTitles={["Información general", "Platillos"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
