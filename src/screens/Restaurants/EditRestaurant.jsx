import React, { useEffect, useState } from "react"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { GeneralInformationForm } from "./GeneralInformationForm"
import restaurantsApi from "../../api/restaurantApi"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { convertToDecimal } from "../../utils"
import BackButton from "../Dishes/components/BackButton"
import { showNotification } from "@mantine/notifications"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import classes from "../../screens/Users/ArticlesCardsGrid.module.css"
import plansApi from "../../api/plansApi"
import BookingInformation from "./BookingInformation"
import { PlanForm } from "../Users/PlanForm"

export const EditRestaurant = () => {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [restaurantDetails, setRestaurantDetails] = useState({})
  const user = useSelector((state) => state.user.value)
  const [planCancelled, setPlanCancelled] = useState(false)
  const [newPlan, setNewPlan] = useState({})

  useEffect(() => {
    ;(async () => {
      const response = await restaurantsApi.getRestaurant(restaurantId)
      const details = response?.data
      if (details?.phoneNumber?.startsWith("+504")) {
        details.phoneNumber = details.phoneNumber.replace("+504", "")
      }
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
  } = useForm({ defaultValues: restaurantDetails || {} })

  const imageLocation = watch("images[0].location")
  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Crear la data del formulario
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", `+504${data.phoneNumber}`)
      formData.append("socialReason", data.socialReason)
      formData.append("rtn", data.rtn)
      formData.append("billingAddress", data.billingAddress)
      formData.append("cai", data.cai)
      formData.append("maxDistanceShipping", data.maxDistanceShipping)
      formData.append("shippingFree", data.shippingFree ?? false)
      formData.append("cuisineTypeId", data.cuisineTypeId)
      formData.append("pricePerChair", data.pricePerChair)
      formData.append("hoursBeforeCancellation", data.hoursBeforeCancellation)
      formData.append("hoursBeforeBooking", data.hoursBeforeBooking)
      if (data.shippingFree !== null) {
        formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
      }

      // Actualizar el restaurante
      const response = await restaurantsApi.updateRestaurant(formData, restaurantId)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        const updatedRestaurantId = response?.data?.id

        // Subir imagen si se ha proporcionado
        const uploadImage = async (restaurantId, file) => {
          const formDataImage = new FormData()
          formDataImage.append("files", file)

          return await restaurantsApi.addImage(restaurantId, formDataImage)
        }

        if (data?.files?.[0]) {
          const addImageResponse = await uploadImage(updatedRestaurantId, data.files[0])

          if (addImageResponse.error) {
            showNotification({
              title: "Error",
              message: addImageResponse.message,
              color: "red",
              duration: 7000
            })
          }
        }

        if (planCancelled && Object.keys(newPlan).length > 0) {
          // Cancelar el plan existente (si es necesario)
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
                } else {
                  showNotification({
                    title: "Actualización exitosa",
                    message: `Se actualizó la información de ${response.data.name}`,
                    color: "green",
                    duration: 7000
                  })
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
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
            } else {
              showNotification({
                title: "Actualización exitosa",
                message: `Se actualizó la información de ${response.data.name}`,
                color: "green",
                duration: 7000
              })
              navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
            }
          } catch (error) {
            showNotification({
              title: "Error",
              message: `Error al actualizar: ${error}`,
              color: "red",
              duration: 5000
            })
          }
        } else {
          showNotification({
            title: "Actualización exitosa",
            message: `Se actualizó la información de ${response.data.name}`,
            color: "green",
            duration: 7000
          })
          navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
        }
      }

      setIsLoading(false)
    } catch (error) {
      showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
        duration: 7000
      })
      setIsLoading(false)
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

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div
            className={`text-slate-50 text-base font-bold bg-[#EE364C] rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-4">
          <BackButton title={restaurantDetails?.name} show />
        </div>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general", "Datos de reservación", "Selección del plan"]}>
            {items}
          </Accordion>
        </section>
        <section className="mt-2">
          <Paper withBorder radius="md" className="w-full flex md:justify-end md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
              <Button
                color={colors.main_app_color}
                variant="outline"
                onClick={() => {
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
                }}>
                Descartar
              </Button>
              <Button loading={isLoading} color={colors.main_app_color} type="submit">
                Actualizar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
