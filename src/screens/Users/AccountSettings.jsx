import React, { useState } from "react"
import { CloseIcon, Group, Text, rem, Grid, Paper, Flex, Button } from "@mantine/core"
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
    formState: { errors }
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

        const phoneNumberWithoutCountryCode = userData?.phoneNumber?.replace("+504", "")

        return {
          firstName: userData?.name || "",
          email: userData?.email || "",
          phoneNumber: phoneNumberWithoutCountryCode || "",

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

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        alt={`Preview ${index + 1}`}
        className="h-14 w-14 rounded-xl object-cover object-center border m-1"
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
      formData.append("phoneNumber", `+504${data.phoneNumber}`)

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
            <div className="flex flex-row justify-between items-center pb-3">
              <div className="flex flex-row gap-x-3 items-center">
                <BackButton title="Configurar cuenta" />
              </div>
            </div>
          </section>
          <SettingsCard title="Información general" iconName="user">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
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
                      className="text-black"
                      countryPrefix="+504"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <InputField
                      label="Ingrese la contraseña"
                      name="password"
                      register={register}
                      errors={errors}
                      className="text-black"
                      type="password"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <InputField
                      label="Vuelva a ingresar la contraseña"
                      name="passwordConfirm"
                      register={register}
                      errors={errors}
                      className="text-black"
                      type="password"
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <Paper withBorder radius="md" h="100%" p="md">
                  {previews.length > 0 ? (
                    <Flex direction="column" h="100%" justify="center">
                      <Text size="lg" mb="xs">
                        Imagen seleccionada:
                      </Text>
                      <Paper withBorder radius="md" p="xs">
                        <Flex>
                          <div className="flex flex-row w-full items-center gap-2 flex-wrap p-2">
                            {previews}
                            <div className="flex flex-col">
                              <Text className="font-semibold italic">{fileInformation?.name}</Text>
                              <Text className="font-semibold" size="sm" c="dimmed" inline>
                                {bytesToMB(fileInformation?.size)} MB
                              </Text>
                            </div>
                          </div>
                          <button onClick={deleteImage} className="pr-3">
                            <CloseIcon size={24} />
                          </button>
                        </Flex>
                      </Paper>
                    </Flex>
                  ) : (
                    <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
                      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                        <div className="flex items-center flex-col">
                          <IconPhoto
                            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                            stroke={1.5}
                          />
                          <Text size="xl" inline className="text-center">
                            Seleccione una imagen
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                            Haga clic o arrastre la imagen del perfil
                          </Text>
                        </div>
                      </Group>
                    </Dropzone>
                  )}
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
