import React, { useState } from "react"
import { Group, Text, rem, Grid, Paper, Flex, Button, Image, Stack } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import authApi from "../../api/authApi"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"
import { setUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"
import { showNotification } from "@mantine/notifications"

export default function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [userData, setUserData] = useState({})
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: user
  })

  const image = watch("images.[0].location")

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image radius="md" h={250} src={imageUrl} />
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
    setIsLoading(true)
    try {
      const formData = new FormData()

      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
      let formDataImage = null
      if (data?.files?.[0]) {
        formDataImage = new FormData()
        formDataImage.append("files", data.files[0])
      }

      const response = await authApi.updateUser(formData)
      dispatch(setUser({ ...user, name: data.name, email: data.email, phoneNumber: data.phoneNumber }))

      if (response.error) {
        toast.error(`Fallo al actualizar la información del perfil. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        if (data?.files?.[0]) {
          const formDataImage = new FormData()
          formDataImage.append("files", data?.files?.[0])
          const imageResponse = await authApi.addImage(formDataImage)

          dispatch(setUser({ ...user, images: imageResponse?.data }))
        }

        showNotification({
          title: "Actualización exitosa",
          message: `Su información fue actualizada correctamente`,
          color: "green"
        })
      }
      setIsLoading(false)
      return response.data
    } catch (error) {
      toast.error("Fallo al actualizar usuario. Por favor intente de nuevo.", {
        duration: 7000
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group grow mb='xs'>
          <Flex align="center" justify="space-between">
            <BackButton title="Configurar cuenta" />
          </Flex>
        </Group>
        <Stack gap="xs">
          <SettingsCard title="Información general" iconName="user">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                <Paper withBorder p="lg" radius="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField label="Nombre" name="name" register={register} errors={errors} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField label="Email" name="email" register={register} errors={errors} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12 }}>
                      <InputField label="Numero de teléfono" name="phoneNumber" register={register} errors={errors} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                      <InputField label="Contraseña actual" name="password" register={register} errors={errors} type="password" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField label="Nueva contraseña" name="password" register={register} errors={errors} type="password" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField
                        label="Vuelva a ingresar la contraseña"
                        name="passwordConfirm"
                        register={register}
                        errors={errors}
                        type="password"
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <Paper withBorder radius="md" h="100%">
                  <Flex align="center" h="100%" justify="center">
                    <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE} h={220} style={{ cursor: "pointer" }}>
                      <Flex direction="column" justify="center" align="center" h={220}>
                        {previews.length > 0 ? (
                          previews
                        ) : (
                          <>
                            <Image radius="md" h={250} src={image} />
                            <IconPhoto
                              className={`${image ? "hidden" : ""}`}
                              style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                              stroke={1.5}
                            />
                            <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                              Seleccione una imagen
                            </Text>
                            <Text
                              className={`${image ? "hidden" : ""} text-center leading-10`}
                              size="sm"
                              c="dimmed"
                              inline
                              mt={7}>
                              Haga clic o arrastre la imagen del usuario
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Dropzone>
                  </Flex>
                  {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
                </Paper>
              </Grid.Col>
            </Grid>
          </SettingsCard>
          <Paper withBorder radius="md" p="md">
            <Flex justify="end" gap="xs">
              <Button loading={isLoading} color={colors.main_app_color} type="submit">
                Actualizar
              </Button>
            </Flex>
          </Paper>
        </Stack>
      </form>
    </>
  )
}
