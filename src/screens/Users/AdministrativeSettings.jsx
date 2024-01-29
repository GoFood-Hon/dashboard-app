import React, { useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, CloseIcon, Group, Text, rem } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import { useForm } from "react-hook-form"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import restaurantsApi from "../../api/restaurantApi"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { bytesToMB } from "../../utils"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES } from "../../routes"
import { useNavigate } from "react-router-dom"

export default function AdministrativeSettings() {
  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({})

  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate()

  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

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

  const uploadRestaurantImage = async (restauranId, file) => {
    const formDataImage = new FormData()
    formDataImage.append("files", file)

    return await restaurantsApi.updateBannerImage(restauranId, formDataImage)
  }

  const onSubmit = async (data) => {
    try {
      const response = await uploadRestaurantImage(user?.restaurantId, data?.files?.[0])
      if (response.error) {
        toast.error(`Fallo al actualizar el banner. ${response.message}`, {
          duration: 7000
        })
      } else {
        toast.success("Banner actualizado exitosamente.", {
          duration: 7000
        })
        window.location.reload()
        navigate(NAVIGATION_ROUTES.Users.submenu.Settings.path)
      }
    } catch (error) {
      toast.error(`Fallo al actualizar el banner. Por favor intente de nuevo. ${response.message}`, {
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
                <h1 className="text-white-200 text-2xl font-semibold">Administrable</h1>
              </div>
              <div>
                <Breadcrumbs>
                  <BreadCrumbNavigation location={location} />
                </Breadcrumbs>
              </div>
            </div>
          </section>
          <SettingsCard title="Banners" iconName="vrDesign">
            <div className="flex flex-col justify-center items-center w-full h-full bg-white rounded-2xl border border-blue-100 p-4 m-4">
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
                        Seleccione una imagen de su logo
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                        Haga click o arrastre una imagen que sera usada como logo
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              )}
              {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
            </div>
            <Button
              text={"Guardar banner"}
              className="flex h-10 w-2/6 items-center justify-center rounded-md bg-sky-950 px-4 text-xs text-slate-50 shadow-sm transition-all duration-700 focus:outline-none ml-auto"
            />
          </SettingsCard>

          {/*  <SettingsCard title="Texto del slider" iconName="vrDesign">
            <Grid my={20}>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="Descripción" name="description" register={register} errors={errors} />
              </Grid.Col>
            </Grid>
          </SettingsCard> */}
        </div>
      </form>
    </BaseLayout>
  )
}
