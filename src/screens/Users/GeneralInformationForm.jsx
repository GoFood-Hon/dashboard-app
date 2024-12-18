import React, { useEffect, useState } from "react"
import { Flex, Grid, Paper, Select, Text, rem, Image, MultiSelect } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import InputField from "../../components/Form/InputField"
import { userTypes } from "../../utils/constants"
import { Controller } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { fetchNoPaginatedBranches } from "../../store/features/branchesSlice"

export default function GeneralInformationForm({
  register,
  errors,
  setValue,
  isDataCleared,
  control,
  image,
  data,
  newUser,
  watch,
  edit
}) {
  const dispatch = useDispatch()
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const selectedRole = watch("role")
  const [role, setRole] = useState(watch("role"))
  const user = useSelector((state) => state.user.value)
  const branchesList = useSelector((state) => state.branches.branches)
  const [sucursalIds, setSucursalIds] = useState([])
  const selectedSucursalIds = watch("sucursalId")

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

  const handleSucursalIds = (selected) => {
    setSucursalIds(selected)
    setValue("sucursalIds", selected)
  }

  useEffect(() => {
    setSucursalIds(selectedSucursalIds)
  }, [selectedSucursalIds])

  useEffect(() => {
    dispatch(fetchNoPaginatedBranches({ restaurantId: user.Restaurant.id }))
  }, [])

  useEffect(() => {
    if (isDataCleared) {
      deleteImage()
    }
  }, [isDataCleared])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image radius="md" h={250} src={imageUrl} />
  })

  const handleChangeRol = (value, name) => {
    setRole(value)
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
                    disabled={edit}
                    label="Rol del usuario (Obligatorio)"
                    data={userTypes.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={(value, name) => {
                      field.onChange(value)
                      handleChangeRol(value, name)
                    }}
                    error={fieldState.error ? fieldState.error.message : null}
                    searchable
                  />
                )}
              />
            </Grid.Col>
            {(role || selectedRole) === "driver" && (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField label="Id del vehículo" name="Driver.motorcycleId" register={register} errors={errors} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField
                    label="Número de identidad"
                    name="Driver.nationalIdentityNumber"
                    register={register}
                    errors={errors}
                  />
                </Grid.Col>
              </>
            )}

            {(role || selectedRole) === "driver" ? (
              <Grid.Col span={{ base: 12 }}>
                <MultiSelect
                  label="Sucursales asignadas (Obligatorio)"
                  data={branchesList?.map((item) => ({
                    value: item.id,
                    label: item.name
                  }))}
                  searchable
                  hidePickedOptions
                  onChange={handleSucursalIds}
                  nothingFoundMessage="No se encontraron sucursales"
                  value={sucursalIds}
                  clearable
                />
              </Grid.Col>
            ) : (
              <Grid.Col>
                <Controller
                  name="sucursalId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Sucursal asignada"
                      data={branchesList.map((item) => ({
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
            )}
            {newUser && (
              <>
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
              </>
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
                      Haga clic o arrastre la imagen del usuario
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
