import React, { useState } from "react"
import { Checkbox, Flex, Grid, Group, Image, Paper, Text, rem, Button } from "@mantine/core"
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
        <div className="space-y-3">
          <section>
            <div className="flex flex-row items-center justify-between pb-3">
              <div className="flex flex-row items-center gap-x-3">
                <h1 className="text-white-200 text-2xl font-semibold">Negocio</h1>
              </div>
            </div>
          </section>
          <SettingsCard title="Logo" iconName="building">
            <div className="flex flex-row justify-between h-full">
              {user && previews.length === 0 ? (
                <div className="m-4 flex h-full flex-col items-center justify-center rounded-2xl p-4">
                  <Image
                    src={restaurantImg?.[0]?.location}
                    h={50}
                    w={90}
                    fit="contain"
                    fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                    radius='md'
                  />
                </div>
              ) : null}

              <Paper
                withBorder
                radius="md"
                className="m-4 flex h-full w-full flex-col items-center justify-center rounded-2xl p-4">
                {previews.length > 0 ? (
                  <PreviewImageCard
                    imgName={fileInformation.name}
                    size={bytesToMB(fileInformation?.size)}
                    previews={previews}
                    deleteImage={deleteImage}
                  />
                ) : (
                  <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                      <div className="flex flex-col items-center">
                        <IconPhoto
                          style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                          stroke={1.5}
                        />
                        <Text size="xl" inline className="text-center">
                          Seleccione una imagen
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                          Haga clic o arrastre la imagen del logo
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                )}
                {errors.files && <p className="w-full text-center text-red-500">* Imagen es requerida.</p>}
              </Paper>
            </div>
          </SettingsCard>
          <SettingsCard title="General" iconName="building">
            <Grid my={20}>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="Nombre del negocio" name="name" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <InputField label="Correo" name="email" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <InputField label="Teléfono" name="phoneNumber" register={register} errors={errors} />
              </Grid.Col>
            </Grid>
          </SettingsCard>
          <SettingsCard title="Datos de facturación" iconName="building">
            <Grid my={20}>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="Razón social" name="socialReason" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="CAI" name="cai" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="RTN" name="rtn" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="Dirección facturación" name="billingAddress" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <Checkbox
                  labelPosition="left"
                  label={<div className="text-sm font-bold leading-snug">Envío gratuito</div>}
                  color={colors.main_app_color}
                  checked={isFreeShipping}
                  size="sm"
                  onChange={() => setIsFreeShipping(!isFreeShipping)}
                />
              </Grid.Col>
              {!isFreeShipping ? (
                <Grid.Col span={{ sm: 12 }}>
                  <InputField label="Precio de envío" name="shippingPrice" register={register} errors={errors} />
                </Grid.Col>
              ) : null}
            </Grid>
          </SettingsCard>
          <section>
            <Paper withBorder radius="md" className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md px-8 py-5">
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
        </div>
      </form>
    </>
  )
}
