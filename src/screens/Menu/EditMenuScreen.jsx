import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Accordion } from "@mantine/core"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import { getAllDishes, updateMenu } from "../../store/features/menuSlice"
import menuApi from "../../api/menuApi"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"
import FormLayout from "../../components/Form/FormLayout"

export default function EditMenuScreen() {
  const { menuId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [menuDetails, setMenuDetails] = useState({})
  const [isDataCleared, setIsDataCleared] = useState(false)
  const isLoading = useSelector((state) => state.menus.updatingMenus)
  const { dishes, currentDishPage, hasMore, dishesPerPage } = useSelector((state) => state.menus)

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
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: menuDetails || {}
  })

  const imageLocation = watch("images[0].location")

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuApi.getMenuDetails({ menuId })
        console.log(response)
        const menuDetails = response?.data[0]
        setMenuDetails(menuDetails)
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
  }, [menuId, reset])

  useEffect(() => {
    if (Object.keys(menuDetails).length > 0) {
      reset(menuDetails)
    }
  }, [menuDetails, reset])

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
          image={imageLocation}
          isDataCleared={isDataCleared}
        />
      )
    },
    {
      title: "Platillos",
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          moreData={hasMore}
          selectedDishes={menuDetails?.Dishes}
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
    dispatch(updateMenu({ data })).then((response) => {
      if (!response.payload.status) {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={menuDetails?.name}
          show
          accordionTitles={["Información general", "Platillos"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
