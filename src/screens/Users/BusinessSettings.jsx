import React, { useState } from "react"
import { Checkbox, Flex, Grid, Group, Image, Paper, Text, rem, Button, Stack } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import { useForm } from "react-hook-form"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { bytesToMB, convertToDecimal } from "../../utils"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import { NAVIGATION_ROUTES_SUPER_ADMIN, SETTING_NAVIGATION_ROUTES } from "../../routes"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import restaurantsApi from "../../api/restaurantApi"
import PreviewImageCard from "../../components/PreviewImageCard"
import { colors } from "../../theme/colors"
import { updateRestaurantData } from "../../store/features/restaurantSlice"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import BackButton from "../Dishes/components/BackButton"
import { RestaurantBanner } from "../Restaurants/RestaurantBanner"
import { GeneralInformationForm } from "../Restaurants/GeneralInformationForm"
import BookingInformation from "../Restaurants/BookingInformation"

export default function BusinessSettings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [restaurantImg, setRestaurantImg] = useState([{}])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
        } else {
          setRestaurantImg(response.data.images)

          return response.data
        }
      } catch (error) {
        toast.error(`Failed to fetch restaurant information. Please try again.`, {
          duration: 7000
        })
        throw error
      }
    }
  })

  const bannerLocation = watch("bannerDishes[0].location")
  const imageLocation = watch("images[0].location")

  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="m-1 h-14 w-14 rounded-xl border object-cover object-center"
      />
    )
  })

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber)
    formData.append("socialReason", data.socialReason)
    formData.append("rtn", data.rtn)
    formData.append("billingAddress", data.billingAddress)
    formData.append("cai", data.cai)
    formData.append("shippingFree", isFreeShipping)
    if (!isFreeShipping) {
      formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
    } else {
      formData.append("shippingPrice", null)
    }

    dispatch(updateRestaurantData({ data, restaurantId: user.restaurantId, formData })).then((response) => {
      if (response.payload) {
        window.location.reload()
        reset()
        navigate(SETTING_NAVIGATION_ROUTES.General.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group grow mb='xs'>
          <Flex align="center" justify="space-between">
            <BackButton title="Información del restaurante" />
          </Flex>
        </Group>
        <Stack gap="md">
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
