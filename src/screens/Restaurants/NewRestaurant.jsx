import React, { useState } from "react"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { GeneralInformationForm } from "./GeneralInformationForm"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { restaurantValidation } from "../../utils/inputRules"
import { convertToDecimal } from "../../utils"
import { colors } from "../../theme/colors"
import BookingInformation from "./BookingInformation"
import { createRestaurant } from "../../store/features/restaurantSlice"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { RestaurantBanner } from "./RestaurantBanner"

export const NewRestaurant = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.restaurants.creatingRestaurant)

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
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
    formData.append("socialReason", data.socialReason)
    formData.append("rtn", data.rtn)
    formData.append("billingAddress", data.billingAddress)
    formData.append("cai", data.cai)
    formData.append("shippingFree", data.shippingFree ?? true)
    formData.append("cuisineTypeId", data.cuisineTypeId ?? '')
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

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])

    const formDataBanner = new FormData()
    formDataBanner.append("files", data.bannerDishes[0])

    dispatch(createRestaurant({ params: formData, imageParams: formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
      })
      .catch((error) => {
        console.error("Error creating restaurant:", error)
      })
  }

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
            defaultValue={["Añadir banner", "Información general", "Datos de reservación"]}>
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
