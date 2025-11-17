import { Grid, Paper, Select } from "@mantine/core"
import React, { useEffect } from "react"
import InputField from "../../components/Form/InputField"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { fetchNoPaginatedRestaurants } from "../../store/features/restaurantSlice"
import { Controller } from "react-hook-form"
import { ImageDropzone } from "../../components/ImageDropzone"

export const AdminGeneralInformationForm = ({ register, errors, setValue, image, control, watch }) => {
  const dispatch = useDispatch()
  const { allRestaurants } = useSelector((state) => state.restaurants)

  useEffect(() => {
    dispatch(fetchNoPaginatedRestaurants())
  }, [dispatch])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
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
            <Grid.Col span={{ base: 12 }}>
              <Controller
                name="restaurantId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Comercio asignado"
                    data={allRestaurants.map((item) => ({
                      value: item.id,
                      label: item.name
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={(val) => field.onChange(val ?? "")}
                    error={fieldState.error ? fieldState.error.message : null}
                    nothingFoundMessage="No se encontró ningún comercio"
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
