import {
  CloseIcon,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Text,
  rem,
  InputBase,
  Combobox,
  useCombobox,
  Paper,
  Stack,
  TagsInput,
  MultiSelect,
  Flex
} from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import React, { useEffect, useState } from "react"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import { bytesToMB } from "../../utils"
import InputCheckbox from "../../components/Form/InputCheckbox"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchDishesCategories,
  selectAllDishesCategories,
  selectAllDishesCategoriesStatus
} from "../../store/features/categorySlice"
import { fetchAllDishesTags } from "../../store/features/kitchenAndTagsSlice"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared, image, data }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const tags = useSelector((state) => state.kitchenAndTags.dishTags)
  const categories = useSelector(selectAllDishesCategories)
  const status = useSelector(selectAllDishesCategoriesStatus)
  const [selectedTags, setSelectedTags] = useState([])
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
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

  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  useEffect(() => {
    if (isDataCleared) {
      deleteImage()
    }
  }, [isDataCleared])

  useEffect(() => {
    const initialTags = data?.tags?.map((tag) => tag.id)
    setSelectedTags(initialTags)
  }, [data])

  useEffect(() => {
    if (status === "succeeded" || status === "idle") {
      dispatch(fetchDishesCategories(user.restaurantId))
    }
  }, [])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image radius="md" h={250} src={imageUrl} />
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" className="flex h-full w-full items-center justify-center rounded-2xl p-4">
          <Stack>
            <InputField
              label="Nombre (Obligatorio)"
              name="name"
              register={register}
              errors={errors}
              placeholder="Ej. Pollo con papas"
              className="text-black"
            />

            <InputTextAreaField
              label="Descripción (Obligatorio)"
              name="description"
              register={register}
              errors={errors}
              placeholder="Ej. Rico pollo con papas, salsas..."
            />

            <MultiSelect
              label="Lista de tags (Obligatorio)"
              data={tags.map((item) => ({
                value: item.id,
                label: item.name
              }))}
              searchable
              maxValues={10}
              hidePickedOptions
              onChange={handleTagsChange}
              nothingFoundMessage="No se encontraron tags"
              value={selectedTags}
              clearable
            />

            <InputCheckbox label="¿Incluye bebida?" name="includesDrink" register={register} />
          </Stack>
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
                      Haga clic o arrastre la imagen del platillo
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
