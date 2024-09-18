import { CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

import InputField from "../../components/Form/InputField"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { colors } from "../../theme/colors"
import restaurantsApi from "../../api/restaurantApi"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { bytesToMB } from "../../utils"

export const AdminInformationForm = ({ register, errors, setValue }) => {
  const [restaurant, setRestaurant] = useState([])

  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }
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

  useEffect(() => {
    ;(async () => {
      try {
        const response = await restaurantsApi.getAllRestaurants()

        if (response.error) {
          toast.error(`Fallo al crear la sucursal. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          setRestaurant(response?.data)
        }
      } catch (e) {
        toast.error(`Error. Por favor intente de nuevo. ${e}`, {
          duration: 7000
        })
      }
    })()
  }, [])

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <InputField label="Nombre" name="name" register={register} errors={errors} className="text-black" />
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
          <Grid.Col span={{ base: 12 }}>
            <InputSearchCombobox
              label="Asignar restaurante"
              name={"restaurantId"}
              placeholder="Buscar restaurante"
              emptyMessage="Sin restaurantes"
              items={restaurant}
              register={register}
              errors={errors}
              setValue={setValue}
              color={colors.primary_button}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
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
                    Seleccione una imagen
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                    Haga clic o arrastre la imagen del usuario
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </div>
      </Grid.Col>
    </Grid>
  )
}
