import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import { useForm } from "react-hook-form"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { bytesToMB } from "../../utils"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import InputCombobox from "../../components/Form/InputCombobox"
import Button from "../../components/Button"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import restaurantsApi from "../../api/restaurantApi"
import { setRestaurant } from "../../store/features/restaurantSlice"

export default function BusinessSettings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)

  const [images, setImages] = useState([])
  const [restaurant, setRestaurant] = useState({})
  const [fileInformation, setFileInformation] = useState(null)

  useEffect(() => {
    const fetchRestaurantInformation = async () => {
      try {
        const response = await restaurantsApi.getRestaurant(user?.restaurantId)

        if (response.error) {
          toast.error(`Fallo al obtenerla información del restaurante. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          setRestaurant(response.data)
        }
      } catch (error) {
        toast.error(`Fallo al obtenerla información del restaurante. Por favor intente de nuevo.`, {
          duration: 7000
        })
        throw error
      }
    }
    fetchRestaurantInformation()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
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

  const uploadRestaurantImage = async (dishId, file) => {
    const formDataImage = new FormData()
    formDataImage.append("files", file)

    return await restaurantsApi.addImage(dishId, formDataImage)
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)
      formData.append("socialReason", data.socialReason)
      formData.append("rtn", data.rtn)
      formData.append("billingAddress", data.billingAddress)
      formData.append("cai", data.cai)
      formData.append("type", data.type)
      formData.append("isActive", data.status === "Habilitado")

      const response = await restaurantsApi.updateRestaurant(formData, restaurant.id)

      if (response.error) {
        toast.error(`Fallo al actualizar la información del negocio. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        const imageResponse = await uploadRestaurantImage(restaurant.id, data?.files?.[0])
        const newImageData = imageResponse.data.data[0]

        const updatedRestaurant = {
          ...response.data,
          images: [{ location: newImageData.location, key: newImageData.key }]
        }

        dispatch(setRestaurant(updatedRestaurant))
        toast.success("Negocio actualizado exitosamente", {
          duration: 7000
        })
      }
    } catch (error) {}
  }

  const businessType = [
    {
      value: "darkKitchen",
      label: "Dark Kitchen"
    },
    {
      value: "cocina",
      label: "Cocina"
    },
    {
      value: "Glorieta",
      label: "glorieta"
    }
  ]

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pl-[200px]">
          <section>
            <div className="flex flex-row justify-between items-center pb-6">
              <div className="flex flex-row gap-x-3 items-center">
                <h1 className="text-white-200 text-2xl font-semibold">Negocio</h1>
              </div>
              <div>
                <Breadcrumbs>
                  <BreadCrumbNavigation location={location} />
                </Breadcrumbs>
              </div>
            </div>
          </section>
          <SettingsCard title="Logo" iconName="building">
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
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <InputCombobox
                  items={businessType}
                  placeholder="Seleccione el tipo"
                  setValue={setValue}
                  errors={errors}
                  label="Tipo de negocio"
                  name="type"
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12, md: 6 }}>
                <InputCombobox
                  items={[
                    {
                      value: "Habilitado",
                      label: "Habilitado"
                    },
                    {
                      value: "Deshabilitado",
                      label: "Deshabilitado"
                    }
                  ]}
                  placeholder="Seleccione el estado"
                  setValue={setValue}
                  errors={errors}
                  label="Estado del negocio"
                  name="status"
                />
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
            </Grid>
          </SettingsCard>
          <SettingsCard title="Guardar cambios" iconName="building">
            <div className="w-full flex flex-row gap-2 pt-4">
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
      </form>
    </BaseLayout>
  )
}
