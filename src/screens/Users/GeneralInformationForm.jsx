import React, { useEffect, useState } from "react"
import { CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { bytesToMB } from "../../utils"
import InputCombobox from "../../components/Form/InputCombobox"
import { USER_ROLES, userTypes } from "../../utils/constants"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared }) {
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const [role, setRole] = useState(USER_ROLES.administrator)

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

  const handleChangeRol = (value, name) => {
    setRole(name)
    setValue(value, name)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Nombre (Obligatorio)"
                name="firstName"
                register={register}
                errors={errors}
                className="text-black"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Apellidos (Obligatorio)"
                name="lastName"
                register={register}
                errors={errors}
                className="text-black"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo (Obligatorio)" name="email" register={register} errors={errors} className="text-black" />
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

            <Grid.Col span={{ base: 12 }}>
              <InputCombobox
                items={userTypes}
                placeholder="Seleccione el tipo de usuario"
                setValue={handleChangeRol}
                errors={errors}
                label="Tipo de usuario (Obligatorio)"
                name="role"
              />
            </Grid.Col>
            {role === USER_ROLES.driver && (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField
                    label="Id del vehículo"
                    name="motorcycleId"
                    register={register}
                    errors={errors}
                    className="text-black"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField
                    label="Numero de identidad"
                    name="nationalIdentityNumber"
                    register={register}
                    errors={errors}
                    className="text-black"
                  />
                </Grid.Col>
              </>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Contraseña"
                name="password"
                type="password"
                register={register}
                errors={errors}
                placeholder="Ingrese su contraseña"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                register={register}
                errors={errors}
                placeholder="Ingrese su contraseña nuevamente"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputTextAreaField label="Nota" name="note" register={register} errors={errors} />
            </Grid.Col>
          </Grid>
        </div>
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
