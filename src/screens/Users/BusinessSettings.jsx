import React, { useState } from "react"
import { Flex, Group, Paper, Button, Stack } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import { useForm } from "react-hook-form"
import { convertToDecimal } from "../../utils"
import toast from "react-hot-toast"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import restaurantsApi from "../../api/restaurantApi"
import { colors } from "../../theme/colors"
import BackButton from "../Dishes/components/BackButton"
import { RestaurantBanner } from "../Restaurants/RestaurantBanner"
import { GeneralInformationForm } from "../Restaurants/GeneralInformationForm"
import BookingInformation from "../Restaurants/BookingInformation"
import { showNotification } from "@mantine/notifications"
import { setUser } from "../../store/features/userSlice"

export default function BusinessSettings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      try {
        const response = await restaurantsApi.getRestaurant(user?.restaurantId)
        if (response.error) {
          toast.error(`Failed to fetch restaurant information. Please try again. ${response.message}`, {
            duration: 7000
          })
          return {}
        }
        return response.data
      } catch (error) {
        throw error
      }
    }
  })

  const bannerLocation = watch("bannerDishes[0].location")
  const imageLocation = watch("images[0].location")

  const onSubmit = async (data) => {
    setIsLoading(true)
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
    formData.append("clinpaysCommerceToken", data.cuisineTypeId ?? null)
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

    const response = await restaurantsApi.updateRestaurant(formData, user.Restaurant.id)

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })
    } else {
      showNotification({
        title: "Actualización exitosa",
        message: 'Los datos se actualizaron correctamente',
        color: "green"
      })
    }

    if (formDataImage) {
      const imageResponse = await restaurantsApi.addImage(user.Restaurant.id, formDataImage)

      if (imageResponse.error) {
        showNotification({
          title: "Error",
          message: imageResponse.message,
          color: "red"
        })
      } else {
        dispatch(
          setUser({
            ...user,
            Restaurant: {
              ...user.Restaurant,
              images: imageResponse.data.images
            }
          })
        )
      }
    }

    if (formDataBanner) {
      const imageResponse = await restaurantsApi.updateBannerImage(user.Restaurant.id, formDataBanner)

      if (imageResponse.error) {
        showNotification({
          title: "Error",
          message: imageResponse.message,
          color: "red"
        })
      }
    }

    setIsLoading(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group grow mb="xs">
          <Flex align="center" justify="space-between">
            <BackButton title="Información del comercio" />
          </Flex>
        </Group>
        <Stack gap="xs">
          <SettingsCard title="Banner" iconName="building">
            <RestaurantBanner
              register={register}
              errors={errors}
              setValue={setValue}
              control={control}
              image={bannerLocation}
              watch={watch}
            />
          </SettingsCard>
          <SettingsCard title="Información general" iconName="building">
            <GeneralInformationForm
              register={register}
              errors={errors}
              setValue={setValue}
              control={control}
              image={imageLocation}
              watch={watch}
              blocked
            />
          </SettingsCard>
          <SettingsCard title="Datos de reservación" iconName="building">
            <BookingInformation register={register} errors={errors} setValue={setValue} control={control} />
          </SettingsCard>
          <section>
            <Paper withBorder radius="md" p="md">
              <Flex justify="end" gap="xs">
                <Button
                  color={colors.main_app_color}
                  variant="outline"
                  onClick={() => {
                    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.General.path)
                  }}>
                  Descartar
                </Button>
                <Button loading={isLoading} color={colors.main_app_color} type="submit">
                  Actualizar
                </Button>
              </Flex>
            </Paper>
          </section>
        </Stack>
      </form>
    </>
  )
}
