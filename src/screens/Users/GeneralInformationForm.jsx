import { useEffect, useState } from "react"
import { Grid, Paper, Select, Text, rem, Image, MultiSelect } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import { userTypes } from "../../utils/constants"
import { Controller } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { fetchNoPaginatedBranches } from "../../store/features/branchesSlice"
import { ImageDropzone } from "../../components/ImageDropzone"
import { useDisclosure } from "@mantine/hooks"

export default function GeneralInformationForm({ register, errors, setValue, control, image, newUser, watch, edit }) {
  const dispatch = useDispatch()
  const selectedRole = watch("role")
  const [role, setRole] = useState(watch("role"))
  const user = useSelector((state) => state.user.value)
  const branchesList = useSelector((state) => state.branches.branches)
  const [sucursalIds, setSucursalIds] = useState([])
  const [deletedSucursalIds, setDeletedSucursalIds] = useState([])
  const [newSucursalIds, setNewSucursalIds] = useState([])
  const selectedSucursalIds = watch("driverSucursals")
  const selectedSucursalId = [{ id: watch("sucursalId") }]
  const [visible, { toggle }] = useDisclosure(false)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  const handleSucursalIds = (selected) => {
    if ((role || selectedRole) === "driver" && edit) {
      const currentSucursalIds = selectedSucursalIds.map((item) => item.id)
      const removedIds = sucursalIds.filter((id) => !selected.includes(id))
      const validRemovedIds = removedIds.filter((id) => currentSucursalIds.includes(id))
      const addedIds = selected.filter((id) => !sucursalIds.includes(id))
      const validAddedIds = addedIds.filter((id) => !currentSucursalIds.includes(id))

      setDeletedSucursalIds((prev) => {
        const updatedDeleted = [...prev, ...validRemovedIds]
        setValue("deletedSucursals", updatedDeleted)
        return updatedDeleted
      })

      setNewSucursalIds((prev) => {
        const filteredNewSucursalIds = prev.filter((id) => !removedIds.includes(id))
        const updatedNew = [...filteredNewSucursalIds, ...validAddedIds]
        setValue("newSucursals", updatedNew)
        return updatedNew
      })

      setSucursalIds(selected)
      setValue("sucursalIdsDriver", selected)
    } else if ((role || selectedRole) !== "driver" && edit) {
      setSucursalIds(selected)
      setValue("sucursalId", selected)
    } else {
      setSucursalIds(selected)
      setValue("sucursalIds", selected)
    }
  }

  useEffect(() => {
    if ((role || selectedRole) === "driver") {
      if (selectedSucursalIds && Array.isArray(selectedSucursalIds)) {
        const ids = selectedSucursalIds.map((item) => item.id)
        setSucursalIds(ids)
      }
    } else {
      if (selectedSucursalIds && Array.isArray(selectedSucursalId)) {
        const ids = selectedSucursalId.map((item) => item.id)
        setSucursalIds(ids)
      }
    }
  }, [selectedSucursalIds])

  useEffect(() => {
    dispatch(fetchNoPaginatedBranches({ restaurantId: user.Restaurant.id }))
  }, [])

  const handleChangeRol = (value, name) => {
    setRole(value)
    setValue(value, name)
    setSucursalIds([])
    setValue("sucursalIds", [])
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

            <Grid.Col span={{ base: 12 }}>
              <MultiSelect
                label={
                  (role || selectedRole) === "driver" ? "Sucursales asignadas (Obligatorio)" : "Sucursal asignada (Obligatorio)"
                }
                data={branchesList?.map((item) => ({
                  value: item.id,
                  label: item.name
                }))}
                maxValues={(role || selectedRole) === "driver" ? undefined : 1}
                searchable
                hidePickedOptions
                onChange={handleSucursalIds}
                nothingFoundMessage="No se encontraron sucursales"
                value={sucursalIds}
                error={errors.sucursalIds ? errors.sucursalIds.message : null}
              />
            </Grid.Col>
            {newUser && (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField
                    label="Contraseña"
                    name="password"
                    type="password"
                    register={register}
                    errors={errors}
                    visible={visible}
                    onToggleVisibility={toggle}
                    newPassword
                    watch={watch}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <InputField
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    type="password"
                    register={register}
                    errors={errors}
                    visible={visible}
                    onToggleVisibility={toggle}
                    newPassword
                    watch={watch}
                  />
                </Grid.Col>
              </>
            )}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <ImageDropzone
          image={image}
          images={watch("files")}
          onDrop={handleDrop}
          error={errors?.files?.message}
          title="del usuario"
        />
      </Grid.Col>
    </Grid>
  )
}
