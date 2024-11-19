import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion, Button, Flex, Paper } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "./ComplementsForm"
import { newCollectionValidation } from "../../utils/inputRules"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { colors } from "../../theme/colors"
import {
  createCollection,
  fetchDishesForCollections,
  fetchRestaurantsForCollections
} from "../../store/features/collectionsSlice"
import FormLayout from "../../components/Form/FormLayout"

export default function NewCollection() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isDataCleared, setIsDataCleared] = useState(false)
  const {
    dishes,
    currentDishPage,
    dishesPerPage,
    hasMoreDishes,
    creatingCollection,
    restaurants,
    currentRestaurantPage,
    restaurantsPerPage,
    hasMoreRestaurants,
    collectionType,
    totalRestaurantsPageCount
  } = useSelector((state) => state.collections)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({})

  useEffect(() => {
    if (currentDishPage === 1 || dishes.length === 0 || currentDishPage > 1) {
      dispatch(
        fetchDishesForCollections({
          limit: dishesPerPage,
          page: currentDishPage
        })
      )
    }
    if (currentRestaurantPage === 1 || restaurants.length === 0 || currentRestaurantPage > 1) {
      dispatch(
        fetchRestaurantsForCollections({
          limit: restaurantsPerPage,
          page: currentRestaurantPage
        })
      )
    }
  }, [dispatch, currentDishPage, dishesPerPage, currentRestaurantPage, restaurantsPerPage])

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
      title: `Lista de ${collectionType === "dishes" ? "platillos" : "restaurantes"}`,
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          moreData={collectionType === "dishes" ? hasMoreDishes : hasMoreRestaurants}
          isDataCleared={isDataCleared}
          defaultMessage="Por favor añada elementos a esta colección"
          itemsAvailableLabel="Platillos/Menús disponibles"
          data={collectionType === "dishes" ? dishes : restaurants}
          name={collectionType === "dishes" ? "dishes" : "restaurants"}
        />
      )
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div
            className={`text-slate-50 text-base font-bold bg-[${colors.main_app_color}] rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = (data) => {
    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])

    dispatch(createCollection({ params: data, formDataImage })).then((response) => {
      if (response.payload) {
        reset()
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)
        setIsDataCleared(true)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nueva colección"
          show
          accordionTitles={["Información general", "Lista de platillos", "Lista de restaurantes"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)}
          isLoading={creatingCollection}
        />
      </form>
    </>
  )
}
