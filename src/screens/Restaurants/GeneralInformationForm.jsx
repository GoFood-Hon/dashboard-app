import React, { useEffect, useState } from "react"
import { Checkbox, CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import { colors } from "../../theme/colors"
import { bytesToMB } from "../../utils"

export const GeneralInformationForm = ({ register, errors, setValue, isDataCleared }) => {
  const [isFreeDelivery, setIsFreeDelivery] = useState(false)
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const handleHasFreeDelivery = () => {
    setIsFreeDelivery((prevState) => {
      const newValue = !prevState
      setValue("shippingFree", newValue)
      return newValue
    })
  }

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
      toast.success("Archivos aceptados 👍", { duration: 7000 })
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
        <Grid>
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
            <InputField label="Máximo de distancia permitido" name="maxDistanceShipping" register={register} errors={errors} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Checkbox
              mt={"md"}
              labelPosition="left"
              label={<div className="text-sky-950 text-sm font-bold leading-snug">¿Cuenta con delivery gratis?</div>}
              color={colors.primary_button}
              checked={isFreeDelivery}
              size="sm"
              onChange={handleHasFreeDelivery}
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
                    Seleccione una imagen destacada
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                    Haga click o arrastre una imagen que sera usada junto con el usuario
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
