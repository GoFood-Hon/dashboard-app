import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, MultiSelect, Paper, Select } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
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

  // ✅ now + 1 minuto en tiempo real
  const [nowPlusOne, setNowPlusOne] = useState(() => dayjs().add(1, "minute"))

  useEffect(() => {
    const id = setInterval(() => setNowPlusOne(dayjs().add(1, "minute")), 1000)
    return () => clearInterval(id)
  }, [])

  const handleDateChange = (date, type) => {
    setValue(type === "initialDate" ? "startDate" : "endDate", date, {
      shouldDirty: true,
      shouldValidate: true
    })
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
    if (acceptedFiles.length > 0) setValue("files", acceptedFiles)
  }

  // ✅ helper: minTime dinámico (HH:mm) solo si la fecha es HOY
  const getMinTimeIfToday = (date) => {
    if (!date) return undefined
    const isToday = dayjs(date).isSame(dayjs(), "day")
    return isToday ? nowPlusOne.format("HH:mm") : undefined
  }

  const startMinTime = useMemo(() => getMinTimeIfToday(startDate), [startDate, nowPlusOne])
  const endMinTime = useMemo(() => getMinTimeIfToday(endDate), [endDate, nowPlusOne])

  // ✅ auto-corrección para START (si hoy y quedó atrás -> now+1)
  useEffect(() => {
    if (update) return
    if (!startDate) return

    const s = dayjs(startDate)
    if (s.isSame(dayjs(), "day") && s.isBefore(nowPlusOne)) {
      setValue("startDate", nowPlusOne.toDate(), { shouldDirty: true, shouldValidate: true })
    }
  }, [nowPlusOne, startDate, setValue, update])

  // ✅ auto-corrección para END (si hoy y quedó atrás -> now+1)
  useEffect(() => {
    if (update) return
    if (!endDate) return

    const e = dayjs(endDate)
    if (e.isSame(dayjs(), "day") && e.isBefore(nowPlusOne)) {
      setValue("endDate", nowPlusOne.toDate(), { shouldDirty: true, shouldValidate: true })
    }
  }, [nowPlusOne, endDate, setValue, update])

  // ✅ regla adicional: end >= start + 1 minuto (si ambos existen)
  useEffect(() => {
    if (update) return
    if (!startDate || !endDate) return

    const minEnd = dayjs(startDate).add(1, "minute")
    if (dayjs(endDate).isBefore(minEnd)) {
      setValue("endDate", minEnd.toDate(), { shouldDirty: true, shouldValidate: true })
    }
  }, [startDate, endDate, setValue, update])

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
                        return { value: value.toString(), label: `${value}%` }
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
              <DateTimePicker
                value={startDate}
                locale="es"
                label="Fecha y hora de inicio"
                placeholder="Seleccionar fecha"
                popoverProps={{ withinPortal: false }}
                onChange={(val) => handleDateChange(val, "initialDate")}
                minDate={dayjs().startOf("day").toDate()}
                disabled={update}
                timePickerProps={{
                  min: startMinTime, // ✅ HH:mm dinámico si es hoy
                  withDropdown: true
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateTimePicker
                value={endDate}
                locale="es"
                label="Fecha y hora de finalización"
                placeholder="Seleccionar fecha"
                popoverProps={{ withinPortal: false }}
                onChange={(val) => handleDateChange(val, "endDate")}
                minDate={dayjs().startOf("day").toDate()}
                disabled={update}
                timePickerProps={{
                  min: endMinTime, // ✅ HH:mm dinámico si es hoy
                  withDropdown: true
                }}
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
                  data={dishes?.map((item) => ({ value: item.id, label: item.name }))}
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
