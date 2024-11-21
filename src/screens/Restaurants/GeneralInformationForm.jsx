import React, { useEffect, useState } from "react"
import { Flex, Grid, Paper, Text, rem, Image, Select } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import InputField from "../../components/Form/InputField"
import { useDispatch, useSelector } from "react-redux"
import { Controller } from "react-hook-form"
import InputCheckbox from "../../components/Form/InputCheckbox"
import { fetchNoPaginatedRestaurants } from "../../store/features/restaurantSlice"

export const GeneralInformationForm = ({ register, control, errors, setValue, image, watch }) => {
  const dispatch = useDispatch()
  const restaurants = useSelector((state) => state.restaurants.restaurants)
  const [images, setImages] = useState([])

  const isFreeDelivery = watch("shippingFree", true)

  useEffect(() => {
    console.log(restaurants)
    dispatch(fetchNoPaginatedRestaurants())
  }, [dispatch])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <Image key={index} radius="md" h={250} src={imageUrl} />
    )
  })

  return (
    <Grid>
      <Grid.Col order={{ base: 2, sm: 2, md: 2 }} span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre del restaurante (Obligatorio)" name="name" register={register} errors={errors} className="text-black" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo electrónico (Obligatorio)" name="email" register={register} errors={errors} className="text-black" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Teléfono (Obligatorio)"
                name="phoneNumber"
                countryPrefix="+504"
                register={register}
                errors={errors}
                className="text-black"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Razón social (Obligatorio)" name="socialReason" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="RTN (Obligatorio)" name="rtn" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="CAI (Obligatorio)" name="cai" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Dirección de facturación (Obligatorio)" name="billingAddress" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Controller
                name="restaurantId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Especialidad de cocina (Obligatorio)"
                    data={restaurants.map((item) => ({
                      value: item.id,
                      label: item.name
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error ? fieldState.error.message : null}
                    searchable
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputCheckbox label="¿Cuenta con delivery gratis?" name="shippingFree" register={register} />
            </Grid.Col>

            {isFreeDelivery ? null : (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputField label="Precio del envío por kilómetro" name="shippingPrice" register={register} errors={errors} />
              </Grid.Col>
            )}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col order={{ base: 1, sm: 1, md: 2 }} span={{ base: 12, md: 4, lg: 4 }}>
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
                    <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
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
  )
}
