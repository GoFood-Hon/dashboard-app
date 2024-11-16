import React, { useEffect, useState } from "react"
import { CloseIcon, Grid, Group, Paper, Select, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { bytesToMB } from "../../utils"
import InputCombobox from "../../components/Form/InputCombobox"
import { USER_ROLES, userTypes } from "../../utils/constants"
import { Controller } from "react-hook-form"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared, control }) {
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const [role, setRole] = useState(USER_ROLES.administrator)

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

  const handleChangeRol = (value, name) => {
    console.log('Sii')
    setRole(name)
    setValue(value, name)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" className="w-full h-full items-center justify-center flex  rounded-2xl p-4">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} className="text-black" />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo (Obligatorio)" name="email" register={register} errors={errors} className="text-black" />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Teléfono (Obligatorio)"
                countryPrefix="+504"
                name="phoneNumber"
                register={register}
                errors={errors}
                className="text-black"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Controller
                name="role"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Rol del usuario (Obligatorio)"
                    data={userTypes}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={(value, name) => {
                      field.onChange(value)
                      handleChangeRol(value, name)
                    }}
                    error={fieldState.error ? fieldState.error.message : null}
                    searchable
                    clearable
                  />
                )}
              />
            </Grid.Col>
            {role === 'driver' && (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField label="Id del vehículo" name="motorcycleId" register={register} errors={errors} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField label="Numero de identidad" name="nationalIdentityNumber" register={register} errors={errors} />
                </Grid.Col>
              </>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Contraseña" name="password" type="password" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                register={register}
                errors={errors}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputTextAreaField label="Nota" name="note" register={register} errors={errors} />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <Paper withBorder radius="md" className="flex flex-col justify-center items-center w-full h-full rounded-2xl  p-4">
          {previews.length > 0 ? (
            <div className="w-full">
              <Text size="lg" inline className="text-left mb-5">
                Imagen seleccionada:
              </Text>
              <div className="flex flex-row justify-center items-center rounded-2xl w-full my-3">
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
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
