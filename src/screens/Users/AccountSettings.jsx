import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Avatar, Breadcrumbs, CloseIcon, Group, Image, Modal, Text, rem } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import authApi from "../../api/authApi"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import Button from "../../components/Button"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from "@mantine/hooks"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { useDispatch } from "react-redux"
import { bytesToMB } from "../../utils"
import toast from "react-hot-toast"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"

export default function AccountSettings() {
  const navigate = useNavigate()

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

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
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
      toast.success("Archivos aceptados 👍", { duration: 7000 })
    }
  }

  const uploadProfileImage = async (dishId, file) => {
    const formDataImage = new FormData()
    formDataImage.append("files", file)

    return await dishesApi.addImage(dishId, formDataImage)
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append("name", data.firstName)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)

      const response = await authApi.updateUser(formData)

      if (response.error) {
        toast.error(`Fallo al actualizar la información del perfil. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        // await uploadProfileImage(userData?.id, data?.files?.[0])
        toast.success("Usuario actualizado exitosamente", {
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      toast.error("Fallo al actualizar usuario. Por favor intente de nuevo.", {
        duration: 7000
      })
    }
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pl-[200px]">
          <section>
            <div className="flex flex-row justify-between items-center pb-6">
              <div className="flex flex-row gap-x-3 items-center">
                <h1 className="text-white-200 text-2xl font-semibold">Cuenta</h1>
              </div>
              <div>
                <Breadcrumbs>
                  <BreadCrumbNavigation location={location} />
                </Breadcrumbs>
              </div>
            </div>
          </section>
          <SettingsCard title="Información general" iconName="user">
            <div className="flex flex-row gap-2">
              <div className="cursor-pointer">
                <Avatar
                  size="xl"
                  src={userData?.images?.[0]?.location}
                  onClick={() => {
                    openImageModal()
                  }}
                />
              </div>
              <a
                className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                onClick={() => {
                  openFormModal()
                }}>
                Editar
              </a>
            </div>

            <div className="flex flex-col w-full py-2">
              <InputField label="Nombre" name="firstName" register={register} errors={errors} />
            </div>
            <div className="flex flex-col w-full py-2">
              <InputField label="Correo" name="email" register={register} errors={errors} />
            </div>
            <div className="flex flex-col w-full py-2">
              <InputField label="Numero de teléfono" name="phoneNumber" register={register} errors={errors} />
            </div>

            <div className="w-full flex flex-row gap-2">
              <Button
                text={"Descartar"}
                className={"text-xs border border-red-400 text-red-400 bg-white"}
                onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}
              />

              <Button
                text={"Guardar Cambios"}
                className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
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
          size={"xl"}
          radius={"lg"}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          <div className="flex flex-col justify-center items-center w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
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
                      Seleccione una imagen de perfil
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                      Haga click o arrastre una imagen que sera usada en su perfil
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
            {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
          </div>
        </Modal>
      </form>
    </BaseLayout>
  )
}
