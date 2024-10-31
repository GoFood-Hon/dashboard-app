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

export const GeneralInformationForm = ({ register, control, errors, setValue, isDataCleared, image, watch }) => {
  const dispatch = useDispatch()
  const kitchenTypes = useSelector((state) => state.kitchenAndTags.kitchenTypes)
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const isFreeDelivery = watch("shippingFree", true)

  useEffect(() => {
    dispatch(fetchAllKitchenTypes())
  }, [dispatch])

  useEffect(() => {
    if (isFreeDelivery) {
      setValue("shippingPrice", null)
    } else {
      setValue("shippingPrice", "")
    }
  }, [isFreeDelivery, setValue])

  const handleHasFreeDelivery = () => {
    setValue("shippingFree", !isFreeDelivery)
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
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="h-14 w-14 rounded-xl object-cover object-center border m-1"
      />
    )
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs">
          <Grid gutter='md'>
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
                    label="Tipos de cocina"
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
              <Checkbox
                mt={"md"}
                labelPosition="left"
                label={<div className="text-sm font-bold leading-snug">¿Cuenta con delivery gratis?</div>}
                color={colors.main_app_color}
                checked={isFreeDelivery}
                size="sm"
                onChange={handleHasFreeDelivery}
              />
            </Grid.Col>

            {isFreeDelivery ? null : (
              <Grid.Col span={{ base: 6 }}>
                <InputField label="Precio del envío" name="shippingPrice" register={register} errors={errors} />
              </Grid.Col>
            )}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <Paper withBorder radius="md" h="100%">
          <Flex align="center" h="100%" justify="center">
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
                <Group justify="center" gap="xl" align="center" style={{ pointerEvents: "none" }}>
                  <Container maw={400}>
                    <Flex direction="column" align="center">
                      <Image src={image} radius="md" alt="" style={{ cursor: "pointer" }} />
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
                    </Flex>
                  </Container>
                </Group>
              </Dropzone>
            )}
          </Flex>
          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
