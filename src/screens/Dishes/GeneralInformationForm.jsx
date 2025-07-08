import { useEffect, useState } from "react"
import { Grid, Paper, MultiSelect, Select, Flex } from "@mantine/core"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import InputCheckbox from "../../components/Form/InputCheckbox"
import { useDispatch, useSelector } from "react-redux"
import { fetchDishesCategories, selectAllDishesCategoriesStatus } from "../../store/features/categorySlice"
import { fetchAllDishesTags } from "../../store/features/kitchenAndTagsSlice"
import { Controller } from "react-hook-form"
import { preparationTime, taxesValues } from "../../utils/constants"
import { ImageDropzone } from "../../components/ImageDropzone"

export default function GeneralInformationForm({ register, errors, setValue, image, data, control, watch }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const tags = useSelector((state) => state.kitchenAndTags.dishTags)
  const status = useSelector(selectAllDishesCategoriesStatus)
  const [selectedTags, setSelectedTags] = useState([])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  useEffect(() => {
    dispatch(fetchAllDishesTags())
  }, [dispatch])

  const handleTagsChange = (selected) => {
    setSelectedTags(selected)
    setValue("tags", selected)
  }

  useEffect(() => {
    const initialTags = data?.tags?.map((tag) => tag.id)
    setSelectedTags(initialTags)
  }, [data])

  useEffect(() => {
    if (status === "succeeded" || status === "idle") {
      dispatch(fetchDishesCategories(user.restaurantId))
    }
  }, [])

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" h="100%" p="md">
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputTextAreaField label="Descripción (Obligatorio)" name="description" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <MultiSelect
                label="Lista de categorías (Obligatorio)"
                data={tags?.map((item) => ({
                  value: item.id,
                  label: item.name
                }))}
                searchable
                maxValues={10}
                hidePickedOptions
                onChange={handleTagsChange}
                nothingFoundMessage="No se encontraron categorías"
                value={selectedTags}
                error={errors?.tags?.message}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Precio inicial (Obligatorio)" name="price" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Controller
                name="preparationTime"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Tiempo de preparación (Obligatorio)"
                    data={preparationTime.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Controller
                name="taxRate"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Porcentaje de impuestos (Obligatorio)"
                    data={taxesValues.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col className="mt-4" span={{ base: 12, md: 6 }}>
              <InputCheckbox label="¿Incluye bebida?" name="includesDrink" register={register} labelPosition="right" />
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
          title="del producto"
        />
      </Grid.Col>
    </Grid>
  )
}
