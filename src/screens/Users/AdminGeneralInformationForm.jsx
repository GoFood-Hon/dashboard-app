import { CloseIcon, Grid, Group, Paper, rem, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import InputField from "../../components/Form/InputField"
import { colors } from "../../theme/colors"
import restaurantsApi from "../../api/restaurantApi"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { bytesToMB } from "../../utils"

export const AdminGeneralInformationForm = ({ register, errors, setValue, image }) => {
  const [restaurant, setRestaurant] = useState([])
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState({})

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
  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius='md' p='md'>

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
                emptyMessage="Sin restaurantes"
                items={restaurant}
                register={register}
                errors={errors}
                setValue={setValue}
                color={colors.primary_button}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <Paper withBorder radius="md" className="flex flex-col justify-center items-center w-full h-full  rounded-2xl p-4">
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
              <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none", cursor: "pointer" }}>
                <div className="flex items-center flex-col cursor-pointer">
                  <img className="rounded-xl cursor-pointer" src={image} alt="" />
                  <IconPhoto
                    className={`${image ? "hidden" : ""}`}
                    style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                    stroke={1.5}
                  />
                  <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                    Seleccione una imagen
                  </Text>
                  <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
                    Haga clic o arrastre la imagen del usuario
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
          {errors.files && <p className="text-red-500 text-center w-full">Imagen es requerida.</p>}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
