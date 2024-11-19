import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import GeneralInformationForm from "./GeneralInformationForm"
import { createMenu } from "../../store/features/menuSlice"
import { NAVIGATION_ROUTES_RES_ADMIN, NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { colors } from "../../theme/colors"
import {
  fetchDishesForCollections,
  fetchRestaurantsForCollections,
  setCollectionType
} from "../../store/features/collectionsSlice"
import collectionsApi from "../../api/collectionsApi"
import ComplementsForm from "./ComplementsForm"
import { useParams } from "react-router-dom"
import FormLayout from "../../components/Form/FormLayout"

export default function EditCollection() {
  const { collectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [elements, setElements] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const {
    dishes,
    currentDishPage,
    dishesPerPage,
    hasMoreDishes,
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
          defaultMessage="Por favor añada elementos a esta colección"
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
          title={elements.name}
          show
          accordionTitles={["Información general", "Lista de platillos", "Lista de restaurantes"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
