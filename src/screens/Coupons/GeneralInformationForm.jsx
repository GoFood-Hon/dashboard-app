import { useState } from "react"
import { Grid, Paper, Select } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { couponsTypes, promotionsDiscountType } from "../../utils/constants"
import InputField from "../../components/Form/InputField"
import { Controller } from "react-hook-form"
import { ImageDropzone } from "../../components/ImageDropzone"

export const GeneralInformationForm = ({ register, errors, setValue, control, image, offersData, watch, update }) => {
  const couponType = watch("couponType")
  const category = watch("category")
  const percentage = watch("percentage")
  const startDate = watch("startDate") ? new Date(watch("startDate")) : null
  const endDate = watch("endDate") ? new Date(watch("endDate")) : null
  const initialStartDate = offersData?.startDate ? new Date(offersData.startDate) : null
  const initialEndDate = offersData?.endDate ? new Date(offersData.endDate) : null
  const [dateRange, setDateRange] = useState({
    initialDate: initialStartDate || new Date(),
    endDate: initialEndDate || new Date()
  })

  const handleDateChange = (date, type) => {
    setDateRange((prevState) => ({
      ...prevState,
      [type]: date
    }))
    setValue(type === "initialDate" ? "startDate" : "endDate", date)
  }

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  return (
    <Grid>
      <Grid.Col order={{ base: 2, sm: 2, md: 2 }} span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12 }}>
              <InputField label="Titulo" name="title" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Tipo de descuento"
                    data={promotionsDiscountType.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    disabled={update}
                    defaultValue={category}
                    allowDeselect={false}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              {category === "fijo" ? (
                <InputField label="Monto" name="amount" register={register} errors={errors} />
              ) : (
                <Controller
                  name="percentage"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Porcentaje"
                      data={Array.from({ length: 20 }, (_, i) => {
                        const value = (i + 1) * 5
                        return {
                          value: value.toString(),
                          label: `${value}%`
                        }
                      })}
                      defaultValue={percentage}
                      allowDeselect={false}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Controller
                name="couponType"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Tipo de cupón"
                    data={couponsTypes.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    disabled={update}
                    defaultValue={couponType}
                    allowDeselect={false}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />
            </Grid.Col>
            {couponType === "fecha" ? (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DatePickerInput
                    value={startDate}
                    locale="es"
                    label="Fecha de inicio"
                    placeholder="Seleccionar fecha"
                    popoverProps={{ withinPortal: false }}
                    onChange={(val) => handleDateChange(val, "initialDate")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DatePickerInput
                    value={endDate}
                    locale="es"
                    label="Fecha de finalización"
                    placeholder="Seleccionar fecha"
                    popoverProps={{ withinPortal: false }}
                    onChange={(val) => handleDateChange(val, "endDate")}
                  />
                </Grid.Col>
              </>
            ) : (
              <Grid.Col span={{ base: 12 }}>
                <InputField label="Cantidad de usos" name="timesToUse" register={register} errors={errors} />
              </Grid.Col>
            )}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col order={{ base: 1, sm: 1, md: 2 }} span={{ base: 12, md: 4, lg: 4 }}>
        <ImageDropzone
          image={image}
          images={watch("files")}
          onDrop={handleDrop}
          error={errors?.files?.message}
          title="del cupón"
        />
      </Grid.Col>
    </Grid>
  )
}
