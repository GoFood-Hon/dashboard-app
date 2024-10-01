import React, { useState } from "react"
import { CloseIcon, Group, Image, Modal, Text, rem, Grid } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import authApi from "../../api/authApi"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import Button from "../../components/Button"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from "@mantine/hooks"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { useDispatch, useSelector } from "react-redux"
import { bytesToMB } from "../../utils"
import toast from "react-hot-toast"
import { APP_ROLES } from "../../utils/constants"
import BackButton from "../Dishes/components/BackButton"
import { LoaderComponent } from "../../components/LoaderComponent"

export default function AccountSettings() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [isLoading, setIsLoading] = useState(false)
  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
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

        console.log(response)

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
                <div className="flex flex-col justify-center items-center w-full h-full rounded-2xl p-4">
                  {previews.length > 0 ? (
                    <div className="w-full">
                      <Text size="lg" inline className="text-left mb-5">
                        Imagen seleccionada:
                      </Text>
                      <div className="flex flex-row justify-center items-center rounded-2xl w-full my-3">
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
                      </div>
                    </div>
                  ) : (
                    <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
                      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none", cursor: "pointer" }}>
                        <div className="flex items-center flex-col cursor-pointer">
                          <img className="rounded-xl cursor-pointer" src={userData?.images?.[0]?.location} alt="" />
                          <IconPhoto
                            className={`${userData?.images?.[0]?.location ? "hidden" : ""}`}
                            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                            stroke={1.5}
                          />
                          <Text className={`${userData?.images?.[0]?.location ? "hidden" : ""} text-center`} size="xl" inline>
                            Seleccione una imagen
                          </Text>
                          <Text
                            className={`${userData?.images?.[0]?.location ? "hidden" : ""} text-center leading-10`}
                            size="sm"
                            c="dimmed"
                            inline
                            mt={7}>
                            Haga clic o arrastre la imagen del usuario
                          </Text>
                        </div>
                      </Group>
                    </Dropzone>
                  )}
                  {errors.files && <p className="text-red-500 text-center w-full">Imagen es requerida.</p>}
                </div>
              </Grid.Col>
            </Grid>
          </SettingsCard>
        </div>
        <Modal
          opened={imageModalOpened}
          onClose={closeImageModal}
          centered
          size={"md"}
          radius={"lg"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <Image
            h={"auto"}
            w="full"
            fit="contain"
            src={userData?.images?.[0]?.location}
            radius={"xl"}
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
        </Modal>
        <Modal
          opened={formModalOpened}
          onClose={closeFormModal}
          centered
          size={"2xl"}
          radius={"lg"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <div className="flex flex-col justify-center items-center w-full h-full rounded-2xl p-4">
            {previews.length > 0 ? (
              <div className="w-full">
                <Text size="lg" inline className="text-left mb-5">
                  Imagen seleccionada:
                </Text>
                <div className="flex flex-row justify-center items-center rounded-2xl w-full border border-slate-200 my-3">
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
                </div>
              </div>
            ) : (
              <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                  <div className="flex items-center flex-col">
                    <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
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
          </div>
        </Modal>
      </form>

      <section>
        <div className="w-full flex md:justify-end md:gap-3 rounded-md bg-white px-8 py-5 border border-gray-200">
          <div className="md:w-2/3 lg:1/3 sm:w-full flex flex-row justify-end gap-3 sm:flex-wrap md:flex-nowrap">
            <Button
              text={"Descartar"}
              className={"text-xs border border-red-400 text-red-400 bg-white"}
              onClick={() => {
                navigate(-1)
              }}
            />
            {isLoading ? (
              <LoaderComponent width={24} size={25} />
            ) : (
              <Button
                text={"Actualizar"}
                className="w-24 flex h-10 items-center justify-center rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
