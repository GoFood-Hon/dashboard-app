import React, { useState } from "react"
import { CloseIcon, Group, Text, rem, Grid, Paper, Flex, Button, Container, Image } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import authApi from "../../api/authApi"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { useDispatch, useSelector } from "react-redux"
import { bytesToMB } from "../../utils"
import toast from "react-hot-toast"
import { APP_ROLES } from "../../utils/constants"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"

export default function AccountSettings() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

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
    defaultValues: async () => {
      try {
        const response = await authApi.getUser()

        if (response.error) {
          toast.error("Error en la respuesta de la información del usuario")
          return {}
        }

        const userData = response.data.data
        setUserData(userData)

        return {
          firstName: userData?.name || "",
          email: userData?.email || "",
          phoneNumber: userData?.phoneNumber || "",

          image: userData?.images?.[0]?.location
        }
      } catch (error) {
        toast.error("Error obteniendo información del usuario")
        return {}
      }
    }
  })
  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  const image = watch("image")

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <Image radius="md" h={250} src={imageUrl} />
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

  const uploadProfileImage = async (file) => {
    const formDataImage = new FormData()
    formDataImage.append("files", file)

    return await authApi.addImage(formDataImage)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()

      formData.append("name", data.firstName)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)

      const response = await authApi.updateUser(formData)

      if (response.error) {
        toast.error(`Fallo al actualizar la información del perfil. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        await uploadProfileImage(data?.files?.[0])
        toast.success("Usuario actualizado exitosamente", {
          duration: 7000
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
        <div className={`${user.role === APP_ROLES.restaurantAdmin && ""}`}>
          <section>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-x-3 items-center">
                <BackButton title="Configurar cuenta" />
              </div>
            </div>
          </section>
          <SettingsCard title="Información general" iconName="user">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                <Paper withBorder p="lg" radius="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField label="Nombre" name="firstName" register={register} errors={errors} className="text-black" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField label="Email" name="email" register={register} errors={errors} className="text-black" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12 }}>
                      <InputField
                        label="Numero de teléfono"
                        name="phoneNumber"
                        register={register}
                        errors={errors}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField
                        label="Nueva contraseña"
                        name="password"
                        register={register}
                        errors={errors}
                        type="password"
                      />
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
                              Haga clic o arrastre la imagen del restaurante
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
        </div>
        <section>
          <Paper withBorder radius="md" className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
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
