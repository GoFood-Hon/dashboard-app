import React, { useState } from "react"
import { Group, Grid, Paper, Flex, Button, Stack } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import authApi from "../../api/authApi"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"
import { setUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"
import { showNotification } from "@mantine/notifications"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "../../utils/validationSchemas"
import { useDisclosure } from "@mantine/hooks"
import { ImageDropzone } from "../../components/ImageDropzone"
import { IconSettings } from "@tabler/icons-react"

export default function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [visible, { toggle }] = useDisclosure(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: user
  })

  const image = watch("images.[0].location")

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
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

      const response = await authApi.updateUser(formData)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })
      } else {
        dispatch(
          setUser({
            ...user,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber
          })
        )

        if (data?.files?.[0]) {
          const formDataImage = new FormData()
          formDataImage.append("files", data.files[0])

          const imageResponse = await authApi.addImage(formDataImage)

          if (imageResponse.error) {
            showNotification({
              title: "Error",
              message: imageResponse.message,
              color: "red"
            })
            setIsLoading(false)
            return
          }

          dispatch(setUser({ ...user, images: imageResponse?.data }))
        }

        if (data.currentPassword || data.newPassword || data.newPasswordConfirm) {
          try {
            const response = await authApi.changePassword({
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              newPasswordConfirm: data.newPasswordConfirm
            })

            if (response.error) {
              showNotification({
                title: "Error",
                message: response.message,
                color: "red"
              })
              setIsLoading(false)
              return
            }

            setValue("currentPassword", "")
            setValue("newPassword", "")
            setValue("newPasswordConfirm", "")
          } catch (error) {
            showNotification({
              title: "Error",
              message: "No se pudo actualizar la contraseña. Verifique los datos",
              color: "red"
            })
          }
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
      showNotification({
        title: "Error",
        message: "Fallo al actualizar usuario, por favor intente de nuevo",
        color: "red"
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group grow mb="xs">
          <Flex align="center" justify="space-between">
            <BackButton title="Configurar cuenta" />
          </Flex>
        </Group>
        <Stack gap="xs">
          <SettingsCard title="Información general" icon={IconSettings}>
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
                      <InputField
                        label="Contraseña actual"
                        name="currentPassword"
                        register={register}
                        errors={errors}
                        type="password"
                        visible={visible}
                        onToggleVisibility={toggle}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField
                        label="Nueva contraseña"
                        name="newPassword"
                        register={register}
                        errors={errors}
                        type="password"
                        visible={visible}
                        onToggleVisibility={toggle}
                        newPassword
                        watch={watch}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InputField
                        label="Confirme su contraseña"
                        name="newPasswordConfirm"
                        register={register}
                        errors={errors}
                        type="password"
                        visible={visible}
                        onToggleVisibility={toggle}
                        newPassword
                        watch={watch}
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                <ImageDropzone
                  image={image}
                  images={watch("files")}
                  onDrop={handleDrop}
                  error={errors?.files?.message}
                  title="del usuario"
                />
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
