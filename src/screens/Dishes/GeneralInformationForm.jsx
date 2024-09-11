import { CloseIcon, Grid, Group, Image, SimpleGrid, Text, rem, InputBase, Combobox, useCombobox } from "@mantine/core"
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

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared, preloadImage }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)

  const categories = useSelector(selectAllDishesCategories)
  const status = useSelector(selectAllDishesCategoriesStatus)

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
    if (status === "succeeded" || status === "idle") {
      dispatch(fetchDishesCategories(user.restaurantId))
    }
  }, [])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="m-1 h-14 w-14 rounded-xl border object-cover object-center"
      />
    )
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-blue-100 bg-white p-4">
          <div className="flex w-full flex-col">
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

            <InputCheckbox name="includesDrink" register={register} />
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white p-4">
          {previews.length > 0 ? (
            <div className="w-full">
              <Text size="lg" inline className="mb-5 text-left">
                Imagen seleccionada:
              </Text>
              <div className="my-3 flex w-full flex-row items-center justify-center rounded-2xl border border-slate-200">
                <div className="flex w-full flex-row flex-wrap items-center gap-2 p-2">
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
                <div className="flex flex-col items-center">
                  <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                  <Text size="xl" inline className="text-center">
                    Seleccione una imagen
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                    Haga clic o arrastre la imagen del platillo
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
          {errors.files && <p className="w-full text-center text-red-500">* Imagen es requerida.</p>}
        </div>
      </Grid.Col>
    </Grid>
  )
}
