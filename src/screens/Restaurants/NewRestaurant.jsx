import React, { useState } from "react"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"
import { GeneralInformationForm } from "./GeneralInformationForm"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { restaurantValidation } from "../../utils/inputRules"
import restaurantsApi from "../../api/restaurantApi"
import { convertToDecimal } from "../../utils"
import { colors } from "../../theme/colors"
import BookingInformation from "./BookingInformation"
import { PlanForm } from "../Users/PlanForm"
import classes from "../../screens/Users/ArticlesCardsGrid.module.css"
import { showNotification } from "@mantine/notifications"
import plansApi from "../../api/plansApi"

export const NewRestaurant = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [planCancelled, setPlanCancelled] = useState(false)
  const [newPlan, setNewPlan] = useState({})
  const [restaurantDetails, setRestaurantDetails] = useState({})
  const [restaurantId, setRestaurantId] = useState("")
  const [kitchenId, setKitchenId] = useState(null)

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
  } = useForm({ resolver: yupResolver(restaurantValidation) })

  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    console.log(data)
    // setIsLoading(true)
    // try {
    //   const formData = new FormData()

    //   formData.append("name", data.name)
    //   formData.append("email", data.email)
    //   formData.append("phoneNumber", `+504${data.phoneNumber}`)
    //   formData.append("socialReason", data.socialReason)
    //   formData.append("rtn", data.rtn)
    //   formData.append("billingAddress", data.billingAddress)
    //   formData.append("cai", data.cai)
    //   formData.append("maxDistanceShipping", data.maxDistanceShipping)

    //   if (data.shippingFree) {
    //     formData.append("shippingFree", true)
    //     formData.append("shippingPrice", "0.00")
    //   } else {
    //     formData.append("shippingFree", false)
    //     formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
    //   }

    //   const response = await restaurantsApi.createRestaurant(formData)

    //   if (response.error) {
    //     showNotification({
    //       title: "Error",
    //       message: response.message,
    //       color: "red",
    //       duration: 7000
    //     })
    //   } else {
    //     setRestaurantId(response.data.id)

    //     const uploadImage = async (restaurantId, file) => {
    //       const formDataImage = new FormData()
    //       formDataImage.append("files", file)

    //       return await restaurantsApi.addImage(restaurantId, formDataImage)
    //     }

    //     if (data?.files?.[0]) {
    //       const addImageResponse = await uploadImage(restaurantId, data?.files?.[0])
    //       if (addImageResponse.error) {
    //         showNotification({
    //           title: "Error",
    //           message: addImageResponse.message,
    //           color: "red",
    //           duration: 7000
    //         })
    //       }

    //       if (planCancelled && Object.keys(newPlan).length > 0) {
    //         // Cancelar el plan existente (si es necesario)
    //         try {
    //           const cancelPlanResponse = await plansApi.cancelPlan({ restaurantId })

    //           if (cancelPlanResponse.error) {
    //             showNotification({
    //               title: "Error",
    //               message: cancelPlanResponse.message,
    //               color: "red",
    //               duration: 5000
    //             })
    //           } else {
    //             // Asignar el nuevo plan solo si la cancelación fue exitosa
    //             try {
    //               const assignPlanResponse = await plansApi.assignPlan({
    //                 restaurantId,
    //                 planId: newPlan?.id // Asumiendo que `planId` está en los datos de `data`
    //               })

    //               if (assignPlanResponse.error) {
    //                 showNotification({
    //                   title: "Error",
    //                   message: assignPlanResponse.message,
    //                   color: "red",
    //                   duration: 5000
    //                 })
    //               } else {
    //                 showNotification({
    //                   title: "Actualización exitosa",
    //                   message: `Se actualizó la información de ${response.data.name}`,
    //                   color: "green",
    //                   duration: 7000
    //                 })
    //                 navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
    //               }
    //             } catch (error) {
    //               showNotification({
    //                 title: "Error",
    //                 message: `Error al actualizar: ${error}`,
    //                 color: "red",
    //                 duration: 5000
    //               })
    //             }
    //           }
    //         } catch (error) {
    //           showNotification({
    //             title: "Error",
    //             message: error?.message,
    //             color: "red",
    //             duration: 7000
    //           })
    //         }
    //       } else if (!planCancelled && Object.keys(newPlan).length > 0) {
    //         // Asignar el nuevo plan solo si la cancelación fue exitosa
    //         try {
    //           const assignPlanResponse = await plansApi.assignPlan({
    //             restaurantId,
    //             planId: newPlan?.id // Asumiendo que `planId` está en los datos de `data`
    //           })

    //           if (assignPlanResponse.error) {
    //             showNotification({
    //               title: "Error",
    //               message: assignPlanResponse.message,
    //               color: "red",
    //               duration: 5000
    //             })
    //           } else {
    //             showNotification({
    //               title: "Actualización exitosa",
    //               message: `Se actualizó la información de ${response.data.name}`,
    //               color: "green",
    //               duration: 7000
    //             })
    //             navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
    //           }
    //         } catch (error) {
    //           showNotification({
    //             title: "Error",
    //             message: `Error al actualizar: ${error}`,
    //             color: "red",
    //             duration: 5000
    //           })
    //         }
    //       }
    //     }
    //   }
    // } catch (e) {
    //   showNotification({
    //     title: "Error",
    //     message: e.message,
    //     color: "red",
    //     duration: 7000
    //   })
    // }
    // setIsLoading(false)
  }

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
    // {
    //   title: "Selección del plan",
    //   requirement: "Opcional",
    //   form: (
    //     <PlanForm
    //       planCancelled={planCancelled}
    //       newPlan={newPlan}
    //       setNewPlan={setNewPlan}
    //       classes={classes}
    //       colors={colors}
    //       restaurantDetails={restaurantDetails}
    //       handlePlanCancel={handlePlanCancel}
    //       handleSelectNewPlan={handleSelectNewPlan}
    //       restaurantId={restaurantId}
    //     />
    //   )
    // }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-4 flex-wrap xs:gap-3">
            <BackButton title="Nuevo restaurante" show />
          </div>
        </section>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general", "Datos de reservación", "Selección del plan"]}>
            {items}
          </Accordion>
        </section>
        <section>
          <Paper withBorder radius="md" className="w-full flex md:justify-end mt-3 md:gap-3 rounded-md px-8 py-5">
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
                Guardar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
