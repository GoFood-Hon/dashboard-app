import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import GeneralInformationForm from "./GeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import {
  fetchDishesForCollections,
  fetchRestaurantsForCollections,
  setCollectionType,
  updateCollection
} from "../../store/features/collectionsSlice"
import collectionsApi from "../../api/collectionsApi"
import ComplementsForm from "./ComplementsForm"
import { useParams } from "react-router-dom"
import FormLayout from "../../components/Form/FormLayout"

export default function EditCollection() {
  const { collectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [elements, setElements] = useState([])
  const {
    dishes,
    currentDishPage,
    dishesPerPage,
    hasMoreDishes,
    restaurants,
    currentRestaurantPage,
    restaurantsPerPage,
    hasMoreRestaurants,
    collectionType,
    updatingCollection
  } = useSelector((state) => state.collections)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: elements || {}
  })

  const bannerLocation = watch("banner[0].location")

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await collectionsApi.getCollectionDetails(collectionId)
        const collectionDetails = response?.data
        setElements(collectionDetails)
        dispatch(setCollectionType(collectionDetails?.type))
      } catch (error) {
        showNotification({
          title: "Error",
          message: error,
          color: "red",
          duration: 7000
        })
        throw error
      }
    }
    fetchMenu()
  }, [collectionId, reset])

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
          image={bannerLocation}
          control={control}
          isDataCleared={isDataCleared}
          watch={watch}
          edit
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
          selectedDishes={Array.isArray(elements.dishes) && elements.dishes.length > 0 ? elements.dishes : elements.restaurants}
          defaultMessage={
            collectionType === "dishes"
              ? "Los platillos seleccionados se mostrarán aquí"
              : "Los platillos restaurantes se mostrarán aquí"
          }
          itemsAvailableLabel="Platillos/Menús disponibles"
          data={collectionType === "dishes" ? dishes : restaurants}
          name={collectionType === "dishes" ? "dishes" : "restaurants"}
        />
      )
    }
  ]

  useEffect(() => {
    if (Object.keys(elements).length > 0) {
      reset(elements)
    }
  }, [elements, reset])

  const onSubmit = (data) => {
    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(updateCollection({ id: collectionId, params: data, formDataImage })).then((response) => {
      if (response.payload) {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={elements.name}
          show
          accordionStructure={accordionStructure}
          accordionTitles={["Información general", "Lista de platillos", "Lista de restaurantes"]}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)}
          isLoading={updatingCollection}
          update
        />
      </form>
    </>
  )
}
