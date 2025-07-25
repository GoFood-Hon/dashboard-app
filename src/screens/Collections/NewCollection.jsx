import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "./ComplementsForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import {
  createCollection,
  fetchDishesForCollections,
  fetchRestaurantsForCollections
} from "../../store/features/collectionsSlice"
import FormLayout from "../../components/Form/FormLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { collectionsSchema } from "../../utils/validationSchemas"

export default function NewCollection() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
    collectionType
  } = useSelector((state) => state.collections)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ resolver: zodResolver(collectionsSchema) })

  useEffect(() => {
    if (dishes.length === 0) {
      dispatch(
        fetchDishesForCollections({
          limit: dishesPerPage,
          page: currentDishPage
        })
      )
    }
    if (restaurants.length === 0) {
      dispatch(
        fetchRestaurantsForCollections({
          limit: restaurantsPerPage,
          page: currentRestaurantPage
        })
      )
    }
  }, [])

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: `Lista de ${collectionType === "dishes" ? "productos" : "comercios"}`,
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          moreData={collectionType === "dishes" ? hasMoreDishes : hasMoreRestaurants}
          defaultMessage={`Los ${collectionType === "dishes" ? "productos" : "comercios"} seleccionados se mostrarán aquí`}
          data={collectionType === "dishes" ? dishes : restaurants}
          name={collectionType === "dishes" ? "dishes" : "restaurants"}
          errors={errors}
        />
      )
    }
  ]

  const onSubmit = (data) => {
    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])

    dispatch(createCollection({ params: data, formDataImage })).then((response) => {
      if (response.payload) {
        reset()
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nueva colección"
          show
          accordionStructure={accordionStructure}
          accordionTitles={["Información general", "Lista de productos", "Lista de comercios"]}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)}
          isLoading={creatingCollection}
        />
      </form>
    </>
  )
}
