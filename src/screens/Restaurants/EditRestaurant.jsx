import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { GeneralInformationForm } from "./GeneralInformationForm"
import restaurantsApi from "../../api/restaurantApi"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { convertToDecimal } from "../../utils"
import { showNotification } from "@mantine/notifications"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import classes from "../../screens/Users/ArticlesCardsGrid.module.css"
import plansApi from "../../api/plansApi"
import BookingInformation from "./BookingInformation"
import { PlanForm } from "../Users/PlanForm"
import { useDispatch } from "react-redux"
import { updateRestaurantData } from "../../store/features/restaurantSlice"
import { RestaurantBanner } from "./RestaurantBanner"
import { restaurantValidation } from "../../utils/inputRules"
import FormLayout from "../../components/Form/FormLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { restaurantSchema } from "../../utils/validationSchemas"

export const EditRestaurant = () => {
  const { restaurantId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [restaurantDetails, setRestaurantDetails] = useState({})
  const user = useSelector((state) => state.user.value)
  const [planCancelled, setPlanCancelled] = useState(false)
  const [newPlan, setNewPlan] = useState({})
  const isLoading = useSelector((state) => state.restaurants.updatingRestaurant)
  const page = useSelector((state) => state.restaurants.currentPage)
  const restaurantsPerPage = useSelector((state) => state.restaurants.restaurantsPerPage)
  const restaurantsList = restaurantsPerPage[page] || []
  const restaurantToEdit = restaurantsList[restaurantsList.findIndex((restaurant) => restaurant?.id === restaurantId)]

  useEffect(() => {
    ;(async () => {
      const response = await restaurantsApi.getRestaurant(restaurantId)
      const details = response?.data
      setRestaurantDetails(details)
    })()
  }, [])

  const handlePlanCancel = (cancelled) => {
    setPlanCancelled(cancelled)
  }

  const handleSelectNewPlan = (planId) => {
    setNewPlan(planId)
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ resolver: zodResolver(restaurantSchema), defaultValues: restaurantDetails || {} })

  const imageLocation = watch("images[0].location")
  const bannerLocation = watch("bannerDishes[0].location")
  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
      formData.append("socialReason", data.socialReason)
      formData.append("rtn", data.rtn)
      formData.append("billingAddress", data.billingAddress)
      formData.append("cai", data.cai)
      formData.append("shippingFree", data.shippingFree ?? false)
      formData.append("cuisineTypeId", data.cuisineTypeId ?? "")
      formData.append("clinpaysCommerceToken", data.clinpaysCommerceToken ?? null)
      if (data.pricePerChair) {
        formData.append("pricePerChair", data.pricePerChair)
      }
      if (data.hoursBeforeCancellation) {
        formData.append("hoursBeforeCancellation", data.hoursBeforeCancellation)
      }
      if (data.hoursBeforeBooking) {
        formData.append("hoursBeforeBooking", data.hoursBeforeBooking)
      }
      if (data.shippingFree !== null) {
        formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
      }

      let formDataImage = null
      if (data?.files?.[0]) {
        formDataImage = new FormData()
        formDataImage.append("files", data.files[0])
      }

      let formDataBanner = null

      if (data?.bannerDishes?.[0] instanceof File) {
        formDataBanner = new FormData()
        formDataBanner.append("files", data.bannerDishes[0])
      }

      dispatch(updateRestaurantData({ formData, restaurantId, formDataImage, formDataBanner }))
        .unwrap()
        .then(() => {
          navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
        })
        .catch((error) => {
          console.error("Error updating restaurant:", error)
        })

      if (planCancelled && Object.keys(newPlan).length > 0) {
        try {
          const cancelPlanResponse = await plansApi.cancelPlan({ restaurantId })

          if (cancelPlanResponse.error) {
            showNotification({
              title: "Error",
              message: cancelPlanResponse.message,
              color: "red",
              duration: 5000
            })
          } else {
            // Asignar el nuevo plan solo si la cancelación fue exitosa
            try {
              const assignPlanResponse = await plansApi.assignPlan({
                restaurantId,
                planId: newPlan?.id // Asumiendo que `planId` está en los datos de `data`
              })

              if (assignPlanResponse.error) {
                showNotification({
                  title: "Error",
                  message: assignPlanResponse.message,
                  color: "red",
                  duration: 5000
                })
              }
            } catch (error) {
              showNotification({
                title: "Error",
                message: `Error al actualizar: ${error}`,
                color: "red",
                duration: 5000
              })
            }
          }
        } catch (error) {
          showNotification({
            title: "Error",
            message: error?.message,
            color: "red",
            duration: 7000
          })
        }
      } else if (!planCancelled && Object.keys(newPlan).length > 0) {
        // Asignar el nuevo plan solo si la cancelación fue exitosa
        try {
          const assignPlanResponse = await plansApi.assignPlan({
            restaurantId,
            planId: newPlan?.id // Asumiendo que `planId` está en los datos de `data`
          })

          if (assignPlanResponse.error) {
            showNotification({
              title: "Error",
              message: assignPlanResponse.message,
              color: "red",
              duration: 5000
            })
          }
        } catch (error) {
          showNotification({
            title: "Error",
            message: `Error al actualizar: ${error}`,
            color: "red",
            duration: 5000
          })
        }
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
        duration: 7000
      })
    }
  }

  useEffect(() => {
    if (Object.keys(restaurantDetails).length > 0) {
      reset(restaurantDetails)
    }
    window.scrollTo(0, 0)
  }, [restaurantDetails, reset])

  const accordionStructure = [
    {
      title: "Añadir banner",
      requirement: "Obligatorio",
      form: (
        <RestaurantBanner
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          image={bannerLocation}
          isDataCleared={isDataCleared}
          watch={watch}
        />
      )
    },
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
          watch={watch}
        />
      )
    },
    {
      title: "Datos de reservación",
      requirement: "Opcional",
      form: (
        <BookingInformation
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
        />
      )
    },
    {
      title: "Selección del plan",
      requirement: "Opcional",
      form: (
        <PlanForm
          planCancelled={planCancelled}
          newPlan={newPlan}
          setNewPlan={setNewPlan}
          classes={classes}
          colors={colors}
          restaurantDetails={restaurantDetails}
          handlePlanCancel={handlePlanCancel}
          handleSelectNewPlan={handleSelectNewPlan}
          restaurantId={restaurantId}
        />
      )
    }
  ]

  const filteredAccordionStructure = accordionStructure.filter((item, index) => {
    if (!restaurantDetails?.CreditCardRestaurant && index === accordionStructure.length - 1) {
      return false
    }
    return true
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={restaurantDetails?.name}
          show
          accordionStructure={filteredAccordionStructure}
          accordionTitles={["Añadir banner", "Información general", "Datos de reservación", "Selección del plan"]}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
