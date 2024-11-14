import React, { useEffect, useState } from "react"
import { Checkbox, CloseIcon, Container, Flex, Grid, Group, Paper, Text, rem, Image, Select } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import InputField from "../../components/Form/InputField"
import { colors } from "../../theme/colors"
import { bytesToMB } from "../../utils"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllKitchenTypes } from "../../store/features/kitchenAndTagsSlice"
import { Controller } from "react-hook-form"
import InputCheckbox from "../../components/Form/InputCheckbox"

export const GeneralInformationForm = ({ register, control, errors, setValue, isDataCleared, image, watch }) => {
  const dispatch = useDispatch()
  const kitchenTypes = useSelector((state) => state.kitchenAndTags.kitchenTypes)
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const isFreeDelivery = watch("shippingFree", true)

  useEffect(() => {
    dispatch(fetchAllKitchenTypes())
  }, [dispatch])

  const handleHasFreeDelivery = () => {
    //setValue("shippingFree", !isFreeDelivery)
  }

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

  useEffect(() => {
    if (isDataCleared) {
      deleteImage()
    }
  }, [isDataCleared])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <Image key={index} radius="md" h={250} src={imageUrl} />
    )
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre del restaurante" name="name" register={register} errors={errors} className="text-black" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo electrónico" name="email" register={register} errors={errors} className="text-black" />
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
              <InputField label="Razón social" name="socialReason" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="RTN" name="rtn" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="CAI" name="cai" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 6 }}>
              <InputField label="Dirección de facturación" name="billingAddress" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 6 }}>
              <Controller
                name="cuisineTypeId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Especalidad de cocina"
                    data={kitchenTypes.map((item) => ({
                      value: item.id,
                      label: item.name
                    }))}
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
                <InputField label="Precio del envío" name="shippingPrice" register={register} errors={errors} />
              </Grid.Col>
            )}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
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
