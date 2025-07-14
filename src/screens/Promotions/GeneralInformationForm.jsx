import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, MultiSelect, Paper, Select } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { discountAppliedTo, promotionsDiscountType } from "../../utils/constants"
import InputField from "../../components/Form/InputField"
import { Controller } from "react-hook-form"
import { getAllDishesList } from "../../store/features/promotionsSlice"
import { ImageDropzone } from "../../components/ImageDropzone"
import dayjs from "dayjs"

export const GeneralInformationForm = ({ register, errors, setValue, control, image, offersData, watch, update }) => {
  const allDishes = watch("allDishes")
  const category = watch("category")
  const percentage = watch("percentage")
  const startDate = watch("startDate") ? new Date(watch("startDate")) : null
  const endDate = watch("endDate") ? new Date(watch("endDate")) : null
  const dishesAlreadySelected = watch("Dishes")
  const dishes = useSelector((state) => state.promotions.dishesList)
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const [selectedDishes, setSelectedDishes] = useState([])
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

  useEffect(() => {
    const initialDishes = dishesAlreadySelected?.map((dish) => dish.id)
    setSelectedDishes(initialDishes || [])
  }, [offersData])

  useEffect(() => {
    dispatch(getAllDishesList(user.restaurantId))
  }, [allDishes])
  
  const handleDishesChange = (selected) => {
    setSelectedDishes(selected)
    setValue("Dishes", selected)
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
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Titulo" name="title" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Compra minima" name="minPurchase" register={register} errors={errors} />
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
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DatePickerInput
                value={startDate}
                locale="es"
                label="Fecha de inicio"
                placeholder="Seleccionar fecha"
                popoverProps={{ withinPortal: false }}
                onChange={(val) => handleDateChange(val, "initialDate")}
                minDate={dayjs().startOf("day").toDate()}
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
                minDate={dayjs().startOf("day").toDate()}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Controller
                name="allDishes"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Descuento se aplica a"
                    data={discountAppliedTo.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    disabled={update}
                    defaultValue={allDishes}
                    allowDeselect={false}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />
            </Grid.Col>
            {allDishes === "some" && (
              <Grid.Col span={{ base: 12 }}>
                <MultiSelect
                  label={`Productos ${update ? "seleccionados" : "disponibles"}`}
                  data={dishes?.map((item) => ({
                    value: item.id,
                    label: item.name
                  }))}
                  searchable
                  maxValues={10}
                  hidePickedOptions
                  onChange={handleDishesChange}
                  nothingFoundMessage="No se encontraron productos"
                  value={selectedDishes}
                  clearable
                  error={errors?.Dishes && errors?.Dishes?.message}
                />
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
          title="de la promoción"
        />
      </Grid.Col>
    </Grid>
  )
}
