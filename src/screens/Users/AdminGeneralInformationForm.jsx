import { Flex, Grid, Image, Paper, rem, Select, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import InputField from "../../components/Form/InputField"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { fetchNoPaginatedRestaurants } from "../../store/features/restaurantSlice"
import { Controller } from "react-hook-form"
import { ImageDropzone } from "../../components/ImageDropzone"

export const AdminGeneralInformationForm = ({ register, errors, setValue, image, control, watch }) => {
  const dispatch = useDispatch()
  const [images, setImages] = useState([])
  const { restaurants } = useSelector((state) => state.restaurants)

  useEffect(() => {
    dispatch(fetchNoPaginatedRestaurants())
  }, [dispatch])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image radius="md" h={250} src={imageUrl} />
  })

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Email" name="email" register={register} errors={errors} />
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
            {/* <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Nueva contraseña"
                name="password"
                register={register}
                errors={errors}
                className="text-black"
                placeholder="*******************"
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
                placeholder="*******************"
                type="password"
              />
            </Grid.Col> */}
            <Grid.Col span={{ base: 12 }}>
              <Controller
                name="restaurantId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Restaurante asignado"
                    data={restaurants.map((item) => ({
                      value: item.id,
                      label: item.name
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={(val) => field.onChange(val ?? "")}
                    error={fieldState.error ? fieldState.error.message : null}
                    searchable
                    clearable
                  />
                )}
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
          title="de la colección"
        />
      </Grid.Col>
    </Grid>
  )
}
